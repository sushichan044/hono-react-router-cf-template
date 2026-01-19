import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { HTTPException } from "hono/http-exception";
import { languageDetector } from "hono/language";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { createRequestHandler, RouterContextProvider } from "react-router";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore virtual module provided by React Router at build time
import * as build from "virtual:react-router/server-build";

import { apiClientFactoryForSSRContext, authContext } from "../app/context.server";
import { createBetterAuthServer } from "../shared/auth/server";
import { createDrizzleD1 } from "../shared/db/client";
import { localOrigin, prodOrigin } from "../shared/url";
import { createAPIClient, honoFactory } from "./hono";
import { apiRoutes } from "./routes/api";
import { createBetterAuthSecondaryKVStorage } from "./storage";

const app = honoFactory.createApp();

if (import.meta.env.DEV) {
  app.use("*", logger());
}

// Set variables expected by honoFactory
app.use(
  "*",
  secureHeaders(),
  cors({
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    origin: [localOrigin, prodOrigin],
  }),
  csrf({
    origin: [localOrigin, prodOrigin],
  }),
  languageDetector({
    caches: false,
    fallbackLanguage: "ja",
    // using cookie breaks behavior of better-auth session management
    order: ["header", "path", "querystring"],
    supportedLanguages: ["en", "ja"],
  }),

  async (c, next) => {
    c.set("createAPIClientForSSR", (headers) => {
      return createAPIClient(new URL("/api", c.req.url).toString(), {
        init: {
          // propagate cookies for session management
          headers,
        },
      });
    });

    const baseURL = import.meta.env.PROD ? new URL(c.req.url).origin : localOrigin;

    const auth = createBetterAuthServer(createDrizzleD1(c.env.DB), {
      baseURL,
      credentials: {},
      secondaryStorage: createBetterAuthSecondaryKVStorage(c.env.BETTER_AUTH_SECONDARY_KV),
    });

    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    c.set("auth", {
      baseURL,
      context: session,
      sdk: auth,
    });

    await next();
  },
);
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});
app.route("/api", apiRoutes);

const reactRouterHandler = createRequestHandler(build, import.meta.env.MODE);
app.all("*", async (c) => {
  const rrCtx = new RouterContextProvider();

  apiClientFactoryForSSRContext.set(rrCtx, c.get("createAPIClientForSSR"));
  authContext.set(rrCtx, c.get("auth"));

  return reactRouterHandler(c.req.raw, rrCtx);
});

app.onError((err, c) => {
  console.error(err);

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json({ message: "Internal Server Error" }, 500);
});

/**
 * @package
 */
export default app;
