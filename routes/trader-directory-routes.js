const express = require("express");
const controller = require("../controllers/trader-directory-controller");
const router = express.Router({ mergeParams: true });

router.get("/", controller.getTraderDirectoryPage);
router.get("/:id", controller.getTraderDetailsPage);

module.exports = router;
