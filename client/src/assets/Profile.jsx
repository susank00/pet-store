import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import MyNavbar from "../components/MyNavbar";
import Adminfunction from "../adminfucntions/Adminfunction.js/Adminfunction";

const Profile = () => {
  const location = useLocation();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const userEmail = location.state && location.state.email;

  useEffect(() => {
    getProfile();
    // Fetch user info only once when the component mounts
    fetchUserInfo();
  }, []);

  const getProfile = async () => {
    const getAccessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.post("http://localhost:3001/login", {
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

  return (
    <>
      <MyNavbar />
      {name || password ? (
        <div>
          Welcome, {name} <br />
          (Role: {role})
          {role === "admin" && (
            <>
              {/* Render Adminfunction only if the role is admin */}
              <Adminfunction />
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
