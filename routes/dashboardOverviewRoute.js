const express = require("express");
const router = express.Router();

const auth = require("../middleware/authmiddleware");
const allowRoles = require("../middleware/rolemiddleware");

const { getDashboardOverview } = require("../controllers/dashboardOverviewController");

router.get(
  "/overview",
  auth,
  allowRoles("admin", "accountant"),
  getDashboardOverview
);

module.exports = router