const express = require("express");
const controller = require("../controllers/trader-profile-controller");
const router = express.Router({ mergeParams: true });

router.get("/", controller.getTraderProfilePage);
router.get("/edit/:id", controller.getEditDetailsPage);
router.post("/edit/:id", controller.postDetails);

module.exports = router;
