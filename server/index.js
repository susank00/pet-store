const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const EmployeeModel = require("./models/Employee");

const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect("mongodb://127.0.0.1:27017/employee");

// this for fetching employee namewe
app.post("/getUserInfo", (req, res) => {
  const { email } = req.body;
  EmployeeModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.json({
          success: true,
          name: user.name,
          email: user.email,
          role: user.role,
        });
      } else {
        res.json({ success: false, message: "User not found" });
      }
    })
    .catch((error) => {
      console.error("Error fetching user information:", error.message);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    });
});
// end
app.get("/employeeNames", async (req, res) => {
  try {
    // Fetch all employee names from the database
    const employeeNames = await EmployeeModel.find({}, "name");
    const nameList = employeeNames.map((employee) => employee.name);
    res.json(nameList);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// for login panel validation login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res.json({
      success: false,
      message: "Please enter email and password",
    });
  } else if (!email) {
    return res.json({
      success: false,
      message: "Please enter email address",
    });
  } else if (!password) {
    return res.json({
      success: false,
      message: "Please enter password",
    });
  }
  EmployeeModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          res.json({
            success: true,
            message: "Login successful",
            user: { name: user.name, email: user.email },
          });
        } else {
          res.json({ success: false, message: "Incorrect password" });
        }
      } else {
        res.json({ success: false, message: "User not found" });
      }
    })
    .catch((error) => {
      console.error("Error during login:", error.message);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    });
});

// end-->>>>>>>>>>>>>

// for registration portal login >>>>>>>>>>
app.post("/register", async (req, res) => {
  const { name, email, password, role = "user" } = req.body;
  const existingUser = await EmployeeModel.findOne({ email });

  if (!email && !password) {
    return res.json({
      success: false,
      message: "Please enter email and password",
    });
  } else if (!name) {
    return res.json({
      success: false,
      message: "Please enter Name",
    });
  } else if (!email) {
    return res.json({
      success: false,
      message: "Please enter email address",
    });
  } else if (!password) {
    return res.json({
      success: false,
      message: "Please enter password",
    });
  }
  if (existingUser) {
    return res.json({
      success: false,
      message: "email already exist please use a different email",
    });
  }
  try {
    // Create a new user with assigned role
    const newUser = await EmployeeModel.create({
      name,
      email,
      password,
      role,
    });

    // Respond with the created user data
    res.json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
app.get("/names", async (req, res) => {
  try {
    // Fetch all names from the database
    const name = await EmployeeModel.find({}, "name");
    const nameList = name.map((user) => user.name);
    res.json(nameList);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// delete user
app.delete("/api/employees/delete/:name", async (req, res) => {
  const nameToDelete = req.params.name;

  try {
    // Find and delete the user by name
    const deletedUser = await EmployeeModel.findOneAndDelete({
      name: nameToDelete,
    });

    if (deletedUser !== null) {
      res.json({
        success: true,
        message: "User deleted successfully",
        deletedUser,
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// end of deleteuser func
// end>>>>>>>>>>
app.listen(3001, () => {
  console.log("server is ruuninng");
});
// end >>>>>>>>>>>>>>>>
