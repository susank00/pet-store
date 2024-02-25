// AddProductForm.js

import React, { useState } from "react";
import axios from "axios";

const AddProductForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/api/products", {
        name,
        description,
        price,
      });
      console.log("Product added:", response.data.product);
      // Clear form fields after successful submission
      setName("");
      setDescription("");
      setPrice("");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProductForm;
