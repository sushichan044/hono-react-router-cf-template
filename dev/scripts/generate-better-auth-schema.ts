import $ from "dax";

import pkg from "../../package.json" with { type: "json" };

const betterAuthVersion = pkg.dependencies["better-auth"];

await $`pnpm dlx @better-auth/cli@${betterAuthVersion} generate --config dev/auth.ts --output shared/db/auth-schema.ts -y`;
await $`pnpm run lint:fix shared/db/auth-schema.ts`;
await $`pnpm run format shared/db/auth-schema.ts`;
