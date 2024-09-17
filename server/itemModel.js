const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    inStock: { type: Boolean, required: true, default: true },
    category: { type: String },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

const Itemm = mongoose.model("Item", itemSchema);
module.exports = Itemm;
