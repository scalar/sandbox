import { drizzle } from 'drizzle-orm/d1'
import { Specs } from '../../db/schema'
import { nanoid } from 'nanoid'

export interface Env {
  // If you set another name in wrangler.toml as the value for 'binding',
  // replace "DB" with the variable name you defined.
  DB: D1Database
}

export async function onRequest(context) {
  const db = drizzle(context.env.DB)

  // Create a new entry
  if (context.request.method === 'POST') {
    // TODO: Validation
    const data = await context.request.json()

    const result = await db
      .insert(Specs)
      .values({
        id: nanoid(5),
        parentId: data.parentId || null,
        content: data.content,
      })
      .returning()

    return Response.json(result[0])
  }

  return new Response('Method not allowed, try POST.', {
    status: 405,
  })
}
