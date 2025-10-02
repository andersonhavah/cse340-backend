const errorController = {};

/* ****************************************
 * Method to trigger intentional error
 **************************************** */
errorController.triggerError = async function (req, res, next) {
  try {
    // Intentionally throw an error to trigger 500 response
    throw new Error("Intentional server error triggered for testing purposes");
  } catch (error) {
    next(error); // Pass to error handling middleware
  }
};

module.exports = errorController;