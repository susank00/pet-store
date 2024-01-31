const express = require("express");
const router = express.Router();
const checkRole = require("../middlewares/checkRole");

// This route is only accessible to users with the 'admin' role
router.get("/admin-route", checkRole("admin"), (req, res) => {
  // Your route logic here
});

module.exports = router;
