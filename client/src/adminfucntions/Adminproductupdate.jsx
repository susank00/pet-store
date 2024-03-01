import { useSelector } from "react-redux";
const Adminproductupdate = () => {
  //   const selectedProductId = useSelector((state) => state.selectedProductId);
  //   console.log("Selected Product ID:", selectedProductId);
  const selectedProductId = useSelector(
    (state) => state.reducer.selectedProductId
  );
  console.log("Selected Product ID:", selectedProductId);
  return (
    <>
      <h1>Selected Product ID: {selectedProductId}</h1>
    </>
  );
};
export default Adminproductupdate;
