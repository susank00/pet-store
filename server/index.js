const express = require("express");
const mongoose = require("mongoose");
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
        res.json({ success: true, name: user.name, email: user.email });
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
  const { name, email, password } = req.body;
  const existingUser = await EmployeeModel.findOne({ email });
  if (existingUser) {
    return res.json({
      success: false,
      message: "email already exist please use a different email",
    });
  }
  EmployeeModel.create(req.body)
    .then((employees) => res.json(employees))
    .catch((err) => res.json(err));
});
app.listen(3001, () => {
  console.log("server is ruuninng");
});
// end >>>>>>>>>>>>>>>>
