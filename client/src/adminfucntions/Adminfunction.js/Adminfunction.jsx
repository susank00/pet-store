import { useEffect, useState } from "react";
import axios from "axios";

const Adminfunction = () => {
  const [employeeNames, setEmployeeNames] = useState([]);

  const fetchEmployeeNames = async () => {
    try {
      const response = await axios.get("http://localhost:3001/employeeNames");
      setEmployeeNames(response.data);
    } catch (error) {
      console.error("Error fetching employee names:", error);
    }
  };
  useEffect(() => {
    fetchEmployeeNames();
  }, []);
  return (
    <>
      <div>
        <ul>
          {employeeNames.map((employeeName, index) => (
            <li key={index}>{employeeName}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Adminfunction;
