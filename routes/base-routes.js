const express = require("express");
const router = express.Router({ mergeParams: true });
const loginControllers = require("../controllers/login-controllers");

router.get("/", (req, res) => {
    res.render("home");
});

router.get("/logout", loginControllers.getLogout);

module.exports = router;
