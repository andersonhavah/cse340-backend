const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
        description: `This is the ${className} vehicles page.`,
    })
}

/* ***************************
 * Build vehicle detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
    const inventory_id = req.params.inventoryId;
    const data = await invModel.getVehicleByInventoryId(inventory_id);
    
    // Check if data was returned
    if (!data) {
      // If no data, create an error and pass to the error handler
      const err = new Error("Vehicle not found.");
      err.status = 404;
      return next(err);
    }
    
    const grid = await utilities.buildVehicleDetailGrid(data);
    let nav = await utilities.getNav();
    const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
    res.render("./inventory/detail", {
      title: vehicleName,
      nav,
      grid, // Use "grid" to pass the HTML to the view
      description: `This is the ${vehicleName} page.`,
    });
  };

module.exports = invCont;