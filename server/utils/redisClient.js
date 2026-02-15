const { createClient } = require('redis');
const config = require('../config/config');

let redisClient = null;
let connectInFlight = null;

function buildRedisClient() {
    if (!config.REDIS_URL) {
        return null;
    }

    const client = createClient({ url: config.REDIS_URL });

    client.on('error', (error) => {
        console.error(`Redis error: ${error.message}`);
    });

    client.on('reconnecting', () => {
        console.warn('Redis reconnecting...');
    });

    return client;
}

async function initializeRedis() {
    if (!config.REDIS_URL) {
        return null;
    }

    if (!redisClient) {
        redisClient = buildRedisClient();
    }

    if (!redisClient) {
        return null;
    }

    if (redisClient.isReady) {
        return redisClient;
    }

    if (!connectInFlight) {
        connectInFlight = redisClient.connect()
            .then(() => {
                console.log('Redis connected');
                return redisClient;
            })
            .catch((error) => {
                console.error(`Redis connection failed: ${error.message}`);
                return null;
            })
            .finally(() => {
                connectInFlight = null;
            });
    }

    return connectInFlight;
}

async function getRedisClient() {
    if (redisClient?.isReady) {
        return redisClient;
    }

    return initializeRedis();
}

module.exports = {
    initializeRedis,
    getRedisClient
};
