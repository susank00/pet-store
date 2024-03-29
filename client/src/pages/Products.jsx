import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
// import { selectUserId } from "../selectors/Selectors";
const Products = () => {
  // const selectedUserId = useSelector((state) => state.reducer.selectedUserId);
  const [products, setProducts] = useState([]);

  const UserId = useSelector((state) => state.reducer.UserId);
  // const userId = useSelector(selectUserId);
  // const userId = useSelector((state) => state.reducer.userId);
  console.log("Selected User ID from Redux store:", UserId);

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
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4"> current user id:{UserId}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-gray-600 shadow-md rounded p-4 flex flex-col justify-between"
          >
            <div>
              <div>
                <img
                  style={{
                    height: "150px",
                    width: "100%",
                    objectFit: "fill",
                  }}
                  src={`http://localhost:3001/images/${product.image}`}
                  alt=""
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-200">
                {product.name}
              </h3>
              <p className="text-gray-200 mb-2">{product.description}</p>
            </div>
            <p className="text-gray-200 font-bold">Price: ${product.price}</p>
            <button
              type="button"
              className="text-white w-50 ml-16 mt-1 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={() => handleBuy(product)}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
// import { useSelector } from "react-redux";
// // import { selectUserId } from "../selectors/Selectors";
// const Products = () => {
//   const UserId = useSelector((state) => state.reducer.UserId);
//   // const userId = useSelector(selectUserId);
//   // const userId = useSelector((state) => state.reducer.userId);
//   console.log("Selected User ID from Redux store:", UserId);

//   return <div>User ID: {UserId}</div>;
// };

// export default Products;
