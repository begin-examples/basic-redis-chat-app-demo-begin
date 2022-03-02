const { http } = require('@architect/functions')

exports.handler = http.async(logout)

async function logout (req) {
  delete req.session.user
  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
    }
  }
}
