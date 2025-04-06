// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory management view
router.get("/", invController.buildManagement);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to get a specific vehicle by inventory ID
router.get("/detail/:inventoryId", invController.getVehicleById);

module.exports = router;