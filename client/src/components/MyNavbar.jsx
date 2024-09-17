import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "/index.css";
import { persistor } from "../redux/store";
import axios from "axios";
import { setUserId } from "../redux/actions";

const MyNavbar = () => {
  const navigation = [
    { name: "Dashboard", href: "/", current: true },
    { name: "Profile", href: "/profile", current: false },
    { name: "Products", href: "/products", current: false },
  ];

  const [isloggedin, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);
  const [image, setImage] = useState(null);
  const [employees, setEmployees] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const UserId = useSelector((state) => state.reducer.UserId);

  console.log("Selected User ID from Redux store:", UserId);

  useEffect(() => {
    const getProfile = async () => {
      if (token) {
        try {
          const response = await axios.get("http://localhost:3001/profile", {
            timeout: 10000,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const { success, user } = response.data;

          if (success) {
            dispatch(setUserId(user._id)); // Dispatch the action to set the UserId
            setUserName(user.name);
            setIsLoggedIn(true);
          } else {
            console.log("Error fetching user profile:", response.data.message);
            onLogout();
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          onLogout();
        }
      }
    };

    if (token) {
      getProfile();
    }
  }, [token, dispatch]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (UserId) {
        try {
          const response = await axios.get(
            `http://localhost:3001/employeeNames/${UserId}`
          );
          setEmployees(response.data);
          setImage(response.data.image);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchProfile();
  }, [UserId, setEmployees]);

  const onLogout = async () => {
    localStorage.removeItem("accessToken");
    setUserName(null);
    setIsLoggedIn(false);
    setEmployees(null);
    await persistor.purge();
    alert("You are being logged out due to inactive session.");
    navigate("/");
  };

  const onLogin = () => {
    navigate("/login");
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-10xl px- sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between z-10">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
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
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500">
                {isloggedin ? (
                  <button className="text-white" onClick={onLogout}>
                    Logout
                  </button>
                ) : (
                  <button className="text-white" onClick={onLogin}>
                    Login
                  </button>
                )}
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 text-white">
                Welcome {userName}
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={`http://localhost:3001/images/${employees?.image}`}
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};

export default MyNavbar;
