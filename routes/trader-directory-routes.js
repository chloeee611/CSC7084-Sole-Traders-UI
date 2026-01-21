const express = require("express");
const controller = require("../controllers/trader-directory-controller");
const router = express.Router({ mergeParams: true });

router.get("/", controller.getTraderDirectory);
router.get("/:id", controller.getTraderDetails);

module.exports = router;
