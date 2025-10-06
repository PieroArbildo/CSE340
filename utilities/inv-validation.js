const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const vehicleValidationRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("You must select a classification.")
      .isInt()
      .withMessage("Classification must be a valid number."),
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Make cannot be empty."),
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Model is required."),
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    body("inv_year")
      .isInt({ min: 1900 })
      .withMessage("Year must be 1900 or later."),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be zero or more."),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Please provide a description."),
    body("inv_color").trim().notEmpty().withMessage("Color is required."),
  ];
};

const validateVehicle = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { rows: classifications } = await require("../database").query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    );

    const classificationList = `
      <select id="classification_id" name="classification_id" required>
        <option value="">Select a Classification</option>
        ${classifications
          .map(
            (c) => `
          <option value="${c.classification_id}" ${
              req.body.classification_id == c.classification_id
                ? "selected"
                : ""
            }>${c.classification_name}</option>
        `
          )
          .join("")}
      </select>
    `;

    const nav = await utilities.getNav();

    res.render("inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
      classificationList,
      errors: errors.array(),
      message: null,
      vehicle: req.body,
    });
    return;
  }
  next();
};

module.exports = {
  vehicleValidationRules,
  validateVehicle,
};
