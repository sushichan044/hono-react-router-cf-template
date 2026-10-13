import { createClient } from "@libsql/client";
import { migrate } from "drizzle-orm/libsql/migrator";
import { test as baseTest } from "vite-plus/test";

import { createDrizzleSQLite } from "../db/client";
import { localOrigin } from "../url";
import { createBetterAuthServer } from "./server";

const test = baseTest
  .extend("db", async ({}, { onCleanup }) => {
    const client = createClient({ url: ":memory:" });
    onCleanup(() => {
      client.close();
    });

    const db = createDrizzleSQLite(client);
    await migrate(db, { migrationsFolder: "shared/db/migrations" });
    return db;
  })
  .extend("auth", ({ db }) => createBetterAuthServer(db, { baseURL: localOrigin }));

test("database sessions can be retrieved and revoked", async ({ auth, db, expect }) => {
  const { internalAdapter } = await auth.$context;
  const user = await internalAdapter.createUser(
    {
      email: "session@example.com",
      emailVerified: false,
      name: "Session User",
    },
    { method: "email-password" },
  );
  const session = await internalAdapter.createSession(user.id);
  expect(session).not.toBeNull();
  const userWithSessions = await db.query.users.findFirst({
    where: { id: user.id },
    with: { sessions: { with: { user: true } } },
  });
  expect(userWithSessions?.sessions).toHaveLength(1);
  expect(userWithSessions?.sessions[0]?.user?.id).toBe(user.id);

  expect((await internalAdapter.findSession(session.token))?.user.id).toBe(user.id);
  await internalAdapter.deleteSession(session.token);
  expect(await internalAdapter.findSession(session.token)).toBeNull();
});

test("a database verification value can be consumed only once", async ({ auth, expect }) => {
  const { internalAdapter } = await auth.$context;
  await internalAdapter.createVerificationValue({
    expiresAt: new Date(Date.now() + 60_000),
    identifier: "single-use-token",
    value: "verification-value",
  });

  expect((await internalAdapter.consumeVerificationValue("single-use-token"))?.value).toBe(
    "verification-value",
  );
  expect(await internalAdapter.consumeVerificationValue("single-use-token")).toBeNull();
});
