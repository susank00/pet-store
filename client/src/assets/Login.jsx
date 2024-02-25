import { useState } from "react";
import "../styles/signup.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MyNavbar from "../components/MyNavbar";
import { useDispatch } from "react-redux";
import { setUserSession } from "../redux/actions";

const Login = () => {
  const dispatch = useDispatch();
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
        "http://localhost:3001/login",
        loginData,
        {
          timeout: 10000,
        }
      );
      const userData = response.data.user;
      dispatch(setUserSession(userData));
      const getAccessToken = response.data.accessToken;
      localStorage.setItem("accessToken", getAccessToken);

      if (response.data.status === "success") {
        alert("logged in success");
      }

      if (response.data.success) {
        navigate("/profile", { state: { email } });
      } else {
        // Show an alert for unsuccessful login
        alert(response.data.message);
      }
    } catch (err) {
      console.error(err);
      // Show an alert for any other errors
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      {/* <MyNavbar /> */}

      <br />
      <br />

      <form
        className="max-w-sm mx-auto p-8 rounded border border-gray-300 bg-red-300 dark:ring-gray-500"
        onSubmit={loginHandler}
      >
        <h2 className="text-2xl font-bold mb-4">User Login</h2>
        <div className="mb-4">
          <label className="block mb-2 text-sm  text-gray-900 dark:text-black font-bold ">
            EMAIL:
            <br />
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">
            PASSWORD:
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Login
        </button>
        <div className="mt-4">
          Not registered yet!!{" "}
          <Link
            to="/register"
            className="text-blue-700 font-bold dark:text-blue-400"
          >
            Register Now
          </Link>
        </div>
      </form>
    </>
  );
};
export default Login;
