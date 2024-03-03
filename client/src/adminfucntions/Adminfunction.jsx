import { useEffect, useState } from "react";
import axios from "axios";
import SideNavbar from "../components/SideNavbar";

const Adminfunction = () => {
  const [employees, setEmployees] = useState([]);
  const [userName, setUserName] = useState("");
  const [result, setResult] = useState("");
  // function for listing employess name
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:3001/employeeNames");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employee names:", error);
      }
    };
    fetchEmployees();
  }, []);
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
  // const handleClick = () => {
  //   fetchEmployees();
  // };
  const onnClick = () => {
    deleteUser();
  };

  return (
    <>
      <SideNavbar />
      <div className="ml-64 relative overflow-x-auto ">
        <h1 className="bg-gray-600 text-5xl text-red-600 text-center p-2">
          All emoloyees
        </h1>

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Employee Name
              </th>
              <th scope="col" className="px-6 py-3">
                Employee id
              </th>
              <th scope="col" className="px-6 py-3">
                ROle
              </th>
              <th scope="col" className="px-6 py-3">
                email
              </th>

              {/* <th scope="col" className="px-6 py-3">
                modify
              </th> */}
            </tr>
          </thead>
          <tbody>
            {employees.map((employees) => (
              <tr
                key={employees._id}
                className="bg-red-900 border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {employees.name}
                </th>
                <td className="px-6 py-4">{employees._id}</td>
                <td className="px-6 py-4">{employees.role}</td>
                <td className="px-6 py-4">{employees.email}</td>

                {/* <td className="px-6 py-4 ">
                  <button
                    onClick={() => handleEditClick(product._id)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <MyNavbar /> */}

      {/* <div> */}
      {/* <button onClick={handleClick}> */}
      {/* Click me to fetch employee names{" "} */}
      {/* <ul>
            {employeeNames.map((employeeName, index) => (
              <li key={index}>{employeeName}</li>
            ))}
          </ul> */}
      <ul>{employees.name}</ul>
      {/* </button> */}
      {/* <br />
      </div>
      <br />
      <br />
      <br />
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
      </div> */}
    </>
  );
};

export default Adminfunction;
