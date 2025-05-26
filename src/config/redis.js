const redis = require('redis');

exports.redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}`,
    password: process.env.REDIS_PASSWORD,
    legacyMode: true,
});
exports.redisClient.connect().catch(console.error);