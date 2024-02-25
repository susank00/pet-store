import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import MyNavbar from "../components/MyNavbar";
import Loginhandler from "../functionalcomponent/Loginhandler";
import UserFunction from "../userfunctions/UserFunction";
import AddProductForm from "../pages/AddProductForm";

const Profile = () => {
  const location = useLocation();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const userEmail = location.state && location.state.email;
  useEffect(() => {
    // Fetch user info only once when the component mounts
    fetchUserInfo();
    getProfile();
  }, []);
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

  return (
    <>
      {/* <MyNavbar /> */}

      {name || password ? (
        <div className="container mx-auto">
          <p className=" text-center text-4xl text-gray-900 dark:text-black  font-bold">
            {" "}
            Welcome, {name} <br />
            Role: {role}
          </p>{" "}
          <br />
          <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {role === "admin" && (
              <>
                {/* Render Adminfunction only if the role is admin */}{" "}
                <div className="  max-w-sm p-1  border border-gray-200 rounded-lg shadow dark:bg-blue-500 dark:border-gray-700">
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
                <div className=" bg-blue-600 max-w-sm p-2 border border-gray-600 rounded-lg shadow dark:dark:border-gray-600">
                  <a href="/admin">
                    <h5 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-black">
                      Product Management
                    </h5>
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src="./images/productmgm.png" // Replace with the actual path to your image
                        alt="Admin Function Image"
                        className="max-w-full h-auto"
                      />
                    </div>
                  </a>

                  <p className="mb-4 font-normal text-gray-700 dark:text-black-800">
                    ADD|Delete|modify
                  </p>
                  <a
                    href="/addproduct"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Go to Product mangement panel
                  </a>
                </div>
                <div className="max-w-sm p-1 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                  <a href="/admin">
                    <h5 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-black">
                      Analytics
                    </h5>
                    <img
                      src="./images/analytics.png"
                      alt="Admin Function Image"
                      className="max-w-full h-25"
                    />
                  </a>
                  <p className="mb-4 font-normal text-gray-700 dark:text-black-800">
                    Observe|Analyze|
                  </p>
                  <a
                    href="/addproduct"
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Analytics Protocols
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-4xl font-black p-20">
          <p>Login to enter in to your profile </p>
          <Loginhandler />
        </div>
      )}
    </>
  );
};

export default Profile;
