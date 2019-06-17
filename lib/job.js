const CronJob = require("cron").CronJob;
const axios = require("axios").default;
const md5 = require("md5");
const shortId = require("shortid");

const db = require("./mongo");
const redis = require("./redis");

const EVERYTHINGS = "https://newsapi.org/v2/everything?apiKey=" + process.env.apiKey + "&language=fr&sources=liberation,le-monde,les-echos,google-news-fr&pageSize=100"

module.exports = new CronJob("*/3 * * * *", fetch, null);

async function fetch() {

    let ellapsedTime;
    const start = Date.now();

    try {

        await redis.invalidateCache();

        const raw = (await getEverything()).data;
        const articles = toDb(raw);
        const result = await db.addArticles(articles);

        ellapsedTime = Date.now() - start;
        logResult(result.insertedCount, ellapsedTime);
    } catch (error) {
        ellapsedTime = Date.now() - start;

        if(error.name === "BulkWriteError") {
            logResult(error.result.nInserted, ellapsedTime);
        } else {
            console.error(error);
        }
    }
}

function logResult(inserted, ellapsedTime) {
    console.log(`${new Date()} - Added ${inserted} new articles in ${ellapsedTime}ms`);
}

function getEverything() {
    return axios.get(EVERYTHINGS);
}

function toDb(raw) {
    const docs = [];
    raw.articles.forEach(article => {

        if (article.source.id === "lequipe")
            return;

        const hash = md5(article.title + article.description + article.url);

        article.hash = hash;
        article.source = article.source.id;
        article._id = shortId.generate();

        docs.push(article);

    });

    return docs;
}

module.exports.fetch = fetch;