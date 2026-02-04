const express = require("express");
const controller = require("../controllers/booking-controller");
const router = express.Router({ mergeParams: true });

router.get("/", controller.getAllBookingsPage);
router.post("/new", controller.postNewBooking);
router.post("/:bookingId/status", controller.patchBookingStatus);

module.exports = router;
