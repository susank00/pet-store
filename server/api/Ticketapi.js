const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket"); // Import the Ticket model

// POST: Create a new ticket
router.post("/ticket", async (req, res) => {
  const { userId, tickettitle, subject, message } = req.body;

  if (!userId || !tickettitle || !subject || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newTicket = new Ticket({ userId, tickettitle, subject, message });
    const savedTicket = await newTicket.save(); // Save the ticket to the database
    res.status(201).json(savedTicket);
  } catch (error) {
    res.status(500).json({ message: "Error creating ticket", error });
  }
});

// GET: Fetch all tickets
router.get("/tickets", async (req, res) => {
  try {
    const tickets = await Ticket.find(); // Retrieve all tickets from the database
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tickets", error });
  }
});

module.exports = router;
