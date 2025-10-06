// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
//const validate = require('../utilities/account-validation');

const {
  vehicleValidationRules,
  validateVehicle,
} = require("../utilities/inv-validation");

// Route to build inventory management view
router.get("/", invController.buildManagement);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to get a specific vehicle by inventory ID
router.get("/detail/:inventoryId", invController.getVehicleById);

// Route to build add classification form view
router.get("/add-classification", invController.showAddClassificationForm);

// Route to handle form submission and add new classification
router.post("/add-classification", invController.addClassification);

// Route to build add vehicle form view
router.get("/add-vehicle", invController.showAddVehicleForm);

// Route to handle form submission and add new vehicle

//router.post("/add-vehicle", invController.addVehicle);
router.post(
  "/add-vehicle",
  vehicleValidationRules(),
  validateVehicle,
  invController.addVehicle
);

module.exports = router;
