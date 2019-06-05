const HttpError = require("simplified-http-errors").HttpError;
const redis = require("../lib/redis");

module.exports = async function (req, res, next) {

    try {
        
        const key = req.body.apiKey || req.query.apiKey;

        if(!key)
            throw new HttpError("permission-denied", "Invalid API key");
        
        const appId = await redis.authenticateKey(key);
        if(appId === null)
            throw new HttpError("permission-denied", "Invalid API key");

        req.appId = appId;
        next();

    } catch (error) {
        next(error);
    }
}