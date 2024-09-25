import { useEffect, useState } from "react";
import SideNavbar from "../components/SideNavbar";
import axios from "axios";
import AddProductForm from "../pages/AddProductForm";
import { jwtDecode } from "jwt-decode"; // Correct import
import { useNavigate } from "react-router-dom"; // For navigation

const Adminproductlist = () => {
  const [products, setProducts] = useState([]);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [role, setRole] = useState();
  const navigate = useNavigate();

  const handleAddProductClick = () => {
    setShowAddProductForm(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role);
      } catch (error) {
        console.error("Failed to decode token", error);
        navigate("/login"); // Redirect if the token is invalid
      }
    } else {
      navigate("/login"); // Redirect if token is missing
    }
  }, [navigate]);

  useEffect(() => {
    if (role && role !== "admin") {
      navigate("/profile"); // Redirect if role is not admin
    }
  }, [role, navigate]);

  useEffect(() => {
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

  return (
    <>
      <SideNavbar />
      {role === "admin" && (
        <div className="ml-64 relative overflow-x-auto">
          <h1 className="bg-gray-600 text-5xl text-red-600 text-center p-2">
            All Products
          </h1>

          <div className="p-1 flex justify-center bg-gray-600">
            <button
              type="button"
              onClick={handleAddProductClick}
              className=" text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              + Add Product
            </button>
          </div>
          {showAddProductForm && <AddProductForm />}
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Product name
                </th>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Modify
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="bg-red-900 border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {product.name}
                  </th>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{product.description}</td>
                  <td className="px-6 py-4">${product.price}</td>
                  <td className="px-6 py-4">
                    <a
                      href=""
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Adminproductlist;
