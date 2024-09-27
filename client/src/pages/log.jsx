// src/LogViewer.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get("http://localhost:3001/get-logs"); // Adjust the URL to your backend
        setLogs(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <p className="text-center">Loading logs...</p>;
  if (error)
    return (
      <p className="text-red-500 text-center">Error fetching logs: {error}</p>
    );

  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-2xl font-bold mb-4 text-center">User Logs</h1>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b border-gray-300 text-left">
              IP Address
            </th>
            <th className="py-2 px-4 border-b border-gray-300 text-left">
              User Agent
            </th>
            <th className="py-2 px-4 border-b border-gray-300 text-left">
              Location
            </th>
            <th className="py-2 px-4 border-b border-gray-300 text-left">
              Latitude
            </th>
            <th className="py-2 px-4 border-b border-gray-300 text-left">
              Longitude
            </th>
            <th className="py-2 px-4 border-b border-gray-300 text-left">
              Timestamp
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b border-gray-300">
                {log.ipAddress}
              </td>
              <td className="py-2 px-4 border-b border-gray-300">
                {log.userAgent}
              </td>
              <td className="py-2 px-4 border-b border-gray-300">
                {log.location.country}, {log.location.region},{" "}
                {log.location.city}
              </td>
              <td className="py-2 px-4 border-b border-gray-300">
                {log.location.latitude}
              </td>
              <td className="py-2 px-4 border-b border-gray-300">
                {log.location.longitude}
              </td>
              <td className="py-2 px-4 border-b border-gray-300">
                {log.timestamp}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogViewer;
