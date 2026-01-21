const express = require("express");
const controller = require("../controllers/login-controller");
const router = express.Router({ mergeParams: true });

router.get("/", controller.getLoginPage);
router.post("/", controller.postLogin);

module.exports = router;
