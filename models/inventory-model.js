const pool = require("../database/");
const { get } = require("../routes/static");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        );
        return data.rows;
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

/* ***************************
 * Get vehicle data by inventory ID
 * ************************** */
async function getVehicleByInventoryId(inventory_id) {
    try {
      const sql = "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.inv_id = $1"
      const data = await pool.query(sql, [inventory_id])
      return data.rows[0] // Return the first (and only) row
    } catch (error) {
      console.error("getvehiclebyinventoryid error " + error)
      return null // Return null if an error occurs or no vehicle is found
    }
}
  
/* ****************************************
 * Add a new classification to the database
 * Task 2
 * *************************************** */
async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
        const result = await pool.query(sql, [classification_name]);
        return result.rows[0];
    } catch (error) {
        console.error("addClassification error: " + error);
        return null;
    }
}

/* ****************************************
 * Check for existing classfication in the database
 * Task 3
 * *************************************** */
async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}


/* ****************************************
 * Add a new inventory item to the database
 * Task 3
 * *************************************** */
async function addInventory(
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
) {
    try {
        const sql = `INSERT INTO public.inventory (
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
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
        return await pool.query(sql, [
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
        ]);
    } catch (error) {
        console.error("addInventory error: " + error);
        return null;
    }
}

/* ***************************
 * Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
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
      inv_id // inv_id is the last parameter for the WHERE clause
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}

/* ***************************
 * Get inventory row by inv_id
 * ************************** */
// async function getInventoryByInventoryId(inv_id) {
//   try {
//     const data = await pool.query(
//       `SELECT * FROM public.inventory WHERE inv_id = $1`,
//       [inv_id]
//     )
//     return data.rows[0]
//   } catch (error) {
//     console.error("get inventory item by id error " + error)
//   }
// }

// Write a function to get inventory by inv_id
async function getInventoryByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByInventoryId error " + error);
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleByInventoryId, addClassification, addInventory, checkExistingClassification, updateInventory, getInventoryByInventoryId };