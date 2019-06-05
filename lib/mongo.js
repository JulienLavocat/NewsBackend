const MongoClient = require("mongodb").MongoClient;
const mongo = new MongoClient(process.env.mongoUrl, {
    useNewUrlParser: true
});

class DB {

    static getDb(appId) {
        return mongo.db("gamedb");
    }

    static connect() {
        return mongo.connect();
    }

}

module.exports = DB;