import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const AdminUserEdit = () => {
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

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
          `http://localhost:3001/employeeNames/${selectedEmployeesId}`
        );
        setName(response.data.name);
        setEmail(response.data.email);
        setPassword(response.data.password);
        setRole(response.data.role);
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
    setName("");
    setEmail("");
    setPassword("");
    setRole("");
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    setIsLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:3001/employeeNames/${selectedEmployeesId}`,
        {
          name,
          email,
          password,
          role,
        }
      );
      console.log("User updated successfully:", response.data);
      setShowForm(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
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
          className="absolute w-6/12 rounded-lg p-4 mt-8 bg-gray-800 z-10"
          style={{ transform: `translate(${position.x}px, ${position.y}px)` }} // Apply position
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
              X
            </button>
            <h2 className=" text-center text-2xl ">Update User</h2>
          </div>

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
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                Email
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                Password
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                Role
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <button
              onClick={handleSubmit}
              className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
            >
              Update User
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminUserEdit;
