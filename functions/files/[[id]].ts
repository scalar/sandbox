import { drizzle } from 'drizzle-orm/d1'
import { Specs } from '../../db/schema'
import { sql } from 'drizzle-orm'
import YAML from 'yaml'

export interface Env {
  // If you set another name in wrangler.toml as the value for 'binding',
  // replace "DB" with the variable name you defined.
  DB: D1Database
}

function notFound() {
  Response.json({
    error: true,
    code: 404,
    message: 'Not Found'
  })
}

export async function onRequest(context) {
  const db = drizzle(context.env.DB)

  const [id, view] = context.params.id

  const results = (
    await db
      .select()
      .from(Specs)
      .where(sql`${Specs.id} = ${id}`)
  )

  if (results.length !== 1) {
    return notFound()
  }

  const result = results[0]

  if (view === 'openapi.json') {
    return Response.json(JSON.parse(result.content))
  }

  if (view === 'openapi.yaml' || view === 'openapi.yml') {
    return new Response(YAML.stringify(JSON.parse(result.content)))
  }

  return notFound()
}
