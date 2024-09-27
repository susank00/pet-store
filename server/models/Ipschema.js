// models/IpSchema.js
const mongoose = require("mongoose");

// const ipSchema = new mongoose.Schema({
//   ipAddress: String,
//   timestamp: { type: Date, default: Date.now },
//   userAgent: { type: String, required: true },
// });

const ipSchema = new mongoose.Schema({
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  location: {
    country: { type: String },
    region: { type: String },
    city: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  timestamp: { type: Date, default: Date.now },
});
const IpAddress = mongoose.model("IpAddress", ipSchema);
module.exports = IpAddress;
