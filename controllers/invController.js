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
      grid, 
      description: `This is the ${vehicleName} page.`,
    });
};
  
/* ***************************
 * Build management view
 * Task 1
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        description: "This is the vehicle management page.",
        classificationSelect,
        errors: null,
    });
};

/* ****************************************
 * Deliver Add Classification View
 * Task 2
 * *************************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        description: "This is the add classification page.",
        errors: null,
    });
};

/* ****************************************
 * Process New Classification
 * Task 2
 * *************************************** */
invCont.addClassification = async function (req, res) {
    let nav = await utilities.getNav();
    const { classification_name } = req.body;

    const regResult = await invModel.addClassification(classification_name);

    if (regResult) {
        // The classification was added, so we need to rebuild the nav
        // We can do this by clearing the existing nav in res.locals
        // and letting the header re-request it.
        req.app.locals.nav = null;

        req.flash(
            "notice",
            `Congratulations, the ${classification_name} classification has been added.`
        );
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            description: "This is the vehicle management page.",
            errors: null,
        });
    } else {
        req.flash("notice", "Sorry, the new classification failed to be added.");
        res.status(501).render("./inventory/add-classification", {
            title: "Add New Classification",
            nav,
            description: "This is the add classification page.",
            errors: null,
        });
    }
};

/* ****************************************
 * Deliver Add Inventory View
 * Task 3
 * *************************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        description: "This is the add vehicle page.",
        classificationList,
        errors: null,
    });
};

/* ****************************************
 * Process New Inventory
 * Task 3
 * *************************************** */
invCont.addInventory = async function (req, res) {
    let nav = await utilities.getNav();
    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    } = req.body;

    const regResult = await invModel.addInventory(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    );

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, the ${inv_make} ${inv_model} has been added.`
        );
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            description: "This is the vehicle management page.",
            errors: null,
        });
    } else {
        const classificationList = await utilities.buildClassificationList(classification_id);
        req.flash("notice", "Sorry, the new vehicle failed to be added.");
        res.status(501).render("./inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            description: "This is the add vehicle page.",
            classificationList,
            errors: null,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
        });
    }
};

/* ***************************
 * Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData.length > 0) { // Check if the array is not empty
        return res.json(invData)
    } else {
        // To prevent an error on the client-side, you might send an empty array
        // or handle it as an error as the original instructions suggest.
        // Sending an empty array is often safer for the client-side script.
        return res.json([]); 
        // Or, to follow original instruction: next(new Error("No data returned"))
    }
}

/* ***************************
 * Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInventoryId(inv_id); // Re-using existing model function
  const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id);
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    description: "This is the edit vehicle page.",
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  });
};

/* ***************************
 * Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      description: "This is the edit vehicle page.",
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
  }
};

/* ***************************
 * Build delete confirmation view
 * ************************** */
invCont.buildDeleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInventoryId(inv_id);
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    description: "This is the delete vehicle page.",
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
  });
};

module.exports = invCont;