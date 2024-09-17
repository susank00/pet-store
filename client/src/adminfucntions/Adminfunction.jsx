import { useEffect, useState } from "react";
import axios from "axios";
import SideNavbar from "../components/SideNavbar";
import { useDispatch } from "react-redux";
import { setSelectedEmployeesId } from "../redux/actions";
import AdminUserEdit from "./Adminuseredit";
import { useNavigate } from "react-router-dom";

const Adminfunction = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [employees, setEmployees] = useState([]);
  const [userName, setUserName] = useState("");
  const [result, setResult] = useState("");
  const [showAdminUserEdit, setShowAdminUserEdit] = useState(false);

  // Retrieve access token
  const getAccessToken = localStorage.getItem("accessToken");

  // Check for token and fetch employees
  useEffect(() => {
    if (!getAccessToken) {
      navigate("/login"); // Redirect to login if token is not found
      return;
    }

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/employeeNames",
          {
            headers: {
              Authorization: `Bearer ${getAccessToken}`,
            },
            timeout: 10000,
          }
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employee names:", error);
        // Handle error (e.g., redirect to login if token is invalid)
        if (error.response && error.response.status === 401) {
          navigate("/login"); // Redirect to login if unauthorized
        }
      }
    };

    fetchEmployees();
  }, [getAccessToken, navigate, employees, showAdminUserEdit]);

  // Handle edit click
  const handleEditClick = (employeeId) => {
    console.log("Employee ID:", employeeId);
    dispatch(setSelectedEmployeesId(employeeId));
    setShowAdminUserEdit(true);
  };

  // Handle delete user
  // const deleteUser = async () => {
  //   try {
  //     const response = await axios.delete(
  //       `http://localhost:3001/api/employees/delete/${userName}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${getAccessToken}`,
  //         },
  //       }
  //     );
  //     setResult(response.data.message);
  //   } catch (error) {
  //     console.error("Error:", error);
  //     setResult("An error occurred while processing your request.");
  //   }
  // };

  return (
    <>
      <SideNavbar />
      <div className="ml-64 relative overflow-x-auto">
        <h1 className="bg-gray-600 text-5xl text-red-600 text-center p-2">
          All Employees
        </h1>
        {showAdminUserEdit && <AdminUserEdit />}
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Employee Name
              </th>
              <th scope="col" className="px-6 py-3">
                Employee ID
              </th>
              <th scope="col" className="px-6 py-3">
                Role
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Modify
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee._id}
                className="bg-red-900 border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {employee.name}
                </th>
                <td className="px-6 py-4">{employee._id}</td>
                <td className="px-6 py-4">{employee.role}</td>
                <td className="px-6 py-4">{employee.email}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleEditClick(employee._id)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Adminfunction;
