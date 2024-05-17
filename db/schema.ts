import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const Specs = sqliteTable('Specs', {
  id: text('id').primaryKey(),
  parentId: text('parent_id'),
  content: text('content').notNull(),
  token: text('token'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})
