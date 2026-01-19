const express = require("express");
const controllers = require("../controllers/register-controllers");

const router = express.Router({ mergeParams: true });

router.get("/", controllers.registerPage);
router.post("/", controllers.postRegister);

module.exports = router;
