import { drizzle } from 'drizzle-orm/d1'
import { Specs } from '../../db/schema'

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
        content: data.content,
      })
      .returning()

    return Response.json(result[0])
  }

  return new Response('Method not allowed, try POST.', {
    status: 405,
  })

  // const result = await db.select().from(Specs).all()

  // console.log('json', await context.request.json())

  // const data = {
  //   hello: 'world',
  // }

  // const json = JSON.stringify(data, null, 2)

  // return new Response(json, {
  //   headers: {
  //     'content-type': 'application/json;charset=UTF-8',
  //   },
  // })
}
