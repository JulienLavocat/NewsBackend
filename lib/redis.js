const Redis = require("ioredis");

const conData = process.env.redisUrl.split(":");
const redis = new Redis(conData[1], conData[0], {lazyConnect: true});

module.exports = class Redis {
    
    static connect() {
        return redis.connect();
    }

}