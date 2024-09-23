const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User", // Assuming you have a User model
  },
  fileId: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  contentType: {
    type: String,
    required: true,
  },
});

const Upload = mongoose.model("Upload", uploadSchema);
module.exports = Upload;
