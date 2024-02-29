import React, { useEffect, useState } from "react";
import axios from "axios";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto ">
      <h2 className="text-2xl font-bold mb-4 justifycenter">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-gray-600 shadow-md rounded p-4 flex flex-col justify-between"
          >
            <div>
              <div>{product.photo}</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-200">
                {product.name}
              </h3>
              <p className="text-gray-200  mb-2">{product.description}</p>
            </div>
            <p className="text-gray-200 font-bold">Price: ${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
