const utilities = require(".");
const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const validate = {};

/* **********************************
 * Add Classification Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Classification name is required.")
            .isAlpha()
            .withMessage("Classification name must contain only alphabetic characters.")
            .custom(async (classification_name) => {
                const classificationExists = await invModel.checkExistingClassification(classification_name); 
                if (classificationExists) {
                    throw new Error("Classification exists. Please use a different name.");
                }
            }),
    ];
};

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            description: "This is the add classification page.",
            classification_name,
        });
        return;
    }
    next();
};

// You will also need to add a checkExistingClassification function to your inventory-model.js
// async function checkExistingClassification(classification_name){
//   try {
//     const sql = "SELECT * FROM classification WHERE classification_name = $1"
//     const classification = await pool.query(sql, [classification_name])
//     return classification.rowCount
//   } catch (error) {
//     return error.message
//   }
// }


/* **********************************
 * Add Inventory Validation Rules
 * Task 3
 * ********************************* */
validate.inventoryRules = () => {
    return [
        body("inv_make").trim().isLength({ min: 3 }).withMessage("Please provide a valid make."),
        body("inv_model").trim().isLength({ min: 3 }).withMessage("Please provide a valid model."),
        body("inv_year").trim().isLength({ min: 4, max: 4 }).isNumeric().withMessage("Please provide a valid 4-digit year."),
        body("inv_description").trim().isLength({ min: 1 }).withMessage("Please provide a description."),
        body("inv_image").trim().isLength({ min: 1 }).withMessage("Please provide an image path."),
        body("inv_thumbnail").trim().isLength({ min: 1 }).withMessage("Please provide a thumbnail path."),
        body("inv_price").trim().isNumeric().withMessage("Please provide a valid price (digits only)."),
        body("inv_miles").trim().isNumeric().withMessage("Please provide valid mileage (digits only)."),
        body("inv_color").trim().isLength({ min: 1 }).withMessage("Please provide a color."),
        body("classification_id").trim().isNumeric().withMessage("Please select a classification."),
    ];
};

/* ******************************
 * Check inventory data and return errors or continue
 * Task 3
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
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
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        let classificationList = await utilities.buildClassificationList(classification_id);
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Vehicle",
            nav,
            description: "This is the add vehicle page.",
            classificationList,
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
        return;
    }
    next();
};

/* ******************************
 * Check inventory data for errors during UPDATE
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const {
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
    } = req.body;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        const classificationSelect = await utilities.buildClassificationList(classification_id);
        const itemName = `${inv_make} ${inv_model}`;
        // Render the EDIT view on failure
        res.render("inventory/edit-inventory", {
            errors,
            title: "Edit " + itemName,
            nav,
            classificationSelect,
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
        return;
    }
    next();
};

module.exports = validate;