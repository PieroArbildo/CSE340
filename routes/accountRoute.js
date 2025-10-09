// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

const regValidate = require("../utilities/account-validation");

// Route to build
router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Route to handle account registration
// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);


router.get(
  "/",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

module.exports = router;
