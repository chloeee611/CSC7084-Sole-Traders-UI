const express = require("express");
const controllers = require("../controllers/login-controllers");

const router = express.Router({ mergeParams: true });

router.get("/", controllers.loginPage);
router.post("/", controllers.postLogin);

module.exports = router;
