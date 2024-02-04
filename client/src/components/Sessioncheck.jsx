import axios from "axios";
import { useEffect } from "react";

const Sessioncheck = () => {
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
  useEffect(() => {
    getProfile();
  }, []);
  return <></>;
};
export default Sessioncheck;
