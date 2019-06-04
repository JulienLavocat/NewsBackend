const router = require("express").Router();
const controller = require("../controllers/app");

router.get("/", controller.getService);

module.exports = router;