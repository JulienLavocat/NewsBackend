const MongoClient = require("mongodb").MongoClient;
const mongo = new MongoClient(process.env.mongoUrl, {
    useNewUrlParser: true
});

const ARTICLES_PER_PAGE = 10;

class DB {

    static getFrom(from) {
        return this.getBetween(from, ARTICLES_PER_PAGE);
    }
    static getBetween(from, to) {
        return this.getArticles().skip(from).limit(to).toArray();
    }

    static getLatest() {
        return this.getArticles().limit(50).toArray();
    }

    static addArticles(docs) {
        return this.getCollection().insertMany(docs, {ordered: false});
    }

    static getCount() {
        return this.getCollection().count();
    }

    static getArticles() {
        return this.getCollection().find({}).sort({publishedAt: -1});
    }

    static getCollection() {
        return mongo.db("news").collection("articles");
    }

    static connect() {
        return mongo.connect();
    }

}

module.exports = DB;