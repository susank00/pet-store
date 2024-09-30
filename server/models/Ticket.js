const mongoose = require("mongoose");
const Ticketschema = new mongoose.Schema({
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
    requried: true,
  },
  message: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Ticket", Ticketschema);
