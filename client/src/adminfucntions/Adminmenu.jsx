import { useEffect, useState } from "react";
import axios from "axios";
// import { useLocation } from "react-router-dom";

import Loginhandler from "../functionalcomponent/Loginhandler";
import SideNavbar from "../components/SideNavbar";
const Adminmenu = () => {
  // const location = useLocation();
  const [name, setName] = useState("");

  // const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  // const userEmail = location.state && location.state.email;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user info only once when the component mounts

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
      setName(response.data.user.name);
      setRole(response.data.user.role);
      setLoading(false);
      console.log(response);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.errors[0].message);
      } else {
        alert("Unknown error, please try again");
      }
    }
  };

  return (
    <>
      <SideNavbar />
      <div className="bg-gray-500 p-4 sm:ml-64 ">
        {loading ? ( // Show loading indicator if loading is true
          <div className="text-center text-4xl font-black p-20">Loading...</div>
        ) : name ? (
          <div className="container m-0 p-0">
            <p className=" text-center text-4xl text-gray-900 dark:text-black font-bold  ">
              Welcome, {name} <br />
              Role: {role}
            </p>

            <br />
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
              {role === "admin" && (
                <>
                  {/* Render Adminfunction only if the role is admin */}{" "}
                  <div
                    className=" bg-gray-600 shadow-md rounded p-4 flex flex-col justify-between"
                    style={{ height: "350px" }}
                  >
                    <a href="/admin">
                      <h5 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-black">
                        ADMIN function
                      </h5>
                      <div
                        style={{
                          width: "80%",
                          height: "200px",
                          overflow: "hidden",
                          padding: "20px",
                          marginLeft: "30px",
                        }}
                      >
                        <img
                          src="./images/admin.png" // Replace with the actual path to your image
                          alt="Admin Function Image"
                          className="max-w-full h-auto"
                        />
                      </div>
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
                  <div
                    className=" bg-gray-600 shadow-md rounded p-4 flex flex-col justify-between"
                    style={{ height: "350px" }}
                  >
                    <a href="/admin">
                      <h5 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-black">
                        Product Management
                      </h5>
                      <div
                        style={{
                          width: "50%",
                          height: "200px",
                          overflow: "hidden",
                          marginLeft: "80px",
                        }}
                      >
                        <img
                          className=""
                          src="./images/productmgm.png" // Replace with the actual path to your image
                          alt="Admin Function Image"
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
                  <div
                    className="bg-gray-600 shadow-md rounded p-4 flex flex-col justify-between"
                    style={{ height: "350px" }}
                  >
                    <a href="/admin">
                      <h5 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-black">
                        Analytics
                      </h5>
                      <div
                        style={{
                          width: "50%",
                          height: "200px",
                          overflow: "hidden",
                          marginLeft: "80px",
                        }}
                      >
                        <img
                          className=""
                          src="./images/analytics.png" // Replace with the actual path to your image
                          alt="Admin Function Image"
                        />
                      </div>
                    </a>

                    <p className="mb-4 font-normal text-gray-700 dark:text-black-800 ml-16">
                      ADD|Delete|modify
                    </p>
                    <a
                      href="/addproduct"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mx-auto"
                    >
                      Goto Analtics panel
                    </a>
                  </div>
                  <div
                    className="bg-gray-600 shadow-md rounded p-4 flex flex-col justify-between"
                    style={{ height: "350px" }}
                  >
                    <a href="/admin">
                      <h5 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-black">
                        Analytics
                      </h5>
                      <div
                        style={{
                          width: "50%",
                          height: "200px",
                          overflow: "hidden",
                          marginLeft: "80px",
                        }}
                      >
                        <img
                          className=""
                          src="./images/analytics.png" // Replace with the actual path to your image
                          alt="Admin Function Image"
                        />
                      </div>
                    </a>

                    <p className="mb-4 font-normal text-gray-700 dark:text-black-800 ml-16">
                      ADD|Delete|modify
                    </p>
                    <a
                      href="/addproduct"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mx-auto"
                    >
                      Goto Analtics panel
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
      </div>
    </>
  );
};
export default Adminmenu;
