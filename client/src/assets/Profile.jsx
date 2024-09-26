import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import SideNavbar from "../components/SideNavbar";
import { useDispatch } from "react-redux";
import { setUserId } from "../redux/actions";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate hook
  const [username, setUsername] = useState(""); // State for storing username
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login"); // If access token is missing, redirect to login immediately
    } else {
      getProfile(); // Fetch profile data
    }
  }, []);

  const getProfile = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL_PROD_API_URL}/profile`,
        {
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const userId = response.data.user.userId;
      const userName = response.data.user.name; // Extract username from response

      dispatch(setUserId(userId)); // Dispatch userId to Redux store
      setUsername(userName); // Set username state
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      if (error.response) {
        alert(error.response.data.errors[0].message);
      } else {
        alert("Unknown error, please try again");
      }
      navigate("/login"); // Redirect to login on error
      setLoading(false); // Even on error, stop the loading state
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold">
        Loading...
      </div>
    ); // Stylish loading state
  }

  return (
    <>
      {localStorage.getItem("accessToken") ? (
        <>
          <div className="flex">
            {/* Main Content */}
            <div className="flex-grow relative w-full min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center">
              {/* Background Image or Gradient */}
              <div className="absolute inset-0 z-0 bg-hero-pattern bg-cover bg-center opacity-50"></div>
              {/* Welcome Section */}
              <SideNavbar />
              <div className="relative z-10 text-center p-8">
                <h1 className="text-5xl font-extrabold animate-fadeInUp mb-4">
                  Welcome, {username}!
                </h1>
                <p className="text-xl font-light mb-8 animate-fadeIn delay-2s">
                  We are glad to have you here. Explore your profile and
                  settings.
                </p>

                {/* CTA Buttons */}
                <div className="space-x-4">
                  <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-200 transition-all">
                    Profile Settings
                  </button>
                  <button className="bg-indigo-500 text-white px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-indigo-700 transition-all">
                    Explore Features
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <navigate to="/login" />
        </>
      )}
    </>
  );
};

export default Profile;
