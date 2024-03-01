// import { useSelector } from "react-redux";
// const Adminproductupdate = () => {
//   //   const selectedProductId = useSelector((state) => state.selectedProductId);
//   //   console.log("Selected Product ID:", selectedProductId);
//   const selectedProductId = useSelector(
//     (state) => state.reducer.selectedProductId
//   );
//   console.log("Selected Product ID:", selectedProductId);
//   return (
//     <>
//       <h1>Selected Product ID: {selectedProductId}</h1>
//     </>
//   );
// };
// export default Adminproductupdate;
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Adminproductupdate = () => {
  const selectedProductId = useSelector(
    (state) => state.reducer.selectedProductId
  );
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3001/api/products/${selectedProductId}`
        );
        setProduct(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedProductId) {
      fetchProduct();
    }
  }, [selectedProductId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!product) {
    return <p>No product found with the selected ID</p>;
  }

  return (
    <>
      <h1>Selected Product ID: {selectedProductId}</h1>
      <div>
        <h1>Product Details</h1>
        <p>Name: {product.name}</p>
        <p>Description: {product.description}</p>
        <p>Price: ${product.price}</p>
        <p>Category: {product.category}</p>
        {/* Add other fields as needed */}
      </div>
    </>
  );
};

export default Adminproductupdate;
