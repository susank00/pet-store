import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../firebaseConfig"; // Import Firebase storage
import SideNavbar from "../components/SideNavbar";

const Profileedit = () => {
  const [username, setUsername] = useState("");
  const [oldImageName, setOldImageName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [employee, setEmployee] = useState(null);
  const UserId = useSelector((state) => state.reducer.UserId);
  const navigate = useNavigate();
  const getFileExtension = (filename) => {
    return filename.split(".").pop();
  };

  // Handle file change and upload image to Firebase
  // const handleFileChange = async (e) => {
  //   const selectedFile = e.target.files[0];
  //   if (selectedFile) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setPreviewImage(reader.result); // Show local preview
  //     };
  //     reader.readAsDataURL(selectedFile);
  //     setFile(selectedFile);
  //     const timestamp = Date.now();
  //     const fileExtension = getFileExtension(selectedFile.name); // Extract file extension
  //     const newFileName = `file_${timestamp}.${fileExtension}`; // Create new file name
  //     // Upload the image to Firebase Storage
  //     try {
  //       const imageRef = ref(storage, `profileImages/${UserId}/${newFileName}`);
  //       await uploadBytes(imageRef, selectedFile);
  //       const downloadURL = await getDownloadURL(imageRef);
  //       console.log("Uploaded Image URL: ", downloadURL);
  //       setPreviewImage(downloadURL); // Use the Firebase URL for the preview
  //     } catch (error) {
  //       console.error("Error uploading the image:", error);
  //     }
  //   } else {
  //     setPreviewImage(null);
  //   }
  // };
  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Show local preview
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile); // Set the selected file for later upload
    } else {
      setPreviewImage(null);
    }
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL_PROD_API_URL}/employeeNames/${UserId}`
        );
        setEmployee(response.data);
        setUsername(response.data.name);
        setEmail(response.data.email);
        setPassword(response.data.password);

        // Store the old image name for later deletion
        if (response.data.image) {
          setOldImageName(response.data.image);
          const imageRef = ref(
            storage,
            `profileImages/${UserId}/${response.data.image}`
          );
          const downloadURL = await getDownloadURL(imageRef);
          setPreviewImage(downloadURL); // Set the fetched image URL
        } else {
          setPreviewImage(null);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // navigate("/login");
      }
    };
    if (UserId) {
      fetchProfile();
    } else {
      alert("User ID is missing.");
      navigate("/login");
    }
  }, [UserId, navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", username);
    formData.append("email", email);
    formData.append("password", password);

    // Variable to track if the image upload was successful
    let newImageUploaded = false;

    // Upload to Firebase and delete the old image if needed
    if (file) {
      const timestamp = Date.now();
      const fileExtension = getFileExtension(file.name);
      const newFileName = `file_${timestamp}.${fileExtension}`;

      try {
        // Upload the new image
        const imageRef = ref(storage, `profileImages/${UserId}/${newFileName}`);
        await uploadBytes(imageRef, file);
        const downloadURL = await getDownloadURL(imageRef);
        console.log("Uploaded Image URL: ", downloadURL);

        // Append the generated file name for backend
        formData.append("image", newFileName);
        newImageUploaded = true; // Mark that the new image was uploaded
      } catch (error) {
        console.error("Error uploading the image:", error);
        alert("Failed to upload image.");
        setIsLoading(false);
        return; // Stop execution on error
      }
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL_PROD_API_URL}/employeeNames/${UserId}`,
        formData
      );
      setEmployee(response.data);
      setFile(null);

      if (response.status === 200) {
        alert("Profile updated successfully!");

        // Delete the old image if a new image was uploaded
        if (newImageUploaded && oldImageName) {
          const oldImageRef = ref(
            storage,
            `profileImages/${UserId}/${oldImageName}`
          );
          await deleteObject(oldImageRef);
          console.log("Old image deleted successfully.");
        }
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
              {previewImage && (
                <div>
                  <img
                    className="w-48 h-48 rounded-full object-cover border-4 border-gray-300"
                    src={previewImage} // Show preview or stored image
                    alt="Profile Preview"
                  />
                </div>
              )}
              <input
                className="mt-4 text-lg font-semibold"
                type="file"
                placeholder="Upload"
                onChange={handleFileChange}
                accept=".jpeg, .png, .jpg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                type="password"
                // value="enter new password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
