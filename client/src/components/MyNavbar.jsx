import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { ref, getDownloadURL } from "firebase/storage";
import "/index.css";
import { storage } from "../../firebaseConfig";

const MyNavbar = () => {
  const navigation = [
    { name: "Dashboard", href: "/", current: true },
    { name: "Profile", href: "/profile", current: false },
    { name: "Products", href: "/products", current: false },
    { name: "How to Operate", href: "/howto", current: false },
  ];
  const [previewImage, setPreviewImage] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);
  const [employees, setEmployees] = useState(null);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    const getProfile = async () => {
      if (token) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL_PROD_API_URL}/profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const { success, user } = response.data;

          if (success) {
            setUserName(user.name);
            setIsLoggedIn(true);
          } else {
            console.log("Error fetching user profile:", response.data.message);
            onLogout(true);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          onLogout(true);
        }
      }
    };

    if (token) {
      getProfile();
    }
  }, [token]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_URL_PROD_API_URL
            }/employeeNames/${userId}`
          );
          setEmployees(response.data);
          if (response.data.image) {
            const imageRef = ref(
              storage,
              `profileImages/${userId}/${response.data.image}`
            );
            const downloadURL = await getDownloadURL(imageRef);
            setPreviewImage(downloadURL); // Set the fetched image URL
          } else {
            setPreviewImage(null);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchProfile();
  }, [userId]);

  const onLogout = async (isSessionExpired = false) => {
    localStorage.removeItem("accessToken");
    setUserName(null);
    setIsLoggedIn(false);
    setEmployees(null);
    setPreviewImage(null);

    if (isSessionExpired) {
      alert("You are being logged out due to inactive session.");
    }

    navigate("/"); // Redirect to the home page
  };

  const onLogin = () => {
    navigate("/login");
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <Disclosure as="nav" className="bg-gray-900 shadow-md">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between z-10">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0">
                  <a href="/homepage">
                    <img
                      className="h-8 w-auto"
                      src="./images/pets.png"
                      alt="Your Company"
                    />
                  </a>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium transition duration-150"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300">Welcome, {userName}</span>
                  <button
                    className="text-gray-300 hover:bg-gray-700 rounded-md px-3 py-2 transition duration-150"
                    onClick={isLoggedIn ? onLogout : onLogin}
                  >
                    {isLoggedIn ? "Logout" : "Login"}
                  </button>
                  <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  {isLoggedIn && employees?.image && (
                    <Menu as="div" className="relative ml-3">
                      <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={previewImage}
                          alt="User Avatar"
                        />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Your Profile
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="/User"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Sign out
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};

export default MyNavbar;
