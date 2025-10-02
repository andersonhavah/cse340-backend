/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/");
const intentionalErrorRoute = require("./routes/intentionalErrorRoute");
const catchIntentionalError = require("./middleware/catchIntentionalError");


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");


/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
// app.get("/", function (req, res) {
//   res.render("index", { title: "Home" });
// });
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/inv", inventoryRoute)

// Intentional error route (for testing 500 handling)
app.use("/error", intentionalErrorRoute);

// Middleware to catch intentional errors from /error routes and render the error view
app.use(catchIntentionalError);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  if (err.status == 404) {
    message = err.message;
  } else {
    message = 'Seems like you are out of space. The page is gone. Please come back to us. 🤗';
  }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav,
    description: "This is the error page."
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
