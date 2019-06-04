const router = require("express").Router();

router.use("/", require("./service"));
router.use("/users/", require("./users"));

module.exports = router;