import { honoFactory } from "../hono";

export const requireAuth = honoFactory.createMiddleware(async (c, next) => {
  const auth = c.get("auth");

  if (!auth.context) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return await next();
});
