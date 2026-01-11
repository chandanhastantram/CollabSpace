import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

let isConnected = false;

export async function connectRedis() {
  if (!isConnected) {
    await redisClient.connect();
    isConnected = true;
  }
  return redisClient;
}

export async function getCache(key: string) {
  try {
    const client = await connectRedis();
    return await client.get(key);
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

export async function setCache(key: string, value: string, expirySeconds = 3600) {
  try {
    const client = await connectRedis();
    await client.setEx(key, expirySeconds, value);
  } catch (error) {
    console.error('Redis set error:', error);
  }
}

export async function deleteCache(key: string) {
  try {
    const client = await connectRedis();
    await client.del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
}

export async function clearCachePattern(pattern: string) {
  try {
    const client = await connectRedis();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    console.error('Redis clear pattern error:', error);
  }
}

export default redisClient;
