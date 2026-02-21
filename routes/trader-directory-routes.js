const express = require("express");
const controller = require("../controllers/trader-directory-controller");
const router = express.Router({ mergeParams: true });

router.get("/", controller.getTraderDirectoryPage);
router.get("/:traderId", controller.getTraderDetailsPage);
router.post("/:traderId/rate", controller.postRating);

module.exports = router;
