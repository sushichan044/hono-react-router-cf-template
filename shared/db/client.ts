import type { Client } from "@libsql/client";
import type { AnyD1Database } from "drizzle-orm/d1";
import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle as drizzleSQLite } from "drizzle-orm/libsql";

import { authRelations } from "./auth-schema";

export const createDrizzleSQLite = (libsql: Client) => {
  return drizzleSQLite({ client: libsql, relations: authRelations });
};

export const createDrizzleD1 = (d1: AnyD1Database) => {
  return drizzleD1(d1, { relations: authRelations });
};
