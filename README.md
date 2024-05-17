# Scalar Sandbox

An easy way to share OpenAPI files.

## Development

```
pnpm install
pnpm db:migrate
pnpm dev
```

## Update the schema

1. Change the schema: db/schema.ts
2. Create a migration: `pnpm db:generate`
3. Apply migrations: `pnpm db:migrate`
