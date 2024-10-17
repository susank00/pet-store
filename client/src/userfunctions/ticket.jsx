import { useState, useEffect } from "react";
import SideNavbar from "../components/SideNavbar";
import { jwtDecode } from "jwt-decode";
import axios from "axios"; // Import Axios

const Ticket = () => {
  const [userId, setUserId] = useState(null);
  const [ticket, setTicket] = useState({
    tickettitle: "",
    subject: "",
    message: "",
  });

  const [responseMessage, setResponseMessage] = useState(""); // To show success or error message

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // Check the token name

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          // Check if token is expired
          setResponseMessage("Session expired. Please log in again.");
          setUserId(null);
        } else {
          setUserId(decodedToken.userId);
          // console.log("Decoded Token:", decodedToken); // Log the decoded token here
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
        setResponseMessage("Error decoding token.");
      }
    }
  }, []);

  const handleChange = (e) => {
    setTicket({
      ...ticket,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const ticketData = {
        ...ticket,
        userId, // Include userId in the ticket submission
      };

      const response = await axios.post(
        "http://localhost:3001/api/ticket",
        ticketData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the response is successful
      //   console.log("Response:", response); // Log the entire response
      if (response.status === 201) {
        // console.log("Ticket Created:", response.data);
        setResponseMessage("Ticket created successfully!");
        setTicket({ tickettitle: "", subject: "", message: "" }); // Reset form fields
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      setResponseMessage(
        error.response?.data?.message ||
          "Error creating ticket. Please try again."
      );
    }
  };

  return (
    <>
      <div className="flex-grow  relative w-full min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white  ">
        <SideNavbar />
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Create a Ticket
            </h2>

            {responseMessage && (
              <div
                className={`text-center mb-4 ${
                  responseMessage.includes("Error")
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {responseMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Ticket Title</label>
                <input
                  type="text"
                  name="tickettitle"
                  value={ticket.tickettitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter ticket title"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={ticket.subject}
                  onChange={handleChange}
                  className="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subject"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={ticket.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your message"
                  rows="4"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Ticket;
