import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaUser, FaShoppingCart, FaEdit, FaMobileAlt } from "react-icons/fa";

const Howto = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // Slow down autoplay speed to 5 seconds
    pauseOnHover: true, // Pause the slider when hovered
  };

  const instructions = [
    {
      icon: <FaUser className="text-4xl text-blue-600 mx-auto" />,
      title: "Login",
      description: "Use the credentials below to log in.",
      details: "Username: hero@gmail.com | Password: 123",
    },
    {
      icon: <FaShoppingCart className="text-4xl text-blue-600 mx-auto" />,
      title: "Buy a Product",
      description:
        "Navigate to the products page, choose a product, and click 'Buy'.",
      details: "You will be redirected to the Khalti payment page.",
    },
    {
      icon: <FaMobileAlt className="text-4xl text-blue-600 mx-auto" />,
      title: "Khalti Payment",
      description: "Use these details to complete the payment.",
      details: "Username: 9800000001 | Password: 1111 | OTP: 987654",
    },
    {
      icon: <FaEdit className="text-4xl text-blue-600 mx-auto" />,
      title: "Edit Profile",
      description: "Go to your profile page to update your personal details.",
      details: "Ensure your contact information is up to date.",
    },
  ];

  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-300 to-purple-300 min-h-screen justify-center items-center p-6">
      <div className="w-full max-w-4xl">
        <h1 className="text-5xl font-bold text-center text-white mb-8">
          How to Operate This App
        </h1>
        <Slider {...settings}>
          {instructions.map((instruction, index) => (
            <div key={index} className="p-4">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="mb-4">{instruction.icon}</div>
                <h2 className="text-xl font-semibold mb-2">
                  {instruction.title}
                </h2>
                <p className="text-gray-600 mb-4">{instruction.description}</p>
                <p className="text-gray-800">{instruction.details}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Howto;
