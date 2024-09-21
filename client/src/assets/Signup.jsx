import { useState } from "react";
import "../styles/signup.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MyNavbar from "../components/MyNavbar";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role is set to 'user'
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${import.meta.env.VITE_API_URL_PROD_API_URL}/register`, {
        name,
        email,
        password,
        role, // Send the selected role to the server
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          navigate("/login", { state: { email } });
        } else {
          alert(response.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        // Show an alert for any other errors
        alert("An error occurred. Please try again later.");
      });
  };

  return (
    <>
      {/* <MyNavbar /> */}
      <br /> <br /> <br />
      <form
        className="max-w-sm mx-auto p-8 rounded border border-gray-300 bg-red-300 dark:ring-gray-500"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-4">Register Here</h1>
        <div className="mb-4">
          <label className="block mb-2 text-sm  text-gray-900 dark:text-black font-bold ">
            NAME:
            <br />
            <input
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              type="text"
              name="name"
              placeholder="Enter name"
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">
            EMAIL:
            <br />
            <input
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">
            PASSWORD:
            <br />
            <input
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Register
        </button>
        <br />
        Already registered!!
        <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-black">
          <Link to="/login">Login here</Link>
        </label>
      </form>
    </>
  );
};

export default Signup;
