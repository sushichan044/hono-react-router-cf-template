import type { SecondaryStorage } from "better-auth";
import type { DB as DrizzleDB } from "better-auth/adapters/drizzle";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { username } from "better-auth/plugins";
import { lastLoginMethod } from "better-auth/plugins";

import * as schema from "../db/schema";
import { IP_ADDRESS_HEADER, localOrigin, prodOrigin, prodOriginAllSubdomains } from "../url";

const initDrizzleAdapter = (db: DrizzleDB) => {
  return drizzleAdapter(db, {
    provider: "sqlite",
    schema,
    transaction: false, // D1 does not support transactions
    usePlural: true,
  });
};

type BetterAuthParams = {
  baseURL: string;
  credentials?: unknown; // extend this when using social login providers
  secondaryStorage: SecondaryStorage;
};

const serverPlugins = [username(), lastLoginMethod()];

/**
 * Create a BetterAuth instance using Drizzle ORM.
 *
 * @param db Drizzle Client Instance. Usually returned from `drizzle()` function.
 * @returns BetterAuth Instance.
 */
export const createBetterAuthServer = (db: DrizzleDB, params: BetterAuthParams) => {
  return betterAuth({
    advanced: {
      ipAddress: {
        ipAddressHeaders: [IP_ADDRESS_HEADER],
      },
    },
    baseURL: params.baseURL,
    database: initDrizzleAdapter(db),
    plugins: serverPlugins,
    rateLimit: {
      enabled: true,
      max: 100,
      modelName: "rateLimit",
      storage: "database",
      window: 60,
    },
    secondaryStorage: params.secondaryStorage,
    trustedOrigins: [localOrigin, prodOrigin, prodOriginAllSubdomains],
  });
};

type BetterAuthServerInstance = ReturnType<typeof createBetterAuthServer>;

export type BetterAuthServerContext = {
  baseURL: string;
  context: BetterAuthServerInstance["$Infer"]["Session"] | null;
  sdk: BetterAuthServerInstance;
};
