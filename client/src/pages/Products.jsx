import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [UserId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
      setUsername(decodedToken.username);
      setEmail(decodedToken.email);
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL_PROD_API_URL}/api/products`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleBuy = async (product) => {
    if (!username) {
      alert("Username is required. Please log in first.");
      navigate("/login");
      return;
    }

    const payload = {
      return_url: "http://localhost:5173/success",
      website_url: "http://localhost:5173",
      amount: parseInt(product.price) * 100,
      purchase_order_id: product._id,
      purchase_order_name: product.name,
      userId: UserId,
      customer_info: {
        name: username,
        email: email,
        phone: "9811496763",
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL_PROD_API_URL}/khalti-api`,
        payload
      );
      if (response?.data?.data?.payment_url) {
        window.location.href = response.data.data.payment_url;
      } else {
        alert("Payment URL is not available.");
      }
    } catch (error) {
      console.error("Error handling buy request:", error);
      alert("There was an error processing your request.");
    }
  };

  return (
    <div className=" bg-gradient-to-br from-blue-300 to-purple-300 min-h-screen p-4">
      <div className="container mx-auto p-4">
        <h2 className="text-4xl font-bold mb-8 text-white text-center">
          Available Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="relative bg-white bg-opacity-30 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.5)",
              }}
            >
              <img
                className="w-full h-48 object-cover rounded-t-lg"
                src={`${
                  import.meta.env.VITE_API_URL_PROD_API_URL
                }/public/images/${product.image}`}
                alt={product.name}
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-800 font-bold">
                    Qty: {product.quantity}
                  </p>
                  <p className="text-gray-800 font-bold">
                    Price: Rs.{product.price}
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
                  onClick={() => handleBuy(product)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
