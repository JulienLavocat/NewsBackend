const jwt = require("jsonwebtoken");

const SERVICE_SECRET = process.env.serviceSecret;
const EXPIRE_IN = process.env.jwtExpiresIn;

function sign(appId, payload) {
    return jwt.sign(payload, getAppSecret(appId), {expiresIn: EXPIRE_IN});
}

function verify(appId, token) {
    try {
        return jwt.verify(token, getAppSecret(appId));
    } catch (error) {
        throw error;
    }
}

function refresh(appId, token) {
    try {
        const data = verify(appId, token);
        
        //Deleting expiration related claims
        delete data.exp;
        delete data.iat;

        return sign(appId, data);

    } catch (error) {
        throw error;
    }
}

function getAppSecret(appId) {
    return appId+SERVICE_SECRET;
}

exports.sign = sign;
exports.verify = verify;
exports.refresh = refresh;