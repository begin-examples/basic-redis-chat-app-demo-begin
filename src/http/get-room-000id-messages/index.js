const { http } = require('@architect/functions')
const {
  client: redisClient,
  get,
  auth: runRedisAuth,
} = require("@architect/shared/redis")
const { getMessages } = require("@architect/shared/utils");

exports.handler = http.async(roomMessages)

async function roomMessages (req) {
  const roomId = req.params.id;
  const offset = +req.query.offset || 0;
  const size = +req.query.size || 20;

  await redisClient.connect()
  try {
    const messages = await getMessages(roomId, offset, size);
    redisClient.quit()
    return {
      statusCode: 200,
      headers: {
        'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
      },
      json: messages
    }
  } catch (err) {
    redisClient.quit()
    return {
      statusCode: 400,
      headers: {
        'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
      },
      json: err
    }
  }
}
