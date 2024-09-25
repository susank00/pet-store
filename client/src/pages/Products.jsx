import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebaseConfig"; // Import Firebase storage

const Products = () => {
  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [UserId, setUserId] = useState(null);
  const [productImages, setProductImages] = useState({}); // Store images by product ID

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

        // Fetch images for each product
        response.data.forEach(async (product) => {
          if (product.image) {
            const imageRef = ref(storage, `productimages/${product.image}`);
            try {
              const downloadURL = await getDownloadURL(imageRef);
              setProductImages((prev) => ({
                ...prev,
                [product._id]: downloadURL,
              })); // Store image URL by product ID
            } catch (err) {
              console.error(
                `Error fetching image for product ${product._id}:`,
                err
              );
            }
          }
        });
      } catch (error) {
        console.error("Error fetching products:", error);
        // Optionally navigate to login on error
        // navigate("/login");
      }
    };

    fetchProducts();
  }, [UserId, navigate]);

  const handleBuy = async (product) => {
    if (!username) {
      alert("Username is required. Please log in first.");
      navigate("/login");
      return;
    }

    const payload = {
      return_url: "https://pet-store-eight.vercel.app/success",
      website_url: "https://pet-store-eight.vercel.app",
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
    // <div className="bg-black min-h-screen p-8">
    <div className="bg-gradient-to-br from-blue-300 to-purple-300 min-h-screen p-4">
      <div className="container mx-auto">
        <h2 className="text-5xl font-bold mb-8 text-white text-center tracking-widest font-orbitron">
          Available Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map((product) => (
            <div
              key={product._id}
              className="relative group bg-gradient-to-br from-pink-500 to-indigo-500 p-6 rounded-xl shadow-2xl overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-neon"
              style={{
                border: "2px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50 transition-opacity duration-500 group-hover:opacity-30"></div>
              <img
                className="w-full h-64 object-cover rounded-xl transform group-hover:scale-110 transition-transform duration-500"
                src={
                  productImages[product._id] ||
                  "https://via.placeholder.com/150"
                }
                alt={product.name}
              />
              <div className="relative p-6 z-10">
                <h3 className="text-3xl font-bold text-white mb-4 font-orbitron">
                  {product.name}
                </h3>
                <p className="text-gray-200 text-sm mb-6">
                  {product.description}
                </p>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-white text-xl font-semibold">
                    Qty: {product.quantity}
                  </p>
                  <p className="text-white text-xl font-semibold">
                    Price: Rs. {product.price}
                  </p>
                </div>
                <button
                  type="button"
                  className="w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-neon hover:shadow-pink-600/50"
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
