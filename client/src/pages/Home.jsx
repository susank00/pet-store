import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from "react";

const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  const playSound = (soundFile) => {
    const sound = new Audio(soundFile);
    sound.play();
  };

  // Example function to log the IP address
  const logIpAddress = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL_PROD_API_URL}/log-ip`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.text(); // or response.json() based on your needs
      console.log(data); // Log the response from the server
    } catch (error) {
      console.error("Error logging IP address:", error);
    }
  };

  // Call the function when the component mounts
  useEffect(() => {
    logIpAddress();
  }, []); // Empty dependency array ensures it runs once when the component mounts

  return (
    <div className="flex flex-col bg-gradient-to-b from-blue-200 to-blue-500 flex-grow">
      <div className="grid grid-cols-2 gap-4 p-6 bg-transparent">
        <div className="p-4 mt-8">
          <h1 className="text-4xl p-2 ml-8 mt-16 font-bold text-white drop-shadow-lg">
            The Best Place to Buy Top Quality Products for Pets
          </h1>
        </div>
        <div className="mt-5 ml-16">
          <img
            src="./images/dog.png"
            alt="Dog"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
      <h2 className="text-center text-4xl mb-6 text-white">Our Blogs</h2>
      <Slider {...settings} className="overflow-hidden">
        {/* Dog Blog */}
        <div className="bg-transparent flex flex-col w-full max-w-xs mx-auto">
          <img
            className="rounded-lg transition-transform transform hover:scale-105"
            src="./images/dogg.png"
            alt="Dog Blog"
            style={{ height: "350px", objectFit: "cover" }}
            onClick={() => playSound("./sound/dogwav.wav")}
          />
          <a
            href=""
            className="mt-2 text-center inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            Dog Blog
            <svg
              className="ml-2 w-3.5 h-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>

        {/* Cat Blog */}
        <div className="bg-transparent flex flex-col w-full max-w-xs mx-auto">
          <img
            className="rounded-lg transition-transform transform hover:scale-105"
            src="./images/cat.png"
            alt="Cat Blog"
            style={{ height: "350px", objectFit: "cover" }}
            onClick={() => playSound("./sound/cat.wav")}
          />
          <a
            href=""
            className="mt-2 text-center inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            Cat Blog
            <svg
              className="ml-2 w-3.5 h-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>

        {/* Guineapig Blog */}
        <div className="bg-transparent flex flex-col w-full max-w-xs mx-auto">
          <img
            className="rounded-lg transition-transform transform hover:scale-105"
            src="./images/guineapig.png"
            alt="Guineapig Blog"
            style={{ height: "350px", objectFit: "cover" }}
            onClick={() => playSound("./sound/guineapig.mp3")}
          />
          <a
            href=""
            className="mt-2 text-center inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            Guineapig Blog
            <svg
              className="ml-2 w-3.5 h-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>

        {/* Parrot Blog */}
        <div className="bg-transparent flex flex-col w-full max-w-xs mx-auto">
          <img
            className="rounded-lg transition-transform transform hover:scale-105"
            src="./images/parrot.png"
            alt="Parrot Blog"
            style={{ height: "350px", objectFit: "cover" }}
            onClick={() => playSound("./sound/parrot.mp3")}
          />
          <a
            href=""
            className="mt-2 text-center inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            Parrot Blog
            <svg
              className="ml-2 w-3.5 h-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>

        {/* Fish Blog */}
        <div className="bg-transparent flex flex-col w-full max-w-xs mx-auto">
          <img
            className="rounded-lg transition-transform transform hover:scale-105"
            src="./images/fish.png"
            alt="Fish Blog"
            style={{ height: "350px", objectFit: "cover" }}
            onClick={() => playSound("./sound/fish.mp3")}
          />
          <a
            href=""
            className="mt-2 text-center inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            Fish Blog
            <svg
              className="ml-2 w-3.5 h-3.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
      </Slider>
    </div>
  );
};

export default Home;
