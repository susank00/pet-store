import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import SideNavbar from "../components/SideNavbar";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL_PROD_API_URL_TICKET_RENDER, {
  transports: ["polling"], // This forces the use of polling
}); // Connect to the Socket.IO server

const ViewTicketuser = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [replyMessage, setReplyMessage] = useState({});

  // Decode user ID from the JWT token stored in localStorage
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    }
  }, []);

  // Fetch tickets associated with the user
  useEffect(() => {
    const fetchTickets = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_URL_PROD_API_URL_TICKET_RENDER
            }/api/tickets/user/${userId}`
          );
          setTickets(response.data);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTickets();
  }, [userId]);

  // Handle socket event for ticket updates
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

  // Handle reply input change
  const handleReplyChange = (ticketId, value) => {
    setReplyMessage({ ...replyMessage, [ticketId]: value });
  };

  // Submit reply if the ticket is not marked as "Completed"
  const handleReplySubmit = async (ticketId) => {
    if (!replyMessage[ticketId]) return; // No reply to send

    try {
      await axios.post(
        `${
          import.meta.env.VITE_API_URL_PROD_API_URL_TICKET_RENDER
        }/api/tickets/${ticketId}/reply`,
        {
          message: replyMessage[ticketId],
          senderType: "user", // 'user' type for user replies
          senderId: userId,
        }
      );

      setReplyMessage({ ...replyMessage, [ticketId]: "" }); // Clear the input after replying
      // alert("Reply sent successfully!");
    } catch (err) {
      alert("Error sending reply.");
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
          <h1 className="text-grey-900 justify-center flex text-2xl">
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
                <th className="border border-gray-300 p-2">Reply</th>
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
                    <div className="space-y-2">
                      {ticket.replies && ticket.replies.length > 0 ? (
                        ticket.replies.map((reply, index) => (
                          <div
                            key={index}
                            className={`p-2 ${
                              reply.senderType === "user"
                                ? "bg-blue-100"
                                : "bg-green-100"
                            }`}
                          >
                            <strong>
                              {reply.senderType === "user" ? "You" : "Admin"}:
                            </strong>{" "}
                            {reply.message}
                          </div>
                        ))
                      ) : (
                        <div>No replies yet</div>
                      )}
                    </div>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span
                      className={`${
                        ticket.status === "Completed"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-2">
                    {ticket.status === "Completed" ? (
                      <div className="text-gray-500">Replies closed</div>
                    ) : (
                      <>
                        <textarea
                          className="w-full p-2 border"
                          placeholder="Type your reply..."
                          value={replyMessage[ticket._id] || ""}
                          onChange={(e) =>
                            handleReplyChange(ticket._id, e.target.value)
                          }
                        />
                        <button
                          className="bg-blue-500 text-white px-4 py-2 mt-2"
                          onClick={() => handleReplySubmit(ticket._id)}
                        >
                          Send Reply
                        </button>
                      </>
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

export default ViewTicketuser;
