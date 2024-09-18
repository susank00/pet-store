import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SideNavbar from "../components/SideNavbar";

const Profileedit = () => {
  const [username, setUsername] = useState(""); // State to store the fetched username
  const [email, setEmail] = useState(""); // State to store the fetched email
  const [password, setPassword] = useState(""); // State to store the password input
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [employee, setEmployee] = useState(null);

  const UserId = useSelector((state) => state.reducer.UserId); // Get UserId from Redux store
  const navigate = useNavigate(); // Navigation hook

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    } else {
      setPreviewImage(null);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL_PROD_API_URL}/employeeNames/${UserId}`
        );
        console.log("API URL:", import.meta.env.VITE_API_URL_PROD_API_URL);

        setEmployee(response.data);
        setUsername(response.data.name);
        setEmail(response.data.email);
        setPassword(response.data.password); // Ideally, you shouldn't fetch passwords like this
        setPreviewImage(
          response.data.image
            ? `https://mern-loginbackend.vercel.app/images/${response.data.image}`
            : null
        );
        console.log(
          `${import.meta.env.VITE_API_URL_PROD_API_URL}/images/${
            response.data.image
          }`
        );
        console.log("Preview Image URL:", previewImage);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/login"); // Redirect to login if there's an error
      }
    };

    if (UserId) {
      fetchProfile();
    } else {
      alert("User ID is missing.");
      navigate("/login"); // Redirect to login if UserId is not available
    }
  }, [UserId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", username);
    formData.append("email", email);
    formData.append("password", password);
    if (file) {
      formData.append("file", file);
    }
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL_PROD_API_URL}/employeeNames/${UserId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setEmployee(response.data);
      setFile(null);
      setPreviewImage(
        response.data.image
          ? `${import.meta.env.VITE_API_URL_PROD_API_URL}/static/images/${
              response.data.image
            }`
          : null
      );
      if (response.status === 200) {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      setError(error.message);
      alert("There was an error updating your profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SideNavbar />
      <div className="ml-64 relative">
        <div className="mt-8 flex flex-col items-center space-y-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-gray-300 shadow-md rounded px-8 pt-6 pb-8 mb-4 "
          >
            <div className="flex flex-col items-center">
              {/* <input className="w-48 h-48 rounded-full object-cover border-4 border-gray-300" /> */}
              {previewImage && (
                <div>
                  <img
                    className="w-48 h-48 rounded-full object-cover border-4 border-gray-300"
                    src={previewImage}
                    alt="Preview Image"
                  />
                </div>
              )}
              {employee && employee.image && !previewImage && (
                <div>
                  <img
                    style={{
                      height: "150px",
                      width: "100%",
                      objectFit: "fill",
                    }}
                    src={`${import.meta.env.VITE_API_URL_PROD_API_URL}/images/${
                      employee.image
                    }`}
                    alt="Previous Image"
                  />
                </div>
              )}
              <input
                className="mt-4 text-lg font-semibold"
                type="file"
                placeholder="Files"
                onChange={handleFileChange}
                accept=".jpeg, .png, .jpg"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profileedit;
