# Database and authentication schema

The application uses Cloudflare D1 with Drizzle ORM 1.0 RC and Relations v2. Better Auth stores users,
accounts, sessions, verification records, and rate limits in D1. D1 supports the
atomic operations required for single-use verification records; Workers KV does not.

- `auth-schema.ts` is generated from `shared/auth/server.ts` and `dev/auth.ts`.
- `schema.ts` exports the tables and relations passed to Drizzle and Better Auth.
- `client.ts` creates D1 clients for Workers and libSQL clients for Node.js tooling,
  passing the generated `authRelations` to the Relations v2 query API.
- `migrations/` uses the Drizzle v3 directory format. Each timestamped directory
  contains `migration.sql` and `snapshot.json`. Keep applied SQL unchanged.

## Update the schema

After changing Better Auth options or plugins, regenerate and validate the schema:

```bash
vp run generate:auth
vp exec auth check schema --config dev/auth.ts
```

Generate a SQL migration for changes to the generated schema or application tables:

```bash
vp run db:generate
```

Review the generated SQL before applying it. When upgrading from the previous
Workers KV configuration, apply the session-table migration before deploying the
application. Existing KV sessions are not migrated, so users must sign in again.
The old KV namespace can be retired after the deployment.

## Apply migrations

Production migrations use Drizzle Kit through the Cloudflare D1 HTTP API, as
shown in the [Drizzle D1 guide](https://orm.drizzle.team/docs/guides/d1-http-with-drizzle-kit).
Set `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID`, and
`CLOUDFLARE_D1_TOKEN` in the environment running the command. The token needs D1
edit permissions. Drizzle Kit tracks applied migrations in `__drizzle_migrations`.

Local development uses Wrangler's local D1 database and `d1_migrations` history.
The binding, migration directory, and recursive `migrations_pattern` are configured
in `wrangler.jsonc` so Wrangler can discover Drizzle v3 migration files.

```bash
# Apply migrations to the local development database.
vp run db:migrate

# Apply migrations to remote D1 using the configured HTTP credentials.
vp run db:migrate:prod
```

Keep each database's existing migration tool and history. For a remote database
previously migrated with Drizzle Kit, continue using Drizzle Kit. If a remote
database was migrated with Wrangler, reconcile its applied migrations with
`__drizzle_migrations` before switching tools; do not replay existing SQL.

See the [Better Auth Drizzle adapter documentation](https://better-auth.com/docs/adapters/drizzle),
[Better Auth CLI documentation](https://better-auth.com/docs/concepts/cli), and
[Cloudflare D1 migration documentation](https://developers.cloudflare.com/d1/reference/migrations/).

## Upgrade an existing local Wrangler migration history

Drizzle Kit 1.0 changes migration paths without changing their SQL. Wrangler stores
relative file paths in `d1_migrations.name`, so update the names of already-applied
migrations before running `db:migrate`. Otherwise Wrangler
will attempt to apply those migrations again.

Inspect the migration history first. For entries recorded with the old paths,
apply the corresponding name changes below to the same database. The third mapping
is needed only if the session-table migration was already applied before the RC
upgrade. Leave unapplied migrations out of the history; Wrangler must apply them.

```sql
UPDATE d1_migrations
SET name = CASE name
  WHEN '0000_useful_norrin_radd.sql'
    THEN '20260119094933_useful_norrin_radd/migration.sql'
  WHEN '0001_curved_barracuda.sql'
    THEN '20260131021111_curved_barracuda/migration.sql'
  WHEN '0002_polite_alex_wilder.sql'
    THEN '20261013063905_polite_alex_wilder/migration.sql'
  ELSE name
END
WHERE name IN (
  '0000_useful_norrin_radd.sql',
  '0001_curved_barracuda.sql',
  '0002_polite_alex_wilder.sql'
);
```

A new database requires no history adjustment. This repository's existing snapshot
conversion was performed with `drizzle-kit up`; Relations v2 introduces no database
schema changes. A metadata-only migration aligns the converted snapshot with the
v1 constraint representation. Its SQL leaves existing primary-key nullability and
unique indexes intact, avoiding a users-table rebuild and cascading deletes in D1.
