const { http } = require('@architect/functions')

exports.handler = http.async(me)

async function me (req) {
  const { user } = req.session;

  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
    },
    json: user || null
  }
}
