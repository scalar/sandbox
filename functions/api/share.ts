import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { customAlphabet, nanoid } from 'nanoid'

import { Specs } from '../../db/schema'

export interface Env {
  // If you set another name in wrangler.toml as the value for 'binding',
  // replace "DB" with the variable name you defined.
  DB: D1Database
}

// Unique ID
export function generateUniqueId() {
  return nanoid(5)
}

// Token to update the sandbox
export function generateSecretToken() {
  return customAlphabet('1234567890abcdef', 32)()
}

export async function onRequest(context) {
  const db = drizzle(context.env.DB)

  // Create a new entry
  if (context.request.method === 'POST') {
    // TODO: Validation
    const data = await context.request.json()

    // Query parameters
    const query = new URLSearchParams(new URL(context.request.url).search)

    // Update the sandbox
    if (query.has('token')) {
      const result = await db
        .update(Specs)
        .set({
          content: data.content,
        })
        .where(sql`${Specs.token} = ${query.get('token')}`)
        .returning()

      // Not Found
      if (result.length !== 1) {
        return Response.json({
          error: true,
          code: 404,
          message: 'Sandbox Not Found',
        })
      }

      return Response.json(result[0], {
        status: 202,
      })
    }

    // Create a new sandbox
    const result = await db
      .insert(Specs)
      .values({
        id: generateUniqueId(),
        parentId: data.parentId || null,
        content: data.content,
        token: generateSecretToken(),
      })
      .returning()

    return Response.json(result[0], {
      status: 201,
    })
  }

  return new Response('Method not allowed, try POST.', {
    status: 405,
  })
}
