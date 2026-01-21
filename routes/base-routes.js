const express = require("express");
const router = express.Router({ mergeParams: true });
const loginController = require("../controllers/login-controller");
const baseController = require("../controllers/base-controller");

router.get("/", baseController.getHome);
router.get("/logout", loginController.getLogout);

module.exports = router;
