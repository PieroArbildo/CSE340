// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to get a specific vehicle by inventory ID
router.get("/detail/:inventoryId", utilities.handleErrors(invController.getVehicleById))

module.exports = router;