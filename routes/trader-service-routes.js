const express = require("express");
const router = express.Router({ mergeParams: true });
const controller = require("../controllers/trader-service-controller");

router.get("/", controller.getAllServicesPage);
router.get("/new-service", controller.getNewServicePage);
router.get("/edit/:service_id", controller.getEditServicePage);
router.post("/edit/:service_id", controller.postEditService);
router.post("/delete/:service_id", controller.postDeleteService);
router.post("/new-service", controller.postNewService);

module.exports = router;
