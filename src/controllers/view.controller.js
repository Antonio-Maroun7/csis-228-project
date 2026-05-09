/**
 * @deprecated
 * This file is kept only as a compatibility shim.
 * All logic has been moved to src/controllers/views/ and src/utils/views/.
 * view.routes.js now imports directly from those split modules.
 */

const authView = require("./views/authView.controller");
const clientView = require("./views/clientView.controller");
const profileView = require("./views/profileView.controller");
const adminDashboardView = require("./views/adminDashboardView.controller");
const adminUserView = require("./views/adminUserView.controller");
const adminCategoryView = require("./views/adminCategoryView.controller");
const adminServiceView = require("./views/adminServiceView.controller");
const adminStaffServiceView = require("./views/adminStaffServiceView.controller");
const adminAppointmentView = require("./views/adminAppointmentView.controller");

module.exports = {
  ...authView,
  ...clientView,
  ...profileView,
  ...adminDashboardView,
  ...adminUserView,
  ...adminCategoryView,
  ...adminServiceView,
  ...adminStaffServiceView,
  ...adminAppointmentView,
};
