import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../firebaseConfig";
const Adminproductupdate = () => {
  const getFileExtension = (filename) => {
    return filename.split(".").pop();
  };
  const [showForm, setShowForm] = useState(true);
  const handleClose = () => {
    setName("");
    setCategory("");
    setPrice("");
    setDescription("");
    setFile(null);
    setQuantity("");
    setShowForm(false);
  };

  // const [file, setFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [productImage, setProductImage] = useState(null); // Assuming productImage is the state that holds the URL of the current image

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
      console.error("not found file");
      setPreviewImage(null);
    }
  };

  const selectedProductId = useSelector(
    (state) => state.reducer.selectedProductId
  );
  const [oldImageName, setOldImageName] = useState("");
  const [product, setProduct] = useState(null);
  const [file, setFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [value, setValue] = useState("Default Name");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");

  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  // const handleChange = (event) => {
  //   setValue(event.target.value);
  // };

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL_PROD_API_URL
          }/api/products/${selectedProductId}`
        );
        setProduct(response.data);
        setName(response.data.name);
        setCategory(response.data.category);
        setPrice(response.data.price);
        setDescription(response.data.description);
        setFile(response.data.file);
        setProduct(response.data);
        setQuantity(response.data.quantity);
        setOldImageName(response.data);
        // setImage(response.data.image);

        if (response.data.image) {
          setOldImageName(response.data.image);
          const imageRef = ref(storage, `productimages/${response.data.image}`);
          const downloadURL = await getDownloadURL(imageRef);
          setPreviewImage(downloadURL); // Set the fetched image URL
        } else {
          console.error("some error ");
          setPreviewImage(null);
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (selectedProductId) {
      fetchProduct();
    }
  }, [selectedProductId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start the loading state

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("quantity", quantity);

    let newImageUploaded = false;
    let newFileName = null; // Declare to store the new image filename

    if (file) {
      const timestamp = Date.now();
      const fileExtension = getFileExtension(file.name);
      newFileName = `file_${timestamp}.${fileExtension}`;

      try {
        // Upload the new image to Firebase
        const imageRef = ref(storage, `productimages/${newFileName}`);
        await uploadBytes(imageRef, file);
        const downloadURL = await getDownloadURL(imageRef);
        console.log("Uploaded Image URL: ", downloadURL);

        // Append the generated image filename to the formData
        formData.append("image", newFileName);
        newImageUploaded = true; // Mark that the new image was uploaded
      } catch (error) {
        console.error("Error uploading the image:", error);
        alert("Failed to upload image.");
        setIsLoading(false);
        return; // Stop execution if image upload fails
      }
    }

    try {
      // Update the product in MongoDB, including the new image filename (if any)
      // formData.append("image", newFileName || oldImageName); // Use newFileName if it exists, otherwise keep the old image

      const response = await axios.put(
        `${
          import.meta.env.VITE_API_URL_PROD_API_URL
        }/api/products/${selectedProductId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the UI after success
      setProduct(response.data);
      setFile(null);
      setProductImage(previewImage);
      alert("Product updated successfully");

      if (response.status === 200) {
        alert("Profile updated successfully!");

        // If a new image was uploaded, delete the old one from Firebase
        if (newImageUploaded && oldImageName) {
          const oldImageRef = ref(storage, `productimages/${oldImageName}`);
          await deleteObject(oldImageRef);
          console.log("Old image deleted successfully.");
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false); // End the loading state
    }
  };
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_API_URL_PROD_API_URL
        }/api/products/${selectedProductId}`
      );

      if (response.status === 200) {
        alert("Product deleted successfully");

        if (oldImageName) {
          const oldImageRef = ref(storage, `productimages/${oldImageName}`);
          await deleteObject(oldImageRef);
        }

        handleClose();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!product) {
    return <p>No product found with the selected ID</p>;
  }

  return (
    <>
      <div className="flex justify-center  ">
        {showForm && (
          <form
            className="absolute w-6/12 ml-52 rounded-lg p-4 mt-8 bg-gray-800 z-10"
            onSubmit={handleSubmit}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                handleClose();
                window.location.reload();
              }}
              className="absolute top-1 right-1 text-white bg-red-600 p-1 rounded-full"
            >
              CLose
            </button>
            <h2 className="flex justify-center text-gray-200 p-1 text-2xl">
              Update product
            </h2>
            <div className="mb-3 ">
              <label className="block  text-sm font-medium text-gray-900 dark:text-gray-200">
                Product id : {selectedProductId}
              </label>
            </div>
            <div className="grid grid-cols-2  gap-2">
              <div className="mb-3 ">
                <label className="block  text-sm font-medium text-gray-900 dark:text-gray-200">
                  Product Name
                </label>

                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="text"
                  placeholder={product.name}
                  value={name}
                  //   onChange={(e) => handleChange(e)}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3 ">
                <label className="block  text-sm font-medium text-gray-900 dark:text-gray-200">
                  Product category
                </label>

                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  type="text"
                  placeholder="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>
            <label className="block  text-sm font-medium text-gray-900 dark:text-gray-200">
              Price
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <label className="block  text-sm font-medium text-gray-900 dark:text-gray-200">
              Quantity
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Product Description
            </label>
            <textarea
              id="message"
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write your thoughts here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <label className="block  text-sm font-medium text-gray-900 dark:text-gray-200">
              Upload photo
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              type="file"
              placeholder="Files"
              // onChange={(e) => setFile(e.target.files[0])}
              onChange={handleFileChange}
              accept=".jpeg, .png, .jpg"
            />

            {product.image && (
              <div>
                <img
                  style={{
                    height: "150px",
                    width: "100%",
                    objectFit: "fill",
                  }}
                  // src={`${
                  //   import.meta.env.VITE_API_URL_PROD_API_URL
                  // }/public/images/${product.image}`}
                  src={previewImage}
                  alt="Previous Image"
                />
              </div>
            )}
            {/* 
            {previewImage && (
              <div>
                <img
                  style={{
                    height: "150px",
                    width: "100%",
                    objectFit: "fill",
                  }}
                  src={previewImage}
                  alt="Preview Image"
                />
              </div>
            )} */}
            {/* <div>
          <img
            style={{
              height: "150px",
              width: "100%",
              objectFit: "fill",
            }}
            src={`${import.meta.env.VITE_API_URL_PROD_API_URL}/images/${product.image}`}
            alt=""
          />
        </div> */}
            {/* {file && <p>Filename: {file}</p>} */}
            <button
              onClick={handleSubmit}
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-2 ml-16"
            >
              Update Product
            </button>
            <button
              onClick={handleDelete}
              className="text-white bg-gradient-to-r from-red-500 via-red-900 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-2 ml-16"
            >
              Delete Product
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default Adminproductupdate;
