import axios from "axios";
import { useEffect, useState } from "react";

const UserFunction = () => {
  const [userData, setUserData] = useState({});
  const [employeeName, setEmployeeName] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const getProfile = async () => {
    const getAccessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.get("http://localhost:3001/profile", {
        timeout: 10000,
        headers: {
          Authorization: `Bearer ${getAccessToken}`,
        },
      });
      console.log(response);
      setUserData(response.data.user);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.errors[0].message);
      } else {
        alert("Unknown error, please try again");
      }
    }
  };
  const updateEmployee = async () => {
    try {
      // Make a PUT request to the API endpoint with the updated data
      await axios.put(`http://localhost:3001/employees/${userData.name}`, {
        newName,
        newPassword,
      });

      console.log("Employee updated successfully");
    } catch (error) {
      console.error("Error updating employee:", error.message);
    }
  };
  useEffect(() => {
    getProfile();
  }, []);
  return (
    <>
      <div className="max-w-sm mx-auto p-8 rounded border border-gray-300 bg-red-300 dark:ring-gray-500">
        <h2 className="text-2xl font-bold mb-4">Update Employee Information</h2>
        <br />
        <label className="block mb-2 text-sm  text-gray-900 dark:text-black font-bold "></label>
        <label className="font-bold">Current UserName: {userData.name}</label>
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
