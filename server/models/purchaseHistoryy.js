const mongoose = require("mongoose");

const PurchaseHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  // purchaseDate: {
  //   type: Date,
  //   default: Date.now,
  // },
  // paymentMethod: {
  //   type: String,
  //   enum: ["esewa", "khalti"],
  //   required: true,
  // },
  // status: {
  //   type: String,
  //   enum: ["pending", "completed", "refunded"],
  //   default: "pending",
  // },
});

// Create the model
const PurchaseHistory = mongoose.model(
  "PurchaseHistory",
  PurchaseHistorySchema
);

// Export the model
module.exports = PurchaseHistory;
