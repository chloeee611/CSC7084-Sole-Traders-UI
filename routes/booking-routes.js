const express = require("express");
const controller = require("../controllers/booking-controller");
const router = express.Router({ mergeParams: true });

router.post("/new", controller.postNewBooking);

module.exports = router;
