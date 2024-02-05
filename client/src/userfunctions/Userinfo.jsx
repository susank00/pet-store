import { useEffect, useState } from "react";
import axios from "axios";

const Userinfo = () => {
  const [userName, setUserName] = useState(null);
  const getAccessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3001/profile", {
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
      fetchUserProfile();
    }
  }, [getAccessToken]);

  return (
    <div>
      {userName ? <p>Welcome, {userName}!</p> : <p>Loading user profile...</p>}
    </div>
  );
};

export default Userinfo;
