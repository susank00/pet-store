import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import MyNavbar from "../components/MyNavbar";
import Loginhandler from "../functionalcomponent/Loginhandler";
const Profile = () => {
  const location = useLocation();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const userEmail = location.state && location.state.email;

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
    } catch (error) {
      if (error.response) {
        alert(error.response.data.errors[0].message);
      } else {
        alert("Unknown error, please try again");
      }
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.post("http://localhost:3001/getUserInfo", {
        email: userEmail,
      });

      if (response.data.success) {
        setName(response.data.name);
        setPassword(response.data.password);
        setRole(response.data.role);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user information:", error.message);
    }
  };

  useEffect(() => {
    // Fetch user info only once when the component mounts
    fetchUserInfo();
    getProfile();
  }, []);

  return (
    <>
      <MyNavbar />

      {name || password ? (
        <div>
          Welcome, {name} <br />
          (Role: {role})<br />
          <Loginhandler />
          {role === "admin" && (
            <>
              {/* Render Adminfunction only if the role is admin */}{" "}
              <div className="max-w-sm p-1 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <a href="/admin">
                  <h5 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-black">
                    ADMIN function
                  </h5>
                  <img
                    src="./images/admin.png" // Replace with the actual path to your image
                    alt="Admin Function Image"
                    className="max-w-full h-auto"
                  />
                </a>
                <p className="mb-4 font-normal text-gray-700 dark:text-black-800">
                  List|Delete|modify
                </p>
                <a
                  href="/admin"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Go to Admin panel
                </a>
              </div>
            </>
          )}
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </>
  );
};

export default Profile;
