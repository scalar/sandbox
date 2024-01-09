export async function onRequest(context) {
  console.log('json', await context.request.json())

  const data = {
    hello: 'world',
  };

  const json = JSON.stringify(data, null, 2);

  return new Response(json, {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
}