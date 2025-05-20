const redis = require('redis');

exports.redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}`,
    legacyMode: true,
});
exports.redisClient.connect().catch(console.error);