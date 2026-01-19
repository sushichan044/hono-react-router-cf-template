/**
 * drizzle-kit has responsibility to manage production migrations.
 *
 * Local migration is performed by `wrangler d1 migrations apply` command.
 */
import { defineConfig } from "drizzle-kit";

// NOTE: process.env values are only used in production migrations and set via Workers Builds.
export default defineConfig({
  dbCredentials: {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    accountId: process.env["CLOUDFLARE_ACCOUNT_ID"]!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    databaseId: process.env["CLOUDFLARE_D1_DATABASE_ID"]!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    token: process.env["CLOUDFLARE_D1_TOKEN"]!,
  },
  dialect: "sqlite",
  driver: "d1-http",
  out: "./shared/db/migrations/",
  schema: "./shared/db/schema.ts",
});
