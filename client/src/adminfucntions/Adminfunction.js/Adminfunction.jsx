import { useState } from "react";
import axios from "axios";

const Adminfunction = () => {
  const [employeeNames, setEmployeeNames] = useState([]);
  const [userName, setUserName] = useState("");
  const [result, setResult] = useState("");
  // function for listing employess name
  const fetchEmployeeNames = async () => {
    try {
      const response = await axios.get("http://localhost:3001/employeeNames");
      setEmployeeNames(response.data);
    } catch (error) {
      console.error("Error fetching employee names:", error);
    }
  };
  // end>>>
  // function for deleting user
  const deleteUser = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/employees/delete/${userName}`
      );

      if (response.data.success) {
        setResult(` ${response.data.message}`);
      } else {
        setResult(`${response.data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setResult("An error occurred while processing your request.");
    }
  };

  // end >>>
  const handleClick = () => {
    fetchEmployeeNames();
  };
  const onnClick = () => {
    deleteUser();
  };

  return (
    <>
      <div>
        <button onClick={handleClick}>
          Click me to fetch employee names{" "}
          <ul>
            {employeeNames.map((employeeName, index) => (
              <li key={index}>{employeeName}</li>
            ))}
          </ul>
        </button>

        <br />
      </div>
      <div>
        <h2>Delete User by Name</h2>
        <label htmlFor="userName">Enter User Name:</label>
        <input
          type="text"
          id="userName"
          placeholder="User Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button onClick={onnClick}>Delete User</button>
        <p>{result}</p>
      </div>
    </>
  );
};

export default Adminfunction;
