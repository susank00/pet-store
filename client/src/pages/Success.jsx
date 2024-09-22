import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const SuccessPage = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const location = useLocation();
  const [UserId, setUserId] = useState(null);

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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("Decoded token:", decodedToken);
      setUserId(decodedToken.userId);
      console.log("User Id:", decodedToken.userId);
      console.log("thew userid is", decodedToken.userId);
    }
    const paymentDetails = getQueryParams();

    const verifyPayment = async (pidx) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL_PROD_API_URL}/api/verify-payment`,
          { pidx: paymentDetails.pidx }
        );
        console.log(response.data.status);
        // Check the payment status
        if (response.data.status === "Completed") {
          // Prepare the product data for posting
          const productData = {
            userId: UserId, // You can adjust this based on your requirements
            productId: paymentDetails.purchase_order_id,
            productName: paymentDetails.purchase_order_name,
            price: paymentDetails.amount / 100, // Assuming amount is in paisa
            category: "General", // Adjust category as needed
          };

          // Post the purchase details to the API
          const productResponse = await axios.post(
            `${import.meta.env.VITE_API_URL_PROD_API_URL}/api/purchasehistory`,
            productData
          );
          console.log("Product successfully added:", productResponse.data);

          // Update the purchase history with the new transaction
          setPurchaseHistory((prevHistory) => [
            ...prevHistory,
            {
              pidx: paymentDetails.pidx,
              transactionId: paymentDetails.transaction_id,
              amount: parseInt(paymentDetails.amount) / 100,
              mobile: paymentDetails.mobile,
              productid: paymentDetails.purchase_order_id,
              date: new Date(),
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

    // Check the payment status
    if (paymentDetails.status === "Completed") {
      verifyPayment(paymentDetails.pidx);
    }
  }, [location.search, UserId]); // Ensure this effect runs when the URL changes

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
                Amount: {parseInt(purchase.amount) / 100} Rs, Mobile:{" "}
                {purchase.mobile}, product_id: {purchase.productid}, Date:{" "}
                {purchase.date.toString()}
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
