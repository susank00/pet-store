import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const SuccessPage = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [UserId, setUserId] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const location = useLocation();

  // Helper function to parse URL query parameters
  const getQueryParams = () => {
    const query = new URLSearchParams(location.search);
    return {
      pidx: query.get("pidx"),
      transaction_id: query.get("transaction_id"),
      amount: query.get("amount"),
      status: query.get("status"),
      mobile: query.get("mobile"),
      purchase_order_id: query.get("purchase_order_id"),
      purchase_order_name: query.get("purchase_order_name"),
    };
  };

  // Fetch User ID from token
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    }
  }, []);

  // Fetch product details
  useEffect(() => {
    const getproductdetails = async () => {
      const { purchase_order_id } = getQueryParams(); // Get purchase_order_id from URL query
      if (purchase_order_id) {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_URL_PROD_API_URL
            }/api/products/${purchase_order_id}`
          );
          setProducts(response.data);
          setQuantity(response.data.quantity);
          console.log("Product details:", response.data.quantity); // Log product details to console
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      } else {
        console.log("No purchase_order_id found in URL parameters.");
      }
    };

    getproductdetails();
  }, [location.search]);

  // Verify payment and update quantity
  useEffect(() => {
    const paymentDetails = getQueryParams();

    const verifyPayment = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL_PROD_API_URL}/api/verify-payment`,
          { pidx: paymentDetails.pidx }
        );

        if (response.data.status === "Completed") {
          const purchaseTimestamp = Date.now(); // Get current timestamp

          const productData = {
            userId: UserId,
            productId: paymentDetails.purchase_order_id,
            productName: paymentDetails.purchase_order_name,
            status: paymentDetails.status,
            price: paymentDetails.amount / 100, // Assuming amount is in paisa
            category: "General",
            purchaseDate: new Date().toLocaleString(), // Store timestamp
            transactionId: paymentDetails.transaction_id,
          };

          await axios.post(
            `${import.meta.env.VITE_API_URL_PROD_API_URL}/api/purchasehistory`,
            productData
          );

          // Update product quantity
          await axios.patch(
            `${import.meta.env.VITE_API_URL_PROD_API_URL}/api/products/${
              paymentDetails.purchase_order_id
            }`
          );

          // Update purchase history with timestamp
          setPurchaseHistory((prevHistory) => [
            ...prevHistory,
            {
              pidx: paymentDetails.pidx,
              transactionId: paymentDetails.transaction_id,
              amount: parseInt(paymentDetails.amount) / 100,
              mobile: paymentDetails.mobile,
              productid: paymentDetails.purchase_order_id,
              date: purchaseTimestamp, // Store timestamp
            },
          ]);
        } else {
          console.error(
            "Payment status is not completed:",
            response.data.status
          );
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
      }
    };

    // Only verify payment if UserId is set and payment status is completed
    if (UserId && paymentDetails.status === "Completed") {
      verifyPayment();
    }
  }, [UserId, location.search]); // Ensure this effect runs when UserId or URL changes

  return (
    <div className="container mx-auto mt-8">
      <div className="flex flex-col items-center">
        <img
          className="rounded-full object-cover border-gray-100"
          style={{
            height: "480px",
            width: "480px",
            objectFit: "fill",
          }}
          src="/images/paymentsuccess.gif" // Path to your success GIF
          alt="Payment Success"
        />
      </div>

      <h1 className="text-center text-3xl font-bold mt-6">Payment Success</h1>

      <div className="mt-8">
        <h2 className="text-center text-xl font-semibold">
          Your Purchase History
        </h2>
        <ul className="list-disc list-inside mt-4">
          {purchaseHistory.length > 0 ? (
            purchaseHistory.map((purchase, index) => (
              <li key={index} className="text-lg">
                Transaction ID: {purchase.transactionId}, pidx: {purchase.pidx},
                Amount: {parseInt(purchase.amount) / 10} Rs, Mobile:{" "}
                {purchase.mobile}, product_id: {purchase.productid}, Date:{" "}
                {new Date(purchase.date).toLocaleString()}{" "}
                {/* Convert timestamp to readable date */}
              </li>
            ))
          ) : (
            <p className="text-center text-lg">
              No purchase history available.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SuccessPage;
