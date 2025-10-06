const utilities = require(".");
const accountModel = require("../models/account-model");
const { body, validationResult } = require("express-validator");
const validate = {};

/* **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* *********************************
 *  Login Data Validation Rules
 * ******************************** */
validate.loginRules = () => {
  return [
    // valid email is required
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    // password is required
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be minimum of 12 characters and include 1 capital letter, 1 number, and 1 special character."
      ),
  ];
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};

validate.vehicleRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("The make must be at least 3 characters long."),
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("The model must be at least 3 characters long."),
    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .withMessage("The year must be exactly 4 digits.")
      .isNumeric()
      .withMessage("The year must be a numeric value."),
    body("inv_description")
      .notEmpty()
      .withMessage("A description is required."),
    body("inv_price")
      .trim()
      .isNumeric()
      .withMessage("The price must be a numeric value."),
    body("inv_miles")
      .trim()
      .isNumeric()
      .withMessage("Mileage must be a numeric value."),
    body("classification_id")
      .notEmpty()
      .withMessage("Classification is required."),
    body("inv_color").notEmpty().withMessage("Color is required."),
  ];
};

validate.checkVehicleData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const db = require("../database");
    let nav = await utilities.getNav();
    const { rows: classifications } = await db.query(
      "SELECT * FROM classification ORDER BY classification_name"
    );

    const classificationList = `
      <select id="classification_id" name="classification_id" required>
        <option value="">Select a Classification</option>
        ${classifications
          .map(
            (c) => `
          <option value="${c.classification_id}" ${
              c.classification_id == req.body.classification_id
                ? "selected"
                : ""
            }>
            ${c.classification_name}
          </option>`
          )
          .join("")}
      </select>
    `;

    res.render("inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
      classificationList,
      errors: errors.array(),
      vehicle: req.body,
      message: null,
    });
    return;
  }
  next();
};

module.exports = validate;
