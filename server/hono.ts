import type { LanguageVariables } from "hono/language";

import { hc } from "hono/client";
import { createFactory } from "hono/factory";

import type { BetterAuthServerContext } from "../shared/auth/server";
import type { APIRoutes } from "./routes/api";

export type APIClientForSSR = ReturnType<typeof hc<APIRoutes>>;

export function createAPIClient(...args: Parameters<typeof hc>): APIClientForSSR {
  return hc<APIRoutes>(...args);
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
