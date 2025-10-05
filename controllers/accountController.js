const utilities = require("../utilities");

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "login",
    nav,
    errors: null,
    notice: req.flash("notice"),
  });
}

module.exports = { buildLogin };
