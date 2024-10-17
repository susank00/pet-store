import { useEffect, useState } from "react";
import axios from "axios";
import SideNavbar from "../components/SideNavbar";
import { useDispatch } from "react-redux";
import { setSelectedEmployeesId } from "../redux/actions";
import AdminUserEdit from "./Adminuseredit";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Ensure this import is correct

const Adminfunction = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [employees, setEmployees] = useState([]);
  const [showAdminUserEdit, setShowAdminUserEdit] = useState(false);
  const [rolee, setRole] = useState(null); // State to hold user role

  // Fetch employee names
  const fetchEmployees = async (accessToken) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL_PROD_API_URL}/employeeNames`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          timeout: 1000,
        }
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employee names:", error);
      if (error.response && error.response.status === 401) {
        navigate("/login"); // Redirect to login if unauthorized
      }
    }
  };

  // Check for token and fetch employees
  useEffect(() => {
    const getAccessToken = localStorage.getItem("accessToken");

    if (!getAccessToken) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(getAccessToken);
      setRole(decodedToken.role); // Save user role

      // Now fetch employees after decoding the token
      fetchEmployees(getAccessToken);
    } catch (error) {
      console.error("Failed to decode access token:", error);
      navigate("/login");
    }
  }, [navigate]);

  // Redirect if role is not admin
  useEffect(() => {
    if (rolee !== null && rolee !== "admin") {
      navigate("/profile"); // Redirect if role is not admin
    }
  }, [rolee, navigate]); // Add rolee and navigate to dependencies

  // Handle edit click
  const handleEditClick = (employeeId) => {
    console.log("Employee ID:", employeeId);
    dispatch(setSelectedEmployeesId(employeeId));
    setShowAdminUserEdit(true);
  };

  return (
    <>
      <div className="flex-grow  relative w-full min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white  ">
        <SideNavbar />
        {rolee === "admin" && (
          <div className="ml-64 relative overflow-x-auto h-screen">
            <h1 className="bg-gray-600 text-5xl text-red-600 text-center p-2">
              All Employees
            </h1>
            {showAdminUserEdit && <AdminUserEdit />}
            <table className="w-full  text-sm text-left text-gray-500 dark:text-gray-400">
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
                    className="bg-grey-50 border-b dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
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
        )}
      </div>
    </>
  );
};

export default Adminfunction;
