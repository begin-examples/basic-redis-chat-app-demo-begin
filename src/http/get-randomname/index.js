const { http } = require('@architect/functions')
const randomName = require("node-random-name");

exports.handler = http.async(randomname)

async function randomname (req) {
  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8'
    },
    json: randomName({ first: true })
  }
}
