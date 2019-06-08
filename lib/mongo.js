const MongoClient = require("mongodb").MongoClient;
const mongo = new MongoClient(process.env.mongoUrl, {
    useNewUrlParser: true
});

class DB {

    static findArticles(page) {
        //TODO: return from (n * page) to ((n * page+1) - 1)
        return this.getArticles().find({}).toArray();
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