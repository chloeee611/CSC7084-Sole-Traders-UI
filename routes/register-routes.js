const express = require("express");
const controller = require("../controllers/register-controller");
const router = express.Router({ mergeParams: true });

router.get("/", controller.getRegisterPage);
router.post("/", controller.postRegister);

module.exports = router;
