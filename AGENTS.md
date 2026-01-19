# AGENTS.md

## Development Scripts

### Quality Checks

YOU MUST check all quality checks passing before ending task.

```bash
pnpm run format
pnpm run lint:fix
pnpm run typecheck
pnpm run test
```

## Directory Overview

```plaintext
.
├── app # React Router application, React 19, TailwindCSS v4
├── dev # Local development utils
├── server
│   └── app.ts # Hono API entrypoint
├── shared
│   ├── auth # Better Auth
│   │   ├── client.ts # SDK for React Client
│   │   └── server.ts # SDK for Hono Server
│   └── db # Drizzle ORM schema and migrations. See shared/db/README.md
│       └── migrations
└── vite.config.ts # Vite and Vitest config
```

## Tech Stack

- `app/`: React 19, React Router 7, TailwindCSS v4
  - Since we are using React Compiler, we don't need to write `useMemo`, `uesCallback`, `memo` by myself.
  - See `app/app.css` for TailwindCSS setup.
  - Using Base UI as a headless component library. See base-ui skill for details.
  - Use tailwindcss skill for TailwindCSS v4 advanced features.
- `shared/`: Better Auth, Drizzle ORM
  - Use better-auth MCP to access knowledge about Better Auth.
- `server/`: Hono API Server
  - Use `hono` CLI to access Hono docs. See hono-cli skill for details.

### Connecting React Router and Hono

Hono is serving the React Router app by using `createRequestHandler` from `react-router`. See `server/app.ts` for details.

We passing values from Hono to React Router loader/actions via React Router's context. See `app/context.server.ts` and `server/app.ts` for details.

### Vitest

We are using Vitest for testing.

Use `.node.test.{ts,tsx}` for node runtime tests like testing logic, and use `.browser.test.{ts,tsx}` for browser runtime tests like testing React components.

When running node runtime tests only, use `pnpm run test:node`.
When running browser runtime tests only, use `pnpm run test:browser`.

Use `vitest-browser-react` skill for testing React components in Vitest Browser Mode.
