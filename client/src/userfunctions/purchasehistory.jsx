import { useEffect, useState } from "react";
import axios from "axios";
import SideNavbar from "../components/SideNavbar";
import { jwtDecode } from "jwt-decode"; // Make sure to import correctly

const PurchaseHistory = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      // console.log("Decoded token:", decodedToken);
      setUserId(decodedToken.userId);
    }

    // Fetch the purchase history data specific to the user
    const fetchPurchaseHistory = async (userId) => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL_PROD_API_URL
          }/api/purchasehistory/${userId}`
        );
        setPurchaseHistory(response.data);
        setLoading(false);
      } catch (error) {
        // console.error("Error fetching purchase history:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (userId) {
      fetchPurchaseHistory(userId);
    }
  }, [userId]); // Depend on userId to fetch data only after it's set

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <SideNavbar />
      <div className="ml-64 relative overflow-x-auto">
        <h1 className="bg-gray-600 text-5xl text-red-600 text-center p-2">
          Purchase History
        </h1>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="py-2 px-4 border">User ID</th>
              <th className="py-2 px-4 border">Product ID</th>
              <th className="py-2 px-4 border">TransactionID</th>

              <th className="py-2 px-4 border">Product Name</th>
              <th className="py-2 px-4 border">Price</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {purchaseHistory.length > 0 ? (
              purchaseHistory.map((purchase, index) => (
                <tr
                  key={index}
                  className="bg-grey-50 border-b dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                >
                  <td className="py-2 px-4 border">{purchase.userId}</td>
                  <td className="py-2 px-4 border">{purchase.productId}</td>
                  <td className="py-2 px-4 border">{purchase.transactionId}</td>

                  <td className="py-2 px-4 border">{purchase.productName}</td>
                  <td className="py-2 px-4 border">{purchase.price} Rs</td>
                  <td className="py-2 px-4 border">{purchase.status}</td>
                  <td className="py-2 px-4 border">{purchase.purchaseDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-2 px-4 text-center">
                  No purchase history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PurchaseHistory;
