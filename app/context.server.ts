import type { RouterContextProvider } from "react-router";

import { createContext } from "react-router";

import type { APIClientFactoryForSSR } from "../server/hono";
import type { BetterAuthServerContext } from "../shared/auth/server";

// `createContext()` should be executed in React Router's runtime.
// So, placing it here, not in workers/app.ts
function createContextWithAccessor<T>() {
  const ctx = createContext<T>();

  return {
    get: (provider: Readonly<RouterContextProvider>) => provider.get(ctx),
    set: (provider: RouterContextProvider, value: T) => provider.set(ctx, value),
  };
}

export const apiClientFactoryForSSRContext = createContextWithAccessor<APIClientFactoryForSSR>();

export const authContext = createContextWithAccessor<BetterAuthServerContext>();
