// AddProductForm.js

import { useState } from "react";
import axios from "axios";

const AddProductForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState("");

  // const handleUpload = (e) => {
  //   console.log(file);
  // };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);

    axios
      .post("http://localhost:3001/api/products", formData)
      .then((res) => {
        console.log("Product added:", res.data.product);
        // console.log(setImage(res.data[0].image));
        // Clear form fields after successful submission
        setName("");
        setDescription("");
        setPrice("");
        setFile(null); // Clear the file state
      })
      .catch((err) => console.error("Error adding product:", err));
  };
  return (
    <form
      className="max-w-sm mx-auto border border-4 p-2 mt-8 bg-gray-800"
      onSubmit={handleSubmit}
    >
      <h2 className="flex justify-center text-gray-200 p-1 text-2xl">
        Add product
      </h2>
      <div className="grid grid-cols-2  gap-2">
        <div className="mb-3 ">
          <label className="block  text-sm font-medium text-gray-900 dark:text-gray-200">
            Product Name
          </label>

          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {/* <div className="mb-3 ">
          <label className="block  text-sm font-medium text-gray-900 dark:text-gray-200">
            Product category
          </label>

          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            placeholder="category"
            // value={name}
            // onChange={(e) => setName(e.target.value)}
          />
        </div> */}
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
        onChange={(e) => setFile(e.target.files[0])}
        accept=".jpeg, .png ,jpg "
      />
      <button
        onClick={handleSubmit}
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 mt-2 ml-16"
      >
        Add Product
      </button>
    </form>
  );
};

export default AddProductForm;
