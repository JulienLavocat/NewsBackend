const db = require("../lib/mongo");
const HttpError = require("simplified-http-errors").HttpError;

exports.fetch = async (req, res) => {
   
    try {   
        const result = await db.findArticles();
        res.send(result);
    } catch (error) {
        throw error;
    }

}