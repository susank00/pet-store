import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const Home = () => {
  const settings = {
    dots: false,
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
  return (
    <>
      <div className="flex flex-col   bg-blue-200 flex-grow">
        <div className="grid grid-cols-2 gap-4 p-6  bg-transparent">
          <div className="p-4 mt-8">
            <h1 className="text-4xl p-2 ml-8 mt-16 font-bold">
              The best place to buy top quality products for pets
            </h1>
          </div>
          <div className=" mt-5 ml-16">
            {/* Content for the right column */}
            <img src="./images/dog.png" alt="DOg_pic" />
          </div>
        </div>
        <h2 className="text-center text-4xl mb-6">Our blogs</h2>
        <Slider {...settings} className="overflow-hidden">
          {/* DOg>>>>>>>>>>>>>>>>>>>>>>>>>>>  */}
          <div
            className=" bg-transparent flex flex-col w-1/2   max-w-xs w-full md:w-1/2 flex flex-col justify-center max-w-xs ml-8  
      rounded-lg  "
          >
            <img
              className="rounded-t-lg   "
              src="./images/dogg.png"
              alt=""
              style={{
                objectFit: "cover",
                height: "350px",
                filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))", // Add drop-shadow effect
                transition: "filter 0.3s ease", // Add transition for smooth effect
              }}
              onClick={() => {
                playSound("./sound/dogwav.wav");
                // You can add additional actions here if needed
              }}
              onMouseEnter={(e) => {
                e.target.style.filter =
                  "drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))";
              }} // Apply glow on hover
              onMouseLeave={(e) => {
                e.target.style.filter =
                  "drop-shadow(0 0 0 rgba(255, 255, 255, 0))";
              }} // Remove glow on hover out
            />
            <a
              href=""
              className="ml-16 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Dog Blog
              <svg
                className="rtl:rotate-180 w-3.5 h-3.5 ms-2 "
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

          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>end >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
          {/* cat>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
          <div
            className=" bg-transparent flex flex-col w-1/2   max-w-xs w-full md:w-1/2 flex flex-col justify-center max-w-xs ml-8  
      rounded-lg  "
            style={{ height: "400px" }}
          >
            <img
              className="rounded-t-lg   "
              src="./images/cat.png"
              alt=""
              style={{
                height: "350px",
                padding: "10px",

                objectFit: "cover",
                filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))", // Add drop-shadow effect
                transition: "filter 0.3s ease", // Add transition for smooth effect
              }}
              onClick={() => {
                playSound("./sound/cat.wav");
                // You can add additional actions here if needed
              }}
              onMouseEnter={(e) => {
                e.target.style.filter =
                  "drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))";
              }} // Apply glow on hover
              onMouseLeave={(e) => {
                e.target.style.filter =
                  "drop-shadow(0 0 0 rgba(255, 255, 255, 0))";
              }} // Remove glow on hover out
            />
            <a
              href=""
              className="inline-flex items-center ml-16  px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              //   className="inline-flex items-center inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Cat Blog
              <svg
                className="rtl:rotate-180 w-3.5 h-3.5 ms-2 "
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

          {/* end>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
          <div
            className="  bg-transparent flex flex-col w-1/2   max-w-xs w-full md:w-1/2 flex flex-col justify-center max-w-xs ml-8  
      rounded-lg  "
            style={{ height: "400px" }}
          >
            <div style={{ width: "100%", height: "200px" }}>
              <img
                className="rounded-t-lg   "
                src="./images/guineapig.png"
                alt=""
                style={{
                  height: "350px",
                  objectFit: "cover",
                  filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))", // Add drop-shadow effect
                  transition: "filter 0.3s ease", // Add transition for smooth effect
                }}
                onClick={() => {
                  playSound("./sound/guineapig.mp3");
                  // You can add additional actions here if needed
                }}
                onMouseEnter={(e) =>
                  (e.target.style.filter =
                    "drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))")
                } // Apply glow on hover
                onMouseLeave={(e) => {
                  e.target.style.filter =
                    "drop-shadow(0 0 0 rgba(255, 255, 255, 0))";
                }} // Remove glow on hover out
              />
              <a
                href=""
                className="ml-16 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Guineapig Blog
                <svg
                  className="rtl:rotate-180 w-3.5 h-3.5 ms-2 "
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
          </div>
          {/* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Another>>>>>>>>>>>>>>>>>> */}
          <div
            className="  bg-transparent flex flex-col w-1/2   max-w-xs w-full md:w-1/2 flex flex-col justify-center max-w-xs ml-8  
      rounded-lg  "
            style={{ height: "400px" }}
          >
            <div style={{ width: "100%", height: "200px" }}>
              <img
                className="rounded-t-lg   "
                src="./images/parrot.png"
                alt=""
                style={{
                  height: "350px",
                  objectFit: "fill",
                  filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))", // Add drop-shadow effect
                  transition: "filter 0.3s ease", // Add transition for smooth effect
                }}
                onClick={() => {
                  playSound("./sound/parrot.mp3");
                  // You can add additional actions here if needed
                }}
                onMouseEnter={(e) =>
                  (e.target.style.filter =
                    "drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))")
                } // Apply glow on hover
                onMouseLeave={(e) => {
                  e.target.style.filter =
                    "drop-shadow(0 0 0 rgba(255, 255, 255, 0))";
                }} // Remove glow on hover out
              />
              <a
                href=""
                className="ml-16 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Parrot Blog
                <svg
                  className="rtl:rotate-180 w-3.5 h-3.5 ms-2 "
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
          </div>

          {/* ><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>></> */}
          <div
            className="  bg-transparent flex flex-col w-1/2   max-w-xs w-full md:w-1/2 flex flex-col justify-center max-w-xs ml-8  
      rounded-lg  "
            style={{ height: "400px" }}
          >
            <div style={{ width: "100%", height: "200px" }}>
              <img
                className="rounded-t-lg   "
                src="./images/fish.png"
                alt=""
                style={{
                  height: "350px",
                  objectFit: "fill",
                  filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))", // Add drop-shadow effect
                  transition: "filter 0.3s ease", // Add transition for smooth effect
                }}
                onClick={() => {
                  playSound("./sound/fish.mp3");
                  // You can add additional actions here if needed
                }}
                onMouseEnter={(e) =>
                  (e.target.style.filter =
                    "drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))")
                } // Apply glow on hover
                onMouseLeave={(e) => {
                  e.target.style.filter =
                    "drop-shadow(0 0 0 rgba(255, 255, 255, 0))";
                }} // Remove glow on hover out
              />
              <a
                href=""
                className="ml-16 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Fish Blog
                <svg
                  className="rtl:rotate-180 w-3.5 h-3.5 ms-2 "
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
          </div>
          {/* Add more items as needed */}
        </Slider>
      </div>
    </>
  );
};
export default Home;
