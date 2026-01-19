import { honoFactory } from "../../hono";

const app = honoFactory.createApp();

export const apiRoutes = app
  .get("/auth/*", async (c) => {
    const auth = c.get("auth");

    return auth.sdk.handler(c.req.raw);
  })
  .post("/auth/*", async (c) => {
    const auth = c.get("auth");

    return auth.sdk.handler(c.req.raw);
  });

export type APIRoutes = typeof apiRoutes;
