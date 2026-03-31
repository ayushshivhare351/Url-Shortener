const redis = require('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://red-d762qgudqaus73cdo2ig:6379';

// Create Redis client
const redisClient = redis.createClient({
    url: REDIS_URL
});

// Connect to Redis
redisClient.connect()
    .then(() => console.log('Connected to Redis'))
    .catch(err => console.log('Redis connection error:', err));

module.exports = redisClient;
