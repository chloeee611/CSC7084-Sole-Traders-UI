const express = require("express");
const router = express.Router({ mergeParams: true });
const controller = require("../controllers/trader-service-controller");

router.get("/", controller.getAllServicesPage);
router.get("/new-service", controller.getNewServicePage);
router.get("/edit/:serviceId", controller.getEditServicePage);
router.post("/edit/:serviceId", controller.postEditService);
router.post("/delete/:serviceId", controller.postDeleteService);
router.post("/new-service", controller.postNewService);

module.exports = router;
