const Redis = require("ioredis");

const conData = process.env.redisUrl.split(":");
const redis = new Redis(conData[1], conData[0], {lazyConnect: true});

const TOKENS_PREFIX = "tokens.";

module.exports = class Redis {
    
    static authenticateKey(apiKey) {
        return redis.get(TOKENS_PREFIX + "key." + apiKey);
    }

    static authenticateSecret(apiKey) {
        return redis.get(TOKENS_PREFIX + "secret." + apiKey);
    }

    static connect() {
        return redis.connect();
    }

}