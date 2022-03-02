const { http } = require('@architect/functions')
const bcrypt = require("bcrypt");
const {
  client: redisClient,
  get,
  exists,
  hgetall
} = require("@architect/shared/redis")
const { createUser, makeUsernameKey } = require("@architect/shared/utils");

exports.handler = http.async(login)

async function login (req) {
  await redisClient.connect()
  const { username, password } = req.body;
  const usernameKey = makeUsernameKey(username);
  const userExists = await exists(usernameKey);
  console.log(username, password, usernameKey, userExists)
  if (!userExists) {
    const newUser = await createUser(username, password);
    /** @ts-ignore */
    req.session.user = newUser;
    redisClient.quit()
    return {
      statusCode: 201,
      headers: {
        'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
      },
      json: newUser
    }
  } else {
    const userKey = await get(usernameKey);
    const data = await hgetall(userKey);
    console.log(userKey, password, data.password)
    if (await bcrypt.compare(password, data.password)) {
      const user = { id: userKey.split(":").pop(), username };
      /** @ts-ignore */
      req.session.user = user;
      redisClient.quit()
      return {
        statusCode: 200,
        headers: {
          'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
        },
        json: user
      }
    }
  }
  // user not found
  redisClient.quit()
  return {
    statusCode: 404,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
    },
    json: { message: "Invalid username or password" }
  }
}
