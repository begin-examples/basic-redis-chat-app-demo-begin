const { http } = require('@architect/functions')
const {
  client: redisClient,
  hgetall,
  sismember,
  auth: runRedisAuth,
} = require("@architect/shared/redis")

exports.handler = http.async(getUsers)

async function getUsers (req) {
    await redisClient.connect()
    /** @ts-ignore */
    /** @type {string[]} */ const ids = Array.from(req.query.ids);
    if (typeof ids === "object" && Array.isArray(ids)) {
      /** Need to fetch */
      const users = {};
      for (let x = 0; x < ids.length; x++) {
        /** @type {string} */
        const id = ids[x];
        const user = await hgetall(`user:${id}`);
        users[id] = {
          id: id,
          username: user.username,
          online: !!(await sismember("online_users", id)),
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

    redisClient.quit()
    return {
      statusCode: 404
    }
 }
