const { http } = require('@architect/functions')
const {
  client: redisClient,
  hgetall,
  smembers
} = require("@architect/shared/redis")

exports.handler = http.async(onlineUsers)

async function onlineUsers () {
  await redisClient.connect()
  const onlineIds = await smembers(`online_users`);
  const users = {};
  for (let onlineId of onlineIds) {
    const user = await hgetall(`user:${onlineId}`);
    users[onlineId] = {
      id: onlineId,
      username: user.username,
      online: true,
    };
  }
  redisClient.quit()
  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
    },
    json: users
  }
}
