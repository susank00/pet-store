import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
// import { selectUserId } from "../selectors/Selectors";
const Products = () => {
  // const selectedUserId = useSelector((state) => state.reducer.selectedUserId);
  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState([]);
  const [email, setEmail] = useState([]);
  const navigate = useNavigate();
  const [UserId, setUserId] = useState(null);
  // const UserId = useSelector((state) => state.reducer.UserId);

  // const userId = useSelector(selectUserId);
  // const userId = useSelector((state) => state.reducer.userId);
  console.log("Selected User ID from Redux store:", UserId);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("Decoded token:", decodedToken);
      setUserId(decodedToken.userId);
      setUsername(decodedToken.username);
      setEmail(decodedToken.email); // Assuming userId is in the token
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
    // const fetchUsername = async () => {
    //   try {
    //     const response = await axios.get(
    //       `${import.meta.env.VITE_API_URL_PROD_API_URL}/profile/${UserId}`
    //     );
    //     setUsername(response.data.user.name);
    //     setEmail(response.data.user.email);
    //     console.log("the response from profile", response.data.user.name);
    //   } catch (error) {
    //     console.error("Error fetching username:", error);
    //   }
    // };
    // fetchUsername();
    fetchProducts();
  }, []);
  const handleBuy = async (product) => {
    // Validate product fields

    // Validate username
    if (typeof username !== "string" || username.trim() === "") {
      alert("Username is required. Please fetch the username first.");
      navigate("/login");
      return;
    }

    console.log("Username:", username);

    const payload = {
      return_url: "http://localhost:5173/success",
      // return_url: `http://localhost:5173/success?userId=${UserId}&productId=${
      //   product._id
      // }&productName=${product.name}&amount=${parseInt(product.price) * 100}`,
      website_url: "http://localhost:5173",
      featureFlag: process.env.REACT_APP_FEATURE_FLAG,
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
      console.log(response);
      if (response?.data?.data?.payment_url) {
        window.location.href = `${response.data.data.payment_url}`;
      } else {
        alert("Payment URL is not available.");
      }
    } catch (error) {
      console.error("Error handling buy request:", error);
      alert("There was an error processing your request.");
    }
  };
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
                  src={`${
                    import.meta.env.VITE_API_URL_PROD_API_URL
                  }/public/images/${product.image}`}
                  alt=""
                />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-200">
                {product.name}
              </h3>
              <p className="text-gray-200 mb-2">{product.description}</p>
            </div>
            <p className="text-gray-200 font-bold">
              Quanity left: {product.quantity}
            </p>

            <p className="text-gray-200 font-bold">Price: Rs.{product.price}</p>
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
