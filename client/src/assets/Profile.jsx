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

  const fetchUserInfo = async () => {
    try {
      const response = await axios.post("http://localhost:3001/getUserInfo", {
        email: userEmail,
      });

      if (response.data.success) {
        setName(response.data.name);
        setPassword(response.data.password);
        setRole(response.data.role);
      }
      if (response.data.role === "admin") {
        <Adminfunction />;
      } else {
        console.error("User information not found:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user information:", error.message);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchUserInfo();
    }
  }, [userEmail]);

  return (
    <>
      <MyNavbar />
      {name || password ? (
        <div>
          Welcome, {name} <br />
          (Role: {role})
          {role === "admin" && (
            <>
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
