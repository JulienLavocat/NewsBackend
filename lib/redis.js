const Redis = require("ioredis");

const conData = process.env.redisUrl.split(":");
const redis = new Redis(conData[1], conData[0], {lazyConnect: true, password: process.env.redisAuth});

const CACHE_LATEST_KEY = "news.cache.latest";
const CACHE_FROM_PREFIX = "news.cache.from"; 

module.exports = class Redis {
    
    static cacheLatest(data) {
        return redis.set(CACHE_LATEST_KEY, JSON.stringify(data));
    }
    static cacheFrom(from, data) {
        return redis.set(CACHE_FROM_PREFIX + from, JSON.stringify(data));
    }
    
    static getLatest() {
        return redis.get(CACHE_LATEST_KEY);
    }
    static getFrom(from) {
        return redis.get(CACHE_FROM_PREFIX + from);
    }

    static async invalidateCache() {

        const multi = redis.multi();

        multi.del(CACHE_LATEST_KEY);
        const fromQueries = (await redis.keys(CACHE_FROM_PREFIX + "*"))
            .forEach(key => {
                multi.del(key);
            });

        return multi.exec();
    }

    static connect() {
        return redis.connect();
    }

}