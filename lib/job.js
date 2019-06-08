const CronJob = require("cron").CronJob;
const axios = require("axios").default;
const md5 = require("md5");
const shortId = require("shortId");
const fs = require("fs");
const BulkWriteError = require("mongodb").MongoError;

const db = require("./mongo");

const HEADLINES_URL = "https://newsapi.org/v2/top-headlines?apiKey=2993c4cf18bb4c42b7bd992d9191bd8c&language=fr&pageSize=100";
const EVERYTHINGS = "https://newsapi.org/v2/everything?apiKey=2993c4cf18bb4c42b7bd992d9191bd8c&language=fr&sources=liberation,lemonde,les-echos,google-news-fr&pageSize=100"

module.exports = new CronJob("*/3 * * * *", fetch, null);

async function fetch() {

    let ellapsedTime;
    const start = Date.now();

    try {

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

async function fetchAll() {
    try {
        
        const raw = (await getAll()).data;

        const pageCount = Math.ceil(raw.totalResults / 100);
        
        saveJson("page1")

        for(let i = 1; i < pageCount+1; i++)
            console.log(i);
            
    } catch (error) {
        console.log(error);
        process.exit(-2);
    }
}

function logResult(inserted, ellapsedTime) {
    console.log(`${new Date()} - Added ${inserted} new articles in ${ellapsedTime}ms`);
}

function getEverything() {
    return axios.get(EVERYTHINGS);
}
function getHeadlines(page) {
    return axios.get(HEADLINES_URL);
}

function getAll(page) {
    if (!page)
        return axios.get(EVERYTHINGS);
    else
        return axios.get(EVERYTHINGS + "&page=" +page);
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

function saveJson(name, content) {
    fs.writeFile("results/" + name + ".json", JSON.stringify(content));
}

module.exports.fetch = fetch;