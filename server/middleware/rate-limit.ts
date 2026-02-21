import type { JSONRespondReturn } from "hono";

import { rateLimiter } from "hono-rate-limiter";

import { IP_ADDRESS_HEADER } from "../../shared/url";
import { honoFactory } from "../hono";

type RateLimitedResponse = JSONRespondReturn<{ error: string }, 429>;
export const rateLimitExternalSpotifyAPI = honoFactory.createMiddleware<
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  {},
  RateLimitedResponse
>(async (c, next) =>
  // @ts-expect-error hono-rate-limiter does not preserve handler response type
  rateLimiter({
    binding: c.env.RATE_LIMITER,
    handler: (c) => c.json({ error: "Too Many Requests" }, 429) satisfies RateLimitedResponse,
    keyGenerator: (c) => c.req.header(IP_ADDRESS_HEADER) ?? "",
  })(
    // @ts-expect-error Context type does not match
    c,
    next,
  ),
);
