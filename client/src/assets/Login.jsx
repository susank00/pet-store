import { useState } from "react";
import "../styles/signup.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();

    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL_PROD_API_URL}/login`,
        loginData,
        {
          timeout: 10000,
        }
      );
      const getAccessToken = response.data.accessToken;
      localStorage.setItem("accessToken", getAccessToken);

      if (response.data.status === "success") {
        alert("Logged in successfully!");
      }

      if (response.data.success) {
        navigate("/profile", { state: { email } });
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-800 animate-gradient">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
            Welcome Back!
          </h2>
          <form onSubmit={loginHandler}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300"
            >
              Login
            </button>
            <p className="mt-6 text-center text-sm text-gray-600">
              Not registered yet?{" "}
              <Link
                to="/register"
                className="font-medium text-pink-600 hover:text-pink-500"
              >
                Register Now
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
