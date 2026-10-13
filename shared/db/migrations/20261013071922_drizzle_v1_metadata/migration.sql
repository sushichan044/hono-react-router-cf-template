-- Drizzle Kit v1 represents primary keys and unique constraints differently in snapshots.
-- Existing tables already enforce these constraints. Preserve their SQL and data
-- instead of rebuilding users, which would cascade-delete accounts and sessions in D1.
SELECT 1;
