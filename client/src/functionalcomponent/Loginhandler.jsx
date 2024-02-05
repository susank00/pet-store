 
 import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Loginhandler = () => {
  const [isloggedin, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

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
        alert("unkknown error,please try again");
      }
    }
  };
  const checkUserStatus = async () => {
    const getAccessToken = localStorage.getItem("accessToken");
    if (getAccessToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };
  const onLogout = async () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false); //
    navigate("/");
  };
  const onLogin = async () => {
    navigate("/login");
  };
  useEffect(() => {
    getProfile();
    checkUserStatus();
  }, []);

  return (
    <>
      <div>
        {isloggedin ? (
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={onLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={onLogin}
          >
            Login
          </button>
        )}
      </div>
    </>
  );
};
export default Loginhandler;
