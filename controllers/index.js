const db = require("../lib/mongo");
const HttpError = require("simplified-http-errors").HttpError;

exports.fetch = async (req, res) => {

    try {
        const params = validateFetch(req.query);

        const result = await db.getFrom(params.from);
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

    if(!query.from)
        throw new HttpError("failed-precondition", "missing from parameters");

    const from = Number.parseInt(query.from);

    if (isNaN(from))
        throw new HttpError("invalid-argument", "from should be a valid integer");
    if (from < 0)
        throw new HttpError("invalid-argument", "from should be a equals or greater than 0");
    return { from };
}