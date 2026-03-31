const redis = require('redis');

// Create Redis client
const redisClient = redis.createClient({
    socket: {
        host: '127.0.0.1', // localhost
        port: 6379          // default Redis port
    }
});

// Connect to Redis
redisClient.connect()
    .then(() => console.log('Connected to Redis'))
    .catch(err => console.log('Redis connection error:', err));

module.exports = redisClient;