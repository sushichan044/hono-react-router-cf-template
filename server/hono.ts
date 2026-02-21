// import type { ApplyGlobalResponse } from "hono/client";
import type { LanguageVariables } from "hono/language";

import { hc } from "hono/client";
import { createFactory } from "hono/factory";

import type { BetterAuthServerContext } from "../shared/auth/server";
import type { APIRoutes } from "./routes/api";

type HonoRPCSchema = APIRoutes;
export type APIClientForSSR = ReturnType<typeof hc<HonoRPCSchema>>;

export function createAPIClient(...args: Parameters<typeof hc>): APIClientForSSR {
  return hc<HonoRPCSchema>(...args);
}

export type APIClientFactoryForSSR = (browserHeaders: Headers) => APIClientForSSR;

type HonoConfig = {
  Bindings: CloudflareBindings;
  Variables: LanguageVariables & {
    auth: BetterAuthServerContext;
    createAPIClientForSSR: APIClientFactoryForSSR;
  };
};

/**
 * @package
 */
export const honoFactory = createFactory<HonoConfig>();
