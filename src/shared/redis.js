// @ts-check
require("dotenv").config();
const redis = require("redis");

const endpoint = process.env.REDIS_ENDPOINT_URL || "127.0.0.1:6379";
const password = process.env.REDIS_PASSWORD || null;

/** @type {import('redis').RedisClient} */
console.log(`redis://${password === null ? '' : `:${password}@`}${endpoint}`)
const client = redis.createClient({
    url: `redis://${password === null ? '' : `:${password}@`}${endpoint}`
  })

/** @type {import('redis').RedisClient} */
const sub =redis.createClient({
  url: `redis://${password === null ? '' : `:${password}@`}${endpoint}`
})

module.exports = {
  client,
  sub,
  incr: async (key = "key") => {
    const res = await client.INCR(key)
    return res
  },
  decr: async (key = "key") => {
    const res = await client.DECR(key)
    return res
  },
  hmset: async (key = "key", values = []) => {
    const res = await client.HMGET(key, values)
    return res
  },
  exists: async (key = "key") => {
    const res = await client.EXISTS(key)
    return res
  },
  hexists: async (key = "key", key2 = "") => {
    const res = await client.HEXISTS(key, key2)
    return res
  },
  set: async (key = "key", value) => {
    const res = await client.SET(key, value)
    return res
  },
  get: async (key = "key") => {
    const res = await client.GET(key)
    return res
  },
  hgetall: async (key = "key") => {
    const res = await client.HGETALL(key)
    return res
  },
  zrangebyscore: async (key = "key", min = 0, max = 1) => {
    const res = await client.ZRANGEBYSCORE(key, min, max)
    return res
  },
  zrange: async (key = "key", min = 0, max = 1) => {
    const res = await client.ZRANGE(key, min, max)
    return res
  },
  zrevrange: async (key = "key", min = 0, max = 1) => {
    const res = await client.ZRANGE(key, min, max)
    return res.reverse()
  },
  zadd: async (key = "key", key2 = "", value) => {
    const res = await client.ZADD(key, key2, value)
    return res
  },
  sadd: async (key = "key", value) => {
    const res = await client.SADD(key, value)
    return res
  },
  hmget: async (key = "key", key2 = "") => {
    const res = await client.HMGET(key, key2)
    return res
  },
  sismember: async (key = "key", key2 = "") => {
    const res = await client.SISMEMBER(key, key2)
    return res
  },
  smembers: async (key = "key") => {
    const res = await client.SMEMBERS(key)
    return res
  },
  srem: async (key = "key", key2 = "") => {
    const res = await client.SREM(key, key2)
    return res
  }
};
