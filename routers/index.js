const router = require("express").Router();
const controller = require("../controllers");

router.get("/", (req, res) => res.send({service: "news"}));

router.get("/from", controller.from);
router.get("/latest", controller.latest);
router.get("/sources", controller.sources);
router.get("/count", controller.count);

module.exports = router;