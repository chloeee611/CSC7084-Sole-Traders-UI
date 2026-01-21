const express = require("express");
const controller = require("../controllers/trader-profile-controller");
const router = express.Router({ mergeParams: true });

router.get("/", controller.getTraderProfile);
router.get("/edit/:id", controller.getEditDetails);
router.post("/edit/:id", controller.postDetails);

module.exports = router;
