const { http } = require('@architect/functions')
const {
  client: redisClient,
  exists,
  get,
  hmget,
  smembers,
  auth: runRedisAuth,
} = require("@architect/shared/redis")

exports.handler = http.async(roomsUserid)

async function roomsUserid (req) {
  const userId = req.params.userId;
  await redisClient.connect()
  console.log(redisClient)
  /** We got the room ids */
  const roomIds = await smembers(`user:${userId}:rooms`);
  console.log("roomIds", roomIds)
  const rooms = [];
  for (let x = 0; x < roomIds.length; x++) {
    const roomId = roomIds[x];

    let name = await get(`room:${roomId}:name`);
    /** It's a room without a name, likey the one with private messages */
    if (!name) {
      /**
       * Make sure we don't add private rooms with empty messages
       * It's okay to add custom (named rooms)
       */
      const roomExists = await exists(`room:${roomId}`);
      if (!roomExists) {
        continue;
      }

      const userIds = roomId.split(":");
      if (userIds.length !== 2) {
        return res.sendStatus(400);
      }
      rooms.push({
        id: roomId,
        names: [
          await hmget(`user:${userIds[0]}`, "username"),
          await hmget(`user:${userIds[1]}`, "username"),
        ],
      });
    } else {
      rooms.push({ id: roomId, names: [name] });
    }
  }
  console.log('do we get here')
  redisClient.quit()
  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
    },
    json: rooms
  }
}
