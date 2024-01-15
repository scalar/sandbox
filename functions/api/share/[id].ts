import { drizzle } from 'drizzle-orm/d1'
import { Specs } from '../../../db/schema'
import { sql } from 'drizzle-orm'

export interface Env {
  // If you set another name in wrangler.toml as the value for 'binding',
  // replace "DB" with the variable name you defined.
  DB: D1Database
}

export async function onRequest(context) {
  const db = drizzle(context.env.DB)

  const result = (
    await db
      .select()
      .from(Specs)
      .where(sql`${Specs.id} = ${context.params.id}`)
  )[0]

  return Response.json(result)

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
