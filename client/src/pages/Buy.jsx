import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MyNavbar from "../components/MyNavbar";

const Buy = () => {
  // Access user session from Redux store
  const userSession = useSelector((state) => state.userReducer.userSession);

  useEffect(() => {
    // Redirect to login page if user session is not available
    if (!userSession) {
      // You can redirect the user to the login page here
    }
  }, [userSession]);

  return (
    <>
      <MyNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">User Buy</h1>
        {userSession && (
          <div>
            <p>
              <strong>Email:</strong> {userSession.email}
              <strong>name:</strong>
              {userSession.name}
            </p>
            {/* Add more profile information here */}
          </div>
        )}
        <div className="mt-4">
          <Link to="/" className="text-blue-700 font-bold dark:text-blue-400">
            Go to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default Buy;
