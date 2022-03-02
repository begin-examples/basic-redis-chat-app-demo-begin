// @ts-check
require("dotenv").config();
const redis = require("redis");

const endpoint = process.env.REDIS_ENDPOINT_URL || "127.0.0.1:6379";
const password = process.env.REDIS_PASSWORD || null;

const [host, port] = endpoint.split(":");

const resolvePromise = (resolve, reject) => {
  return (err, data) => {
    if (err) {
      reject(err);
    }
    resolve(data);
  };
};

const auth = (client) => new Promise((a, b) => {
  if (password === null) {
    a(true);
  } else {
    client.auth(password, resolvePromise(a, b));
  }
});

/** @type {import('redis').RedisClient} */
// const client = redis.createClient(+port, host);
console.log(`redis://${password === null ? '' : `:${password}@`}${endpoint}`)
const client = redis.createClient({
    url: `redis://${password === null ? '' : `:${password}@`}${endpoint}`
  })
/*
const client = redis.createClient({
  url: `redis://${password === null ? '' : `:${password}`}${endpoint}`
})
*/

/** @type {import('redis').RedisClient} */
const sub =redis.createClient({
  url: `redis://${password === null ? '' : `:${password}@`}${endpoint}`
})

module.exports = {
  client,
  sub,
  auth: async () => {
    await auth(client);
    await auth(sub);
  },
  incr: async (key = "key") => {
    // await client.connect()
    const res = await client.INCR(key)
    // client.quit()
    return res
    // new Promise((a, b) => client.incr(key, resolvePromise(a, b)))
  },
  decr: async (key = "key") => {
    // await client.connect()
    const res = await client.DECR(key)
    // client.quit()
    return res
    // new Promise((a, b) => client.decr(key, resolvePromise(a, b)))
  },
  hmset: async (key = "key", values = []) => {
    // await client.connect()
    const res = await client.HMGET(key, values)
    // client.quit()
    return res
    // new Promise((a, b) => client.hmset(key, values, resolvePromise(a, b))),
  },
  exists: async (key = "key") => {
    // await client.connect()
    const res = await client.EXISTS(key)
    // client.quit()
    return res
    // new Promise((a, b) => client.exists(key, resolvePromise(a, b)))
  },
  hexists: async (key = "key", key2 = "") => {
    // await client.connect()
    const res = await client.HEXISTS(key, key2)
    // client.quit()
    return res
    // new Promise((a, b) => client.hexists(key, key2, resolvePromise(a, b))),
  },
  set: async (key = "key", value) => {
    // await client.connect()
    const res = await client.SET(key, value)
    // client.quit()
    return res
    // new Promise((a, b) => client.set(key, value, resolvePromise(a, b))),
  },
  get: async (key = "key") => {
    // await client.connect()
    const res = await client.GET(key)
    // client.quit()
    return res
    // new Promise((a, b) => client.get(key, resolvePromise(a, b))),
  },
  hgetall: async (key = "key") => {
    // await client.connect()
    const res = await client.HGETALL(key)
    // client.quit()
    return res
    // new Promise((a, b) => client.hgetall(key, resolvePromise(a, b))),
  },
  zrangebyscore: async (key = "key", min = 0, max = 1) => {
    // await client.connect()
    const res = await client.ZRANGEBYSCORE(key, min, max)
    // client.quit()
    return res
    // new Promise((a, b) => client.zrangebyscore(key, min, max, resolvePromise(a, b))),
  },
  zadd: async (key = "key", key2 = "", value) => {
    // await client.connect()
    console.log(key, key2, value)
    const res = await client.ZADD(key, key2, value)
    // client.quit()
    return res
    // new Promise((a, b) => client.zadd(key, key2, value, resolvePromise(a, b))),
  },
  sadd: async (key = "key", value) => {
    // await client.connect()
    const res = await client.SADD(key, value)
    // client.quit()
    return res
    // new Promise((a, b) => client.sadd(key, value, resolvePromise(a, b))),
  },
  hmget: async (key = "key", key2 = "") => {
    // await client.connect()
    const res = await client.HMGET(key, key2)
    // client.quit()
    return res
    // new Promise((a, b) => client.hmget(key, key2, resolvePromise(a, b))),
  },
  sismember: async (key = "key", key2 = "") => {
    // await client.connect()
    const res = await client.SISMEMBER(key, key2)
    // client.quit()
    return res
    // new Promise((a, b) => client.sismember(key, key2, resolvePromise(a, b))),
  },
  smembers: async (key = "key") => {
    // await client.connect()
    const res = await client.SMEMBERS(key)
    // client.quit()
    return res
    // new Promise((a, b) => client.smembers(key, resolvePromise(a, b))),
  },
  srem: async (key = "key", key2 = "") => {
    // await client.connect()
    const res = await client.SREM(key, key2)
    // client.quit()
    return res
    // new Promise((a, b) => client.srem(key, key2, resolvePromise(a, b))),
  }
};
