// import { useSelector } from "react-redux";
// const Adminproductupdate = () => {
//   //   const selectedProductId = useSelector((state) => state.selectedProductId);
//   //   console.log("Selected Product ID:", selectedProductId);
//   const selectedProductId = useSelector(
//     (state) => state.reducer.selectedProductId
//   );
//   console.log("Selected Product ID:", selectedProductId);
//   return (
//     <>
//       <h1>Selected Product ID: {selectedProductId}</h1>
//     </>
//   );
// };
// export default Adminproductupdate;
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Adminproductupdate = () => {
  const [showForm, setShowForm] = useState(true);
  const handleClose = () => {
    setName("");
    setCategory("");
    setPrice("");
    setDescription("");
    setFile(null);
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
      setPreviewImage(null);
    }
  };

  const selectedProductId = useSelector(
    (state) => state.reducer.selectedProductId
  );
  const [product, setProduct] = useState(null);
  const [file, setFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [value, setValue] = useState("Default Name");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  // const [image, setImage] = useState("");

  // const handleChange = (event) => {
  //   setValue(event.target.value);
  // };

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3001/api/products/${selectedProductId}`
        );
        setProduct(response.data);
        setName(response.data.name);
        setCategory(response.data.category);
        setPrice(response.data.price);
        setDescription(response.data.description);
        setFile(response.data.file);
        setProduct(response.data);
        // setImage(response.data.image);
      } catch (error) {
        setError(error.message);
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
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("file", file);
    try {
      const updatedProduct = {
        name,
        category,
        price,
        description,
        file,
        // image,
      };
      const response = await axios.put(
        `http://localhost:3001/api/products/${selectedProductId}`,
        formData,
        updatedProduct,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProduct(response.data);
      setFile(null);
      setProductImage(previewImage);
      alert("Product updated successfully");
      // Optionally, you can show a success message or navigate to another page
    } catch (error) {
      setError(error.message);
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
              X
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
                  src={`http://localhost:3001/images/${product.image}`}
                  alt="Previous Image"
                />
              </div>
            )}

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
            )}
            {/* <div>
          <img
            style={{
              height: "150px",
              width: "100%",
              objectFit: "fill",
            }}
            src={`http://localhost:3001/images/${product.image}`}
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
          </form>
        )}
      </div>
    </>
  );
};

export default Adminproductupdate;
