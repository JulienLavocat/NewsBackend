const router = require("express").Router();

router.get("/", (req, res) => res.send({service: "news"}));

module.exports = router;