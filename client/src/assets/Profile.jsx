import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Profile = () => {
  const location = useLocation();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const userEmail = location.state && location.state.email;
  const [employeeNames, setEmployeeNames] = useState([]);
  useEffect(() => {
    const fetchEmployeeNames = async () => {
      try {
        const response = await fetch("http://localhost:3001/employeeNames");
        const namesData = await response.json();
        setEmployeeNames(namesData);
      } catch (error) {
        console.error("Error fetching employee names:", error);
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
          console.error("User information not found:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching user information:", error.message);
      }
    };

    if (userEmail) {
      fetchUserInfo();
    }

    fetchEmployeeNames(); // Move this line outside of fetchUserInfo if you want it to run unconditionally
  }, [userEmail]);

  return (
    <>
      {name || password ? (
        <div>
          Welcome,
          {name}
          (Role: {role})<h1>List of Employee Names</h1>
          <ul>
            {employeeNames.map((employeeName, index) => (
              <li key={index}>{employeeName}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </>
  );
};

export default Profile;
