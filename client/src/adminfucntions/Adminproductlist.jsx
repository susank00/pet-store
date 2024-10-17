import { useEffect, useState } from "react";
import SideNavbar from "../components/SideNavbar";
import axios from "axios";
import AddProductForm from "../pages/AddProductForm";
import { useDispatch } from "react-redux";
import { setSelectedProductId } from "../redux/actions";
// import { useNavigate } from "react-router-dom";
import Adminproductupdate from "./Adminproductupdate";
import { useNavigate } from "react-router-dom";

const Adminproductlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  // const navigate = useNavigate();
  const [showAdminproductupdate, setShowAdminproductupdate] = useState(false);
  const getAccessToken = localStorage.getItem("accessToken");
  const handleAddProductClick = () => {
    setShowAddProductForm(true);
  };

  const handleEditClick = (productId) => {
    console.log("Product ID:", productId);
    dispatch(setSelectedProductId(productId));
    // navigate("/adminproductupdate");
    setShowAdminproductupdate(true);
    console.log(
      "Dispatched action:",
      dispatch(setSelectedProductId(productId))
    );
  };
  useEffect(() => {
    if (!getAccessToken) {
      navigate("/login"); // Redirect to login if token is not found
      return;
    }
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL_PROD_API_URL}/api/products`,
          {
            headers: {
              Authorization: `Bearer ${getAccessToken}`,
            },
            timeout: 10000,
          }
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchProducts();
  }, [getAccessToken, navigate]);

  return (
    <>
      <div className="flex-grow  relative w-full min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white  ">
        <SideNavbar />
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
          {showAdminproductupdate && <Adminproductupdate />}
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Product Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Product id
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
                  quanity
                </th>
                <th scope="col" className="px-6 py-3">
                  modify
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {product.name}
                  </th>
                  <td className="px-6 py-4">{product._id}</td>

                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{product.description}</td>
                  <td className="px-6 py-4">Rs.{product.price}</td>
                  <td className="px-6 py-4">{product.quantity}</td>

                  <td className="px-6 py-4 ">
                    <button
                      onClick={() => handleEditClick(product._id)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Adminproductlist;
