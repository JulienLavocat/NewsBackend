const router = require("express").Router();
const controller = require("../controllers");

router.get("/", (req, res) => res.send({service: "news"}));
router.get("/fetch", controller.fetch);

module.exports = router;