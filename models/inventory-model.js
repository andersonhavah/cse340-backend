const pool = require("../database/");

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

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleByInventoryId };