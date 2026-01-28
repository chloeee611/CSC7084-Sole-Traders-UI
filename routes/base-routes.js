const express = require("express");
const router = express.Router({ mergeParams: true });
const controller = require("../controllers/base-controller");

router.get("/", controller.getHomePage);

module.exports = router;
