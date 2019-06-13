const MongoClient = require("mongodb").MongoClient;
const mongo = new MongoClient(process.env.mongoUrl, {
    useNewUrlParser: true
});

class DB {

    static getFrom(from) {
        //TODO: return from (n * page) to ((n * page+1) - 1)
        return this.getArticles().find({}).toArray();
    }

    static getLatest() {
        return this.getArticles().find({}).sort({publishedAt: -1}).limit(50).toArray();
    }

    static addArticles(docs) {
        return this.getArticles().insertMany(docs, {ordered: false});
    }

    static getArticles(appId) {
        return mongo.db("news").collection("articles");
    }

    static connect() {
        return mongo.connect();
    }

}

module.exports = DB;