const db = require("../lib/mongo");
const redis = require("../lib/redis");
const HttpError = require("simplified-http-errors").HttpError;

exports.from = async (req, res) => {

    try {
        const params = validateFetch(req.query);

        let result = await redis.getFrom(params.from);
        if(result === null) {
            result = await getAndCacheFrom(params.from);
        }

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
    try {
        const result = await db.getLatest();
        const views = generateViews(result);
        await redis.cacheLatest(views);
        return views;
    } catch (error) {
        throw error;
    }
}
async function getAndCacheFrom(from) {
    try {
        const result = await db.getFrom(from);
        const views = generateViews(result);
        await redis.cacheFrom(from, views);
        return views;
    } catch (error) {
        throw error;
    }
}

function generateViews(results) {
    const updated = [];
    results.forEach(e => {
        updated.push({
            id: e._id,
            source: e.source,
            author: e.author,
            title: e.title,
            description: e.description,
            url: e.url,
            thumbnail: e.urlToImage,
            publishedAt: e.publishedAt,
            content: e.content,
            hash: e.hash
        });
    });
    return updated;
}