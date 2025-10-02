// middleware/catchIntentionalError.js
// Error-handling middleware that specifically handles errors coming from the intentional error route.
// It either renders the shared error view directly or forwards to the global error handler when not applicable.

const utilities = require("../utilities/");

module.exports = async (err, req, res, next) => {
  // Only handle errors originating from the intentional error route(s)
  if (req.originalUrl && req.originalUrl.startsWith("/error/trigger-error") || req.originalUrl === "/error/trigger-error" || req.originalUrl.startsWith("/error")) {
    try {
      const nav = await utilities.getNav();
      console.error(`Intentional Error Handler caught an error at: "${req.originalUrl}": ${err.message}`);
      // ensure status is 500
      const status = err.status || 500;
      const message = "An internal server error was intentionally triggered for testing. Please try again later.";
      return res.status(status).render("errors/error", {
        title: status || "Server Error",
        message,
        nav,
        description: "This is the intentional 500-type error page."
      });
    } catch (renderErr) {
      // If rendering fails, forward to next global error handler
      return next(err);
    }
  }
  // Not the route we want to intercept; pass the error along
  return next(err);
};
