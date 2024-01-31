// Example usage of the middleware in routes/secureRoute.js
const express = require("express");
const router = express.Router();
const checkRole = require("./secureRoute");

router.get("/admin", checkRole(["admin"]), (req, res) => {
  // This route is accessible only to users with the 'admin' role
  res.json({ message: "Admin route" });
});

module.exports = router;

// Middleware for authorization in routes/secureRoute.js
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Assuming you set the user in the request during authentication

    if (allowedRoles.includes(userRole)) {
      next(); // User has the required role, proceed to the next middleware
    } else {
      res.status(403).json({ message: "Forbidden" }); // User does not have the required role
    }
  };
};

module.exports = checkRole;
