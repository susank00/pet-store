import axios from "axios";
import { useEffect, useState } from "react";

const UserFunction = () => {
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [userName, setUserName] = useState(null);
  const getAccessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3001/profile", {
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${getAccessToken}`,
          },
        });

        const { success, user } = response.data;

        if (success) {
          setUserName(user.name);
        } else {
          console.log("Error fetching user profile:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (getAccessToken) {
      getProfile();
    }
  }, [getAccessToken]);

  const updateEmployee = async () => {
    try {
      // Make a PUT request to the API endpoint with the updated data
      await axios.put(`http://localhost:3001/employees/${userName}`, {
        newName,
        newPassword,
      });

      console.log("Employee updated successfully");
    } catch (error) {
      console.error("Error updating employee:", error.message);
    }
  };

  return (
    <>
      <div className="max-w-sm mx-auto p-8 rounded border border-gray-300 bg-red-300 dark:ring-gray-500">
        <h2 className="text-2xl font-bold mb-4">Update Employee Information</h2>
        <br />
        <label className="block mb-2 text-sm  text-gray-900 dark:text-black font-bold "></label>
        <label className="font-bold">Current UserName: {userName}</label>
        <label className="block mb-2 text-sm  text-gray-900 dark:text-black font-bold "></label>
        <input
          className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          type="text"
          id="newName"
          placeholder="Enter new name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <label htmlFor="newPassword">New Password:</label>
        <input
          className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          type="password"
          id="newPassword"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          onClick={updateEmployee}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Update Employee
        </button>
      </div>
    </>
  );
};
export default UserFunction;
