var redis;

module.exports = class Redis {
    
    static connect(cb) {
        let connData = process.env.redisUrl.split(":");
        redis = require("redis").createClient(connData[1], connData[0]);
        redis.on("error", function (err) {
            console.log("Error " + err);
        }).on("end", () => {
            console.log("Connection to redis closed");
            process.exit(-2);
        }).on("connect", () => cb());
    }

}