import type { SecondaryStorage } from "better-auth";

import { createClient } from "@libsql/client";

import { createBetterAuthServer } from "../shared/auth/server";
import { createDrizzleSQLite } from "../shared/db/client";
import { localOrigin } from "../shared/url";

// used by ./tools/generate-better-auth-schema.ts
const betterAuthForCodeGen = createBetterAuthServer(
  createDrizzleSQLite(createClient({ url: ":memory:" })),
  {
    baseURL: localOrigin,
    credentials: {
      spotify: {
        clientId: "your_spotify_client_id",
        clientSecret: "your_spotify_client_secret",
      },
    },
    secondaryStorage: createBetterAuthSecondaryInMemoryStorage(),
  },
);

function createBetterAuthSecondaryInMemoryStorage(): SecondaryStorage {
  const store = new Map<string, { expiresAt?: number; value: string }>();

  return {
    delete: (key) => {
      store.delete(key);
    },
    get: (key) => {
      const entry = store.get(key);
      if (!entry) {
        return null;
      }

      // Check for expiration
      if (entry.expiresAt != null && Date.now() > entry.expiresAt) {
        store.delete(key);
        return null;
      }

      return entry.value;
    },
    set: (key, value, ttl) => {
      let expiresAt: number | undefined;
      if (ttl !== undefined) {
        expiresAt = Date.now() + ttl * 1000; // Convert seconds to milliseconds
      }
      store.set(key, { expiresAt, value });
    },
  };
}

export default betterAuthForCodeGen;
