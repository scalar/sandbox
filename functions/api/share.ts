export interface Env {
  // If you set another name in wrangler.toml as the value for 'binding',
  // replace "DB" with the variable name you defined.
  DB: D1Database
}

export async function onRequest(context) {
  // If you did not use `DB` as your binding name, change it here
  const { results } = await context.env.DB.prepare(
    'SELECT * FROM Customers WHERE CompanyName = ?',
  )
    .bind('Bs Beverages')
    .all()

  return Response.json(results)
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
