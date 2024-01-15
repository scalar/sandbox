import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './db/schema.ts',
  driver: 'd1',
  verbose: true,
  strict: true,
  out: './migrations',
})
