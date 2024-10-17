const mongoose = require("mongoose");

// Schema for individual replies
const replySchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  senderType: {
    type: String,
    enum: ["user", "admin"], // Identify if reply is from user or admin
    required: true,
  },
  senderId: {
    type: String, // Keep the sender ID as a string or ObjectId based on your setup
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the timestamp when the reply is created
  },
});

// Main Ticket schema with replies field added
const TicketSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  tickettitle: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending",
    required: true,
  },
  replies: [replySchema], // Array to store replies
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the timestamp when the ticket is created
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically set the timestamp when the ticket is updated
  },
});

// Middleware to update the updatedAt field before saving any changes
TicketSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Optional: Method to add a reply with status check
TicketSchema.methods.addReply = function (reply) {
  if (this.status === "Completed") {
    throw new Error("Cannot reply to a completed ticket.");
  }
  this.replies.push(reply);
  this.updatedAt = Date.now();
  return this.save();
};

module.exports = mongoose.model("Ticket", TicketSchema);
