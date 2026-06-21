const redis = require('redis');

const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', err => {
    console.log('Redis Error:', err.message);
});

redisClient.on('ready', () => {
    console.log('Redis Connected ✅');
});

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.log('Redis unavailable locally');
    }
})();

module.exports = redisClient;