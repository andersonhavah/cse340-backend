// routes/intentionalErrorRoute.js
const express = require("express");
const router = new express.Router();
const intentionalErrorController = require("../controllers/intentionalErrorController");
const utilities = require("../utilities/");

// Route that passes through normal routing to the controller
router.get("/trigger-error", intentionalErrorController.triggerError);

module.exports = router;
