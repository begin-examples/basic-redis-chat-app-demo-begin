const { http } = require('@architect/functions')
const {
  client: redisClient,
  get
} = require("@architect/shared/redis")
const { getMessages } = require("@architect/shared/utils");

exports.handler = http.async(roomPreload)

async function roomPreload () {
  const roomId = "0";
  await redisClient.connect()
  try {
    let name = await get(`room:${roomId}:name`);
    const messages = await getMessages(roomId, 0, 20);
    redisClient.quit()
    return {
      statusCode: 200,
      headers: {
        'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
      },
      json: { id: roomId, name, messages }
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
