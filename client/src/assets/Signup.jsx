import { useState } from "react";
import "../styles/signup.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/register", { name, email, password })
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
    <div className="signup-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Register Here</h1>
        <div>
          <label>
            NAME:
            <br />
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </div>
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

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
        <br /> <br />
        Already registered!!
        <br />
        <button>
          <Link to="/login">Login here</Link>
        </button>
      </form>
    </div>
  );
};

export default Signup;
