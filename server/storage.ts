import type { SecondaryStorage } from "better-auth";

export function createBetterAuthSecondaryKVStorage(kv: KVNamespace<string>): SecondaryStorage {
  // ref: https://github.com/zpg6/better-auth-cloudflare/blob/7855d88fab90b6e8c95b8379ef7d02f72d82217d/src/index.ts#L121-L140
  // MIT License
  return {
    delete: async (key) => {
      return kv.delete(key);
    },
    get: async (key) => {
      return kv.get(key);
    },
    set: async (key, value, ttl) => {
      if (ttl !== undefined) {
        // Cloudflare KV requires TTL >= 60 seconds
        const minTtl = 60;
        if (ttl < minTtl) {
          console.warn(
            `[createBetterAuthSecondaryKVStorage] TTL ${ttl}s is less than KV minimum of ${minTtl}s. Using ${minTtl}s instead.`,
          );
          ttl = minTtl;
        }
        return kv.put(key, value, { expirationTtl: ttl });
      }

      return kv.put(key, value);
    },
  };
}
