const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const db = require("../database");
const invCont = {};
const validator = require("validator");
//const validator = require("express-validator");

/* ***************************
 *  Build inventory by classification view
 * ************************** */

/*
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};*/

invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );
    const vehicles = data && data.rows ? data.rows : data;
    if (!vehicles || vehicles.length === 0) {
      req.flash("notice", "No vehicles found for this classification.");
      return res.redirect("/inv/");
    }
    const grid = await utilities.buildClassificationGrid(vehicles);
    let nav = await utilities.getNav();
    const className = vehicles[0].classification_name || "Classification";

    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    });
  } catch (error) {
    console.error("Error building classification view:", error);
    return next(error);
  }
};

/* ***************************
 *  Get vehicle by ID for detail view
 * ************************** */
invCont.getVehicleById = async function (req, res, next) {
  const inventoryId = req.params.inventoryId;
  const vehicles = await invModel.getVehicleById(inventoryId);

  if (!vehicles || vehicles.length === 0) {
    return next({ status: 404, message: "Vehicle not found." });
  }

  const vehicle = vehicles[0];

  let nav = await utilities.getNav();
  res.render("./inventory/detail", {
    title: `${vehicle.make} ${vehicle.model}`,
    nav,
    vehicle,
  });
};

/* Build inventory management view */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();

  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
  });
};

invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;

  // Validación con validator.js
  if (!classification_name || validator.isEmpty(classification_name.trim())) {
    req.flash("notice", "Please enter a classification name.");
    return res.redirect("/inv/add-classification");
  }

  // Solo letras y espacios, y máximo 30 caracteres
  const cleanName = classification_name.trim();

  if (!validator.isLength(cleanName, { min: 1, max: 30 })) {
    req.flash(
      "notice",
      "The classification name must be between 1 and 30 characters."
    );
    return res.redirect("/inv/add-classification");
  }

  if (!validator.matches(cleanName, /^[A-Za-z\s]+$/)) {
    req.flash(
      "notice",
      "The classification name must only contain letters and spaces."
    );
    return res.redirect("/inv/add-classification");
  }

  try {
    const result = await invModel.insertClassification(cleanName);

    if (result) {
      req.flash("success", "Classification added successfully!");
      res.redirect("/inv");
    } else {
      req.flash("notice", "Unable to add the classification.");
      res.redirect("/inv/add-classification");
    }
  } catch (error) {
    console.error("Error adding classification:", error);
    req.flash("notice", "An error occurred while processing the request.");
    res.redirect("/inv/add-classification");
  }
};

/* ***************************
 *  Display Add Classification Form
 * ************************** */

invCont.showAddClassificationForm = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
    });
  } catch (error) {
    console.error("Error getting navigation:", error);
    next(error);
  }
};

invCont.showAddVehicleForm = async function (req, res, next) {
  try {
    const { rows: classifications } = await db.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    );

    const classificationList = `
      <select id="classification_id" name="classification_id" required>
        <option value="">Select a Classification</option>
        ${classifications
          .map(
            (c) => `
          <option value="${c.classification_id}">${c.classification_name}</option>
        `
          )
          .join("")}
      </select>
    `;

    let nav = await utilities.getNav();

    res.render("inventory/add-vehicle", {
      title: "Add Vehicle",
      classificationList,
      nav,
      message: null,
      errors: [],
      vehicle: {},
    });
  } catch (err) {
    console.error("Error loading form:", err);
    res.status(500).send("Server error");
  }
};

invCont.addVehicle = async function (req, res) {
  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_price,
      inv_year,
      inv_miles,
      inv_description,
      inv_color,
    } = req.body;

    const result = await invModel.insertVehicle({
      classification_id,
      inv_make,
      inv_model,
      inv_price,
      inv_year,
      inv_miles,
      inv_description,
      inv_color,
      inv_image: "images/vehicles/no-image.jpg",
      inv_thumbnail: "images/vehicles/no-image.jpg",
    });

    if (result) {
      req.flash("message", "Vehicle successfully added!");
      res.redirect("/inv");
    } else {
      throw new Error("Insert failed");
    }
  } catch (error) {
    console.error("Insert error:", error);
    req.flash("message", "There was a problem adding the vehicle.");
    res.redirect("/inv/add-vehicle");
  }
};
module.exports = invCont;
