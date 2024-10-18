import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebaseConfig"; // Import Firebase storage

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filter, setFilter] = useState("available");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [UserId, setUserId] = useState(null);
  const [productImages, setProductImages] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const productsPerPage = 10; // Number of products per page

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
        filterProducts(response.data, filter); // Apply filter when products are fetched

        response.data.forEach(async (product) => {
          if (product.image) {
            const imageRef = ref(storage, `productimages/${product.image}`);
            try {
              const downloadURL = await getDownloadURL(imageRef);
              setProductImages((prev) => ({
                ...prev,
                [product._id]: downloadURL,
              }));
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
      }
    };

    fetchProducts();
  }, [UserId, filter]);

  const filterProducts = (products, filter) => {
    if (filter === "available") {
      setFilteredProducts(products.filter((product) => product.quantity > 0));
    } else if (filter === "out-of-stock") {
      setFilteredProducts(
        products.filter(
          (product) => product.quantity === 0 || product.quantity === null
        )
      );
    } else {
      setFilteredProducts(products); // Show all products
    }
    setCurrentPage(1); // Reset to page 1 whenever filter changes
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    filterProducts(products, event.target.value);
  };

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

  // Get the current products to display based on the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Handle "Next" and "Previous" button clicks
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-300 to-purple-300 min-h-screen p-4">
      <div className="container mx-auto">
        <h2 className="text-5xl font-bold mb-8 text-white text-center tracking-widest font-orbitron">
          Available Products
        </h2>

        {/* Dropdown for selecting product availability filter */}
        <div className="mb-6">
          <label htmlFor="filter" className="text-lg font-semibold text-white">
            Filter products:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={handleFilterChange}
            className="ml-4 p-3 rounded-lg bg-white text-black w-48"
          >
            <option value="all">All Products</option>
            <option value="available">Available Products</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        {/* Display current page of products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {currentProducts.map((product) => (
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
                  className={`w-full py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-neon ${
                    product.quantity > 0
                      ? "hover:from-purple-600 hover:to-indigo-600"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  onClick={() => handleBuy(product)}
                  disabled={product.quantity <= 0 || product.quantity === null}
                >
                  {product.quantity > 0 ? "Buy Now" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination buttons */}
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            className={`py-2 px-4 rounded-lg bg-white text-black ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-white text-lg">
            Page {currentPage} of{" "}
            {Math.ceil(filteredProducts.length / productsPerPage)}
          </span>
          <button
            className={`py-2 px-4 rounded-lg bg-white text-black ${
              currentPage ===
              Math.ceil(filteredProducts.length / productsPerPage)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={nextPage}
            disabled={
              currentPage ===
              Math.ceil(filteredProducts.length / productsPerPage)
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
