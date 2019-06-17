const Redis = require("ioredis");

const conData = process.env.redisUrl.split(":");
const redis = new Redis(conData[1], conData[0], {lazyConnect: true});

const CACHE_LATEST_KEY = "news.cache.latest";
const CACHE_FROM_PREFIX = "news.cache.from"; 

module.exports = class Redis {
    
    static cacheLatest(data) {
        return redis.set(CACHE_LATEST_KEY, data);
    }
    static cacheFrom(from, data) {
        return redis.set(CACHE_FROM_PREFIX + from, data);
    }
    
    static getLatest() {
        return redis.get(CACHE_LATEST_KEY);
    }
    static getFrom(from) {
        return redis.get(CACHE_FROM_PREFIX + from);
    }

    static connect() {
        return redis.connect();
    }

}