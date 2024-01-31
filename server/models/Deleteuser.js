const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require("./models/Employee");

const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect("mongodb://127.0.0.1:27017/employee");

// ... Other routes and configurations ...

// Delete user route
app.delete("/deleteUser/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID
    const userToDelete = await EmployeeModel.findById(userId);

    if (!userToDelete) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the requester is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Permission denied. Only admins can delete users.",
      });
    }

    // Perform the delete operation
    await userToDelete.remove();

    res.json({
      success: true,
      message: "User deleted successfully",
      user: {
        name: userToDelete.name,
        email: userToDelete.email,
        role: userToDelete.role,
      },
    });
  } catch (error) {
    console.error("Error during user deletion:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
