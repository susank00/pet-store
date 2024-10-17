const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket"); // Import the Ticket model
const { io } = require("../index"); // Import io from your main server file
const ticketRoutes = (io) => {
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

  // GET: Fetch tickets for a specific user
  router.get("/tickets/user/:userId", async (req, res) => {
    const { userId } = req.params; // Extract the userId from the request parameters

    try {
      const tickets = await Ticket.find({ userId }); // Find all tickets with the given userId

      if (!tickets || tickets.length === 0) {
        return res
          .status(404)
          .json({ message: "No tickets found for this user" }); // Handle case where no tickets are found
      }

      res.status(200).json(tickets); // Respond with the tickets details
    } catch (error) {
      res.status(500).json({ message: "Error retrieving tickets", error });
    }
  });

  // POST: Reply to a ticket
  router.post("/tickets/:ticketId/reply", async (req, res) => {
    const { ticketId } = req.params;
    const { message, senderType, senderId } = req.body;

    try {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) return res.status(404).json({ message: "Ticket not found" });

      // Check if the ticket status is "Completed"
      if (ticket.status === "Completed") {
        return res
          .status(400)
          .json({ message: "Cannot reply to a completed ticket." });
      }

      ticket.replies.push({ message, senderType, senderId });
      await ticket.save();

      // Emit the ticket update to all connected clients
      io.emit("ticketUpdated", { ticketId, ticket });

      res.status(200).json({ message: "Reply added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error adding reply", error });
      console.error(error);
    }
  });

  // PUT: Update ticket status
  router.put("/tickets/:id/status", async (req, res) => {
    const { status } = req.body;
    try {
      const ticket = await Ticket.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      // Emit the updated ticket to all connected clients
      io.emit("ticketUpdated", { ticketId: ticket._id, ticket });

      res.status(200).json(ticket);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error updating ticket status", error: err });
      console.error(err);
    }
  });
  return router; // Make sure to return the router
};

module.exports = ticketRoutes;
