import { useState } from "react";
import "../styles/signup.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/login", { email, password })
      .then((result) => {
        console.log(result);
        if (result.data === "success") {
          navigate("/profile", { state: { email } });
        } else {
          // Show an alert for unsuccessful login
          alert(response.data.errors[0].message);
        }
      })
      .catch((err) => {
        console.error(err);
        // Show an alert for any other errors
        alert("An error occurred. Please try again later.");
      });
  };
  return (
    <div className="signup-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>User Login</h2>
        <div>
          <label>
            EMAIL:
            <br />
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>PASSWORD:</label>
          <br />
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
export default Login;
