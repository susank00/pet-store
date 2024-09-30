import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import SideNavbar from "../components/SideNavbar";

const ViewTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      setUserId(decodedToken.userId);
    }
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/tickets");
        setTickets(response.data);
        console.log(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [setTickets]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching tickets: {error.message}</div>;
  }

  return (
    <>
      <SideNavbar />
      <div className="ml-64 relative overflow-x-auto">
        <h1 className=" text-grey-900 justify-center flex text-2xl">Tickets</h1>
        {/* <table className=" ml-64 relative overflow-x-auto border-collapse border border-gray-300"> */}
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-900">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">userId</th>

              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">subject</th>
              <th className="border border-gray-300 p-2">message</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.userId}>
                <td className="border border-gray-300 p-2">{ticket.userId}</td>
                <td className="border border-gray-300 p-2">
                  {ticket.tickettitle}
                </td>
                <td className="border border-gray-300 p-2">{ticket.subject}</td>
                <td className="border border-gray-300 p-2">{ticket.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ViewTicket;
