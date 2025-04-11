/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const session = require("express-session")
const pool = require('./database/')
const utilities = require('./utilities/');
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")

const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require('./routes/accountRoute');
const bodyParser = require("body-parser")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

//Index route
//app.get("/", baseController.buildHome)
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)

//Account routes
app.use('/account', accountRoute);

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Server Error; Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

// Middleware para manejar error 500 intencional

// Ruta para forzar un error 500
app.get('/error500', (req, res, next) => {
  const err = new Error('This is a forced 500 error');
  err.status = 500;
  next(err); // Pasa el error al middleware de manejo de errores
});

// Ruta para manejar "File Not Found" (404)
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'});
});

/* ***********************
 * Express Error Handler
 * Colocarlo después de todos los demás middlewares
 *************************/

// Middleware to handle intentional 500 error
app.get('/error500', (req, res, next) => {
  console.log('Triggering error 500');
  const err = new Error('This is a forced 500 error');
  err.status = 500;
  next(err);
});

// Error-handling middleware
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  let message;
  if (err.status === 404) {
    message = err.message; // If the error is 404, display the 404 message
  } else if (err.status === 500) {
    message = 'This is a forced 500 error';
  } else {
    message = 'Server Error; Oh no! There was a crash. Maybe try a different route?';
  }

  // Set the error status and render the error view
  res.status(err.status || 500).render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
});

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
