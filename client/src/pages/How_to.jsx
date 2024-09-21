import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const Howto = () => {
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
      <div className="flex flex-col bg-blue-200 h-screen ">
        <div className=" gap-4 p-6  bg-transparent">
          <div className="p-4 ">
            <h1 className="text-4xl p-2  font-bold text-center">
              How to operate this app
            </h1>
            <h2>username: hero@gmail.com</h2>
            <h2>password: 123</h2>
            <h2>
              goto products:
              <br />
              buy
            </h2>
            <h2>goto profile</h2>
            <h2>edit your profile</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default Howto;
