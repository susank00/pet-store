const Success = () => {
  return (
    <div className="container mx-auto mt-8">
      <div className="flex flex-col items-center">
        <img
          className=" rounded-full object-cover  border-gray-100"
          style={{
            height: "480px",
            width: "480px",
            objectFit: "fill",
          }}
          src="../public/images/paymentsuccess.gif"
          alt="success"
          // className="mx-auto h-56 w-56"
        />
      </div>
    </div>
  );
};

export default Success;
