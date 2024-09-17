const bcrypt = require("bcryptjs");
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

    default: "user",
  },
});
EmployeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
const EmployeeModel = mongoose.model("employees", EmployeeSchema);
module.exports = EmployeeModel;
