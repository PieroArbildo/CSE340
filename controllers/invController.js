const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Get vehicle by ID for detail view
 * ************************** */
invCont.getVehicleById = async function (req, res, next) {
  const inventoryId = req.params.inventoryId;
  const vehicles = await invModel.getVehicleById(inventoryId);

  if (!vehicles || vehicles.length === 0) {
    return next({ status: 404, message: 'Vehicle not found.' });
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

module.exports = invCont