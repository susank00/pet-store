import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const AdminUserEdit = () => {
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [originalData, setOriginalData] = useState({});

  const selectedEmployeesId = useSelector(
    (state) => state.reducer.selectedEmployeesId
  );

  const formRef = useRef(null); // Create a ref for the form
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL_PROD_API_URL
          }/employeeNames/${selectedEmployeesId}`
        );
        const { name, email, password, role } = response.data;
        setFormData({ name, email, password, role });
        setOriginalData({ name, email, password, role }); // Store the original data for comparison
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedEmployeesId) {
      fetchUser();
    }
  }, [selectedEmployeesId]);

  const handleClose = () => {
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any field has changed compared to the original data
    const updatePayload = {};
    for (let key in formData) {
      if (formData[key] !== originalData[key]) {
        updatePayload[key] = formData[key];
      }
    }

    // Only proceed with update if there's any change
    if (Object.keys(updatePayload).length > 0) {
      setIsLoading(true);
      try {
        const response = await axios.put(
          `${
            import.meta.env.VITE_API_URL_PROD_API_URL
          }/employeeNames/${selectedEmployeesId}`,
          updatePayload
        );
        console.log("User updated successfully:", response.data);
        setShowForm(false);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("No changes detected.");
    }
  };

  const onMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const onMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const onMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex justify-center">
      {showForm && (
        <div
          ref={formRef}
          className="absolute w-6/12 rounded-lg p-4 mt-8 bg-gray-800 z-15"
          style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        >
          <div
            className="cursor-move bg-gray-800 text-white p-2"
            onMouseDown={onMouseDown}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                handleClose();
                window.location.reload();
              }}
              className="absolute top-1 right-1 text-white bg-red-600 p-1 rounded-full"
            >
              CLOSE
            </button>
            <h2 className="text-center text-2xl">Update User</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                  User ID: {selectedEmployeesId}
                </label>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                  Name
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                  Email
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                  Password
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                  Role
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                />
              </div>
              <button
                type="submit"
                className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
              >
                Update User
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserEdit;
