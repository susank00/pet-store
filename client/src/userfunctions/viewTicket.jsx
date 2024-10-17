import { useEffect, useState } from "react";
import axios from "axios";
import SideNavbar from "../components/SideNavbar";
import { io } from "socket.io-client"; // Import socket.io-client
const socket = io(import.meta.env.VITE_API_URL_PROD_API_URL); // Connect to the backend

const ViewTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // Initialize Socket.IO

  // Fetch tickets from the backend
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL_PROD_API_URL}/api/tickets`
        );
        setTickets(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();

    // Listen for real-time ticket updates
    // socket.on("ticketUpdated", (updatedTicket) => {
    //   setTickets((prevTickets) =>
    //     prevTickets.map((ticket) =>
    //       ticket._id === updatedTicket._id ? updatedTicket : ticket
    //     )
    //   );
    // });

    // // Clean up the socket connection on component unmount
    // return () => {
    //   socket.off("ticketUpdated"); // Clean up the listener on component unmount
    //   // socket.disconnect();
    // };
  }, []);
  useEffect(() => {
    socket.on("ticketUpdated", (data) => {
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === data.ticketId ? data.ticket : ticket
        )
      );
    });

    return () => {
      socket.off("ticketUpdated"); // Clean up the listener on component unmount
    };
  }, []);

  // Function to handle reply form submission
  const handleReplySubmit = async (ticketId) => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_API_URL_PROD_API_URL
        }/api/tickets/${ticketId}/reply`,
        {
          message: reply,
          senderType: "admin",
          senderId: "adminId",
        }
      );

      setReply("");
      setSelectedTicketId(null);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL_PROD_API_URL}/api/tickets`
      );
      setTickets(response.data);

      // Emit event to notify other users about the update
      socket.emit(
        "ticketUpdated",
        response.data.find((t) => t._id === ticketId)
      );
    } catch (err) {
      console.error("Error replying to ticket:", err);
    }
  };

  // Function to handle status change
  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await axios.put(
        `${
          import.meta.env.VITE_API_URL_PROD_API_URL
        }/api/tickets/${ticketId}/status`,
        { status: newStatus }
      );

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL_PROD_API_URL}/api/tickets`
      );
      setTickets(response.data);

      // Emit event to notify other users about the update
      socket.emit(
        "ticketUpdated",
        response.data.find((t) => t._id === ticketId)
      );
    } catch (err) {
      console.error("Error changing ticket status:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching tickets: {error.message}</div>;
  }

  return (
    <>
      <div className="flex-grow  relative w-full min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white  ">
        <SideNavbar />
        <div className="ml-64 relative overflow-x-auto">
          <h1 className=" text-grey-900 justify-center flex text-2xl">
            Tickets
          </h1>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-900">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">User ID</th>
                <th className="border border-gray-300 p-2">Title</th>
                <th className="border border-gray-300 p-2">Subject</th>
                <th className="border border-gray-300 p-2">Message</th>
                <th className="border border-gray-300 p-2">Replies</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td className="border border-gray-300 p-2">
                    {ticket.userId}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {ticket.tickettitle}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {ticket.subject}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {ticket.message}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {ticket.replies.map((reply, index) => (
                      <div key={index}>
                        <p>
                          <strong>{reply.senderType}:</strong> {reply.message}
                        </p>
                      </div>
                    ))}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <select
                      value={ticket.status || "Pending"}
                      onChange={(e) =>
                        handleStatusChange(ticket._id, e.target.value)
                      }
                      className="border p-2"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="border border-gray-300 p-2">
                    {ticket.status !== "Completed" &&
                    selectedTicketId === ticket._id ? (
                      <div>
                        <textarea
                          className="border p-2"
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          placeholder="Type your reply here"
                        />
                        <button
                          className="bg-blue-500 text-white p-2 mt-2"
                          onClick={() => handleReplySubmit(ticket._id)}
                        >
                          Send Reply
                        </button>
                        <button
                          className="bg-gray-300 text-black p-2 mt-2"
                          onClick={() => setSelectedTicketId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      ticket.status !== "Completed" && (
                        <button
                          className="bg-green-500 text-white p-2"
                          onClick={() => setSelectedTicketId(ticket._id)}
                        >
                          Reply
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ViewTicket;
