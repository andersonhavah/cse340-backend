// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory detail view
// The :inventoryId is a URL parameter
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build the management view
// This is the new route for Task 1
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to deliver the add classification view
// Task 2
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));

// Route to process the new classification data
// Task 2
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Route to deliver the add inventory view
// Task 3
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

// Route to process the new inventory data
// Task 3
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);

// Route to get inventory items as JSON for AJAX request
router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON)
);

// Route to build the edit inventory view
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));

// Process the inventory update
router.post(
  "/update",
  invValidate.inventoryRules(), // Re-use the same validation rules
  invValidate.checkUpdateData,    // Use a new check function for updates
  utilities.handleErrors(invController.updateInventory)
);

module.exports = router;
