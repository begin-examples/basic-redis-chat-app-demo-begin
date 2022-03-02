const { http } = require('@architect/functions')
const fs = require("fs").promises;

exports.handler = http.async(links)

async function links (req) {

  const repoLinks = await fs
  .readFile("./repo.json")
  .then((x) => JSON.parse(x.toString()));

  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
    },
    json: repoLinks
  }
}
