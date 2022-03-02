const { http } = require('@architect/functions')
const { client: redisClient } = require("@architect/shared/redis")
const { createPrivateRoom } = require("@architect/shared/utils");

exports.handler = http.async(postRoom)

async function postRoom (req) {
  await redisClient.connect()

  const { user1, user2 } = {
    user1: parseInt(req.body.user1),
    user2: parseInt(req.body.user2),
  };

  const [result, hasError] = await createPrivateRoom(user1, user2);
  if (hasError) {
    redisClient.quit()
    return {
      statusCode: 400,
      headers: {
        'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      }
    }
  }
  redisClient.quit()
  return {
    statusCode: 201,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
    },
    json: result
  }
}
