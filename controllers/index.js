const db = require("../lib/mongo");
const redis = require("../lib/redis");
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
        let result = await redis.getLatest();
        if(result === null) {
            result = await getAndCacheLatest();
        }
        
        res.send(result);
    } catch (error) {
        throw error;
    }
}

exports.count = async (req, res) => {
    try {
        res.send({
            articleCount: await db.getCount()
        })

    } catch (error) {
        throw new HttpError("internal", error.message);
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

async function getAndCacheLatest() {
    const result = await db.getLatest();
    const updated = [];
    result.forEach(e => {
        updated.push({
            id: e._id,
            source: e.source,
            author: e.author,
            title: e.title,
            description: e.description,
            url: e.url,
            imageUrl: e.urlToImage,
            publishedAt: e.publishedAt,
            content: e.content,
            hash: e.hash
        });
    });
    await redis.cacheLatest(updated);
    return updated;
}