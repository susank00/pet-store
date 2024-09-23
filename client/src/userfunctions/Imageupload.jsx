// client/src/components/ImageUpload.js
import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebaseConfig"; // Import Firebase storage

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onUpload = async () => {
    if (file) {
      const storageRef = ref(storage, `images/${file.name}`); // Create a reference to the storage location
      try {
        // Upload file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, file);
        // Get the file's download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        setImageUrl(downloadURL);
        alert("File uploaded successfully!");
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  return (
    <div>
      <h2>Upload Image to Firebase</h2>
      <input type="file" onChange={onFileChange} />
      <button onClick={onUpload}>Upload</button>

      {imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded" width="300px" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
