import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const Specs = sqliteTable('Specs', {
  id: text('id').primaryKey(),
  parentId: text('parent_id'),
  content: text('content').notNull(),
  token: text('token'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})
