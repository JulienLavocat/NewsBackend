const db = require("../lib/mongo");
const HttpError = require("simplified-http-errors").HttpError;

exports.fetch = async (req, res) => {

    //Args validation
    const params = validateFetch(req.query);

    try {
        const result = await db.findArticles();
        res.send(result);
    } catch (error) {
        throw error;
    }

}

exports.latest = async (req, res) => {
    try {
        const result = await db.getLatest();
        res.send(result);
    } catch (error) {
        throw error;
    }
}

function validateFetch(query) {
    const from = parseInt(query.from);
    if (from === NaN)
        throw new HttpError("invalid-argument", "from should be a valid integer");
    if (from < 0)
        throw new HttpError("invalid-argument", "from should be a equals or greater than 0");
    return { from };
}