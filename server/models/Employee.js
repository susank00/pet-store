const mongoose = require("mongoose");
const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user,admin"],
    default: "user",
  },
});
const EmployeeModel = mongoose.model("employees", EmployeeSchema);
module.exports = EmployeeModel;
