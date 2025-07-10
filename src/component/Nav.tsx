"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from '@/context/AuthContext';
import supabase from '@/utils/supabaseServer';
import SettingsIcon from '@mui/icons-material/Settings';
import Alert from '@mui/material/Alert';
import CallIcon from '@mui/icons-material/Call';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import snowfeed from "@/public/logojc3.jpg";
import SupportIcon from '@mui/icons-material/SupportAgent';
import Faq from '@mui/icons-material/Quiz';
import Timeline from '@mui/icons-material/Timeline';
import Cart from '@mui/icons-material/ShoppingCartCheckout';
import HailIcon from '@mui/icons-material/Hail';
import LoginIcon from '@mui/icons-material/Login';
import Cart2 from '@mui/icons-material/ShoppingCart';
import Search from "@/component/components/Search"
import PlaceIcon from '@mui/icons-material/Place';
import Drop from '@mui/icons-material/ArrowDropDown';
const Navbar = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [navFloat, setNavFloat] = useState(false);
  const [logConfirm, setLogConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // Controls mobile sidebar visibility
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // Controls desktop profile dropdown visibility
  const [showMobileProfileDropdown, setShowMobileProfileDropdown] = useState(false); // Controls mobile profile dropdown visibility

  const hamburgerEl = useRef<HTMLDivElement>(null); // Ref for the mobile menu icon/button
  const profileDropdownRef = useRef<HTMLDivElement>(null); // Ref for the desktop profile button
  const mobileProfileButtonRef = useRef<HTMLLIElement>(null); // Ref for the mobile profile button and its dropdown

  const [showText, setShowText] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavFloat(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation for "Services" text
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const startAnimationLoop = () => {
      setShowText(false);
      const showTimer = setTimeout(() => {
        setShowText(true);
        const hideTimer = setTimeout(() => {
          setShowText(false);
        }, 2000);
        return () => clearTimeout(hideTimer);
      }, 300);
      return () => clearTimeout(showTimer);
    };

    intervalId = setInterval(() => {
      startAnimationLoop();
    }, 4000);

    // Initial run immediately
    startAnimationLoop();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setLogConfirm(false);
      setShowSuccess(true);
      setShowProfileDropdown(false); // Close desktop profile dropdown on logout
      setShowMobileProfileDropdown(false); // Close mobile profile dropdown on logout
      setShowMenu(false); // Close mobile sidebar on logout
      setTimeout(() => setShowSuccess(false), 2000);
      router.push("/");
    } else {
      alert("Logout failed or User not logged in.");
    }
  };

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
    // Close desktop profile dropdown if mobile menu is opened
    if (showProfileDropdown) {
      setShowProfileDropdown(false);
    }
    // Close mobile profile dropdown when main mobile menu is toggled
    setShowMobileProfileDropdown(false);
  };

  const toggleConfirm = () => {
    setLogConfirm((prev) => !prev);
  };

  const toggleDesktopProfileDropdown = () => {
    setShowProfileDropdown((prev) => !prev);
    // Close mobile menu if desktop profile dropdown is opened
    if (showMenu) {
      setShowMenu(false);
    }
    // Close mobile profile dropdown if desktop profile dropdown is opened
    if (showMobileProfileDropdown) {
      setShowMobileProfileDropdown(false);
    }
  };

  const toggleMobileProfileDropdown = () => {
    setShowMobileProfileDropdown((prev) => !prev);
  };

// Handles clicks outside of the mobile sidebar, desktop profile dropdown, and mobile profile dropdown
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    // Close mobile sidebar if clicked outside its hamburger button
    if (showMenu && hamburgerEl.current && !hamburgerEl.current.contains(event.target as Node)) {
      // Also ensure the click isn't inside the mobile profile dropdown
      if (
        mobileProfileButtonRef.current &&
        mobileProfileButtonRef.current.contains(event.target as Node) &&
        showMobileProfileDropdown
      ) {
        // If click is inside mobile profile dropdown while it's open, don't close main menu
        return;
      }
      setShowMobileProfileDropdown(false); // Close mobile profile dropdown if main sidebar closes
    }

    // Close desktop profile dropdown if clicked outside its button
    if (showProfileDropdown && profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
      setShowProfileDropdown(false);
    }

    // Explicitly handle closing the mobile profile dropdown when clicking outside its specific area
    if (showMobileProfileDropdown && mobileProfileButtonRef.current && !mobileProfileButtonRef.current.contains(event.target as Node)) {
      setShowMobileProfileDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showMenu, showProfileDropdown, showMobileProfileDropdown]);

  return (
    <nav
      id="header"
      className={`fixed w-screen z-30 top-0 text-white ${
        navFloat ? "bg-[#00BFFF]/80" : "bg-[#00BFFF]/40 shadow-md"
      } transition duration-300 ease-in-out`}
    >
      {showSuccess && (
        <Alert severity="success" className="fixed top-20 right-4 z-50">
          Successfully logged out.
        </Alert>
      )}

      <div className="w-full container mx-auto flex items-center justify-between py-2 lg:py-5">
        {/* Logo */}
       
<div className="pl-4 flex mr-1  flex-col lg:flex-row items-start text-blue-400">
  <button
    className={`no-underline  font-bold text-[18px] md:text-2xl lg:text-2xl cursor-pointer flex items-center space-x-1 ${
      navFloat
        ? "hidden "
        : "text-blue-800 bg-clip-text "
    }`}
    onClick={() => router.push("/")}
  >
    <Image
      src={snowfeed}
      alt="Snowfeed Icon"
      width={45}
      height={45}
      style={{ borderRadius: "50%", position: "relative", zIndex: 1 }}
    />
    <span
      className={`transition-all duration-700 ease-in-out ${
        showText ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
      }`}
    >
      Services
    </span>
  </button>
  <div className="ml-0 lg:ml-5 bg-transparent flex flex-row items-center space-x-2">
    <button className={`flex items-center ${!navFloat ? "hidden" : "relative"} text-black hover:text-gray-900 focus:outline-none cursor-pointer transition duration-300`}>
      <Cart2 sx={{ fontSize: 30 }}/>
    </button>
    <Search navFloat={navFloat}/>
  </div>
  <div className={`${navFloat ? "hidden" : "block"}`}>
  <span className="text-black font-bold lg:text-[18px] sm:text-[8px] flex items-center mt-1">
    <CallIcon className="!w-4 !h-4 lg:mr-2 sm:mr-0" />
    +91 9790189488
  </span>

<button className="w-screen mt-2 cursor-pointer bg-[#00BFFF]/30 text-black py-2  text-start font-semibold text-sm shadow-sm rounded-sm overflow-x-hidden">
  <PlaceIcon sx={{ fontSize: 20 }}/>
  To 123 Main Street, Coimbatore, 641008
  <Drop/>
</button>
  </div>
</div>

        {/* Hamburger Menu (visible on small screens) */}
        <div className="block lg:hidden pr-4" ref={hamburgerEl}>
          <button className={`flex  items-center top-[20px] right-[48px] ${navFloat?"hidden":"absolute"} text-black cursor-pointer hover:text-gray-900 focus:outline-none transition duration-300`}>
            <Cart2 sx={{ fontSize: 30 }}/>
          </button>
          <button
            onClick={toggleMenu}
            className={`flex items-center top-[20px] right-3 absolute text-black hover:text-gray-900 focus:outline-none transition duration-300`}
            aria-label="Toggle menu"
          >
            <svg className="fill-current h-7 w-7" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>

        {/* Sidebar Overlay */}
        {showMenu && (
          <div
            className="fixed inset-0 z-40 bg-black/60 bg-opacity-40 transition-opacity duration-300 lg:hidden"
            onClick={toggleMenu} // Closes sidebar when overlay is clicked
          />
        )}

        {/* Sidebar (Mobile Menu) */}
        <div
          className={`fixed top-0 mt-[80px] left-0 h-[calc(100vh-80px)] w-48 bg-black/30 backdrop-blur-md shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
            showMenu ? "translate-x-0" : "-translate-x-full"
          } lg:hidden`}
        >
          <ul className="flex flex-col mt-4 space-y-2 px-2 text-black text-[10px]">
            <li>
              <button
                onClick={() => { router.push("/technicians"); toggleMenu(); }}
                className="w-full bg-teal-500 text-left px-4 py-2 rounded hover:bg-teal-300 transition duration-200 text-white"
              >
                <HailIcon className="!h-5 !w-5 mr-1"/>
                Technicians
              </button>
            </li>
            <li>
              <button
                onClick={() => { router.push("/login"); toggleMenu(); }}
                className="w-full bg-green-500 text-left px-4 py-2 rounded hover:bg-green-300 transition duration-200 text-white"
              >
                <LoginIcon className="!h-5 !w-5 mr-1"/>
                Login
              </button>
            </li>
            <li>
              <button className="w-full bg-blue-500 text-left px-4 py-2 rounded hover:bg-blue-300 transition duration-200 text-white"
              onClick={() => { router.push("/Searchpage"); toggleMenu(); }}>
               <SupportIcon className="!h-5 !w-5 mr-1"/> Services
              </button>
            </li>
            <li>
              <button className="bg-green-500 w-full text-left px-4 py-2 rounded hover:bg-green-300 transition duration-200 text-white">
              <Faq className="!h-5 !w-5 mr-1"/>  FAQ
              </button>
            </li>
            <li>
              <a href="/chatbot" onClick={toggleMenu}>
                <button className="bg-blue-500 w-full text-left flex items-center px-4 py-2 rounded hover:bg-blue-300 transition duration-200 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2m2-4h6m-6 0a2 2 0 00-2 2v2m8-4a2 2 0 012 2v2m-6 4h.01M12 16h.01M8 16h.01M16 16h.01" />
                  </svg>
                  <span>Chat Bot</span>
                </button>
              </a>
            </li>
            {/* Mobile Profile Button and Dropdown */}
            <li className="pt-1 border-t border-gray-300 mt-1 relative" ref={mobileProfileButtonRef}>
              <button
                onClick={toggleMobileProfileDropdown}
                className="w-full bg-gray-500 text-left  px-4 py-2 rounded hover:bg-gray-400 transition duration-200 text-white flex items-center space-x-2"
              >
                 {user ? (
                    <AccountCircleIcon className="text-gray-200" style={{ fontSize: 25 }} />
                 ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                    </svg>
                 )}
                <span>Profile</span>
                {/* Dropdown arrow (optional) */}
                <svg className={`ml-auto w-4 h-4 transition-transform duration-200 ${showMobileProfileDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Nested Mobile Profile Dropdown */}
              {showMobileProfileDropdown && (
                <div className="absolute left-0  mt-1 w-full bg-white text-black shadow-lg rounded-lg p-1 z-50">
                  <ul className="list-reset">
                    <li className="py-1">
                      <button
                        onClick={() => { router.push("/my-orders"); setShowMobileProfileDropdown(false); }}
                        className="cursor-pointer bg-gray-100 w-full text-left px-4 py-2 hover:bg-gray-200 rounded-lg transition duration-300"
                      ><Cart className="!h-5 !w-5 mr-1 "/>
                        My Orders
                      </button>
                    </li>
                    <li className="py-1">
                      <button
                        onClick={() => { router.push("/track-requests"); setShowMobileProfileDropdown(false); }}
                        className="cursor-pointer bg-gray-100 w-full text-left px-4 py-2 hover:bg-gray-200 rounded-lg transition duration-300"
                      ><Timeline className="!h-5 !w-5 mr-1"/>
                        Track Requests
                      </button>
                    </li>
                    <li className="py-1">
                      <button
                        onClick={() => { router.push("/settings"); setShowMobileProfileDropdown(false); }}
                        className="cursor-pointer bg-gray-100 w-full text-left px-4 py-2 hover:bg-gray-200 rounded-lg transition duration-300"
                      >
                        <SettingsIcon className="!h-5 !w-5 mr-1"/>
                        Settings
                      </button>
                    </li>
                    {!user && (
                      <li className="py-1">
                        <button
                          onClick={() => { router.push("/login"); setShowMobileProfileDropdown(false); }}
                          className="cursor-pointer bg-gray-100 w-full text-left px-4 py-2 hover:bg-gray-200 rounded-lg transition duration-300"
                        ><LoginIcon className="!h-5 !w-5 mr-1"/>
                          Login
                        </button>
                      </li>
                    )}
                    {user && (
                      <li className="py-1">
                        <button
                          onClick={() => { toggleConfirm(); setShowMobileProfileDropdown(false); }} // Keep main sidebar open for confirm dialog
                          className="cursor-pointer w-full bg-gray-100 text-left px-4 py-2 hover:bg-gray-100 rounded-lg transition duration-300"
                        ><LoginIcon className="!h-5 !w-5 mr-1"/>
                          Logout
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex lg:items-center lg:w-auto text-black">
          <ul className="list-reset lg:flex justify-end flex-1 items-center">
            <li className="mr-3">
              <button
                onClick={() => router.push("/technicians")}
                className="mx-2 px-4 py-2 cursor-pointer bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold rounded-full shadow-md transition duration-300"
              >
                <span className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 1.104-.896 2-2 2s-2-.896-2-2 .896-2 2-2 2 .896 2 2zm-2 4c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4zm6-4c0 1.104.896 2 2 2s2-.896 2-2-.896-2-2-2-2 .896-2 2zm2 4c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4z" />
                  </svg>
                  <span>Technicians</span>
                </span>
              </button>
            </li>
            <li className="mr-3">
              {!user && (
                <button
                  onClick={() => router.push("/login")}
                  className="py-2 px-4 cursor-pointer text-black font-bold"
                >
                  Login
                </button>
              )}
            </li>
            <li className="mr-3">
              <button className="py-2 px-4 cursor-pointer text-black hover:text-gray-800"
              onClick={() => { router.push("/Searchpage"); toggleMenu(); }}>Services</button>
            </li>
            <li className="mr-3">
              <button className="py-2 px-4 cursor-pointer text-black hover:text-gray-800">FAQ</button>
            </li>
            <li className="mr-3">
              <a href="/chatbot" >
                <button
                  className="mx-2 px-4 py-2 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md transition duration-300"
                >
                  <span className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2m2-4h6m-6 0a2 2 0 00-2 2v2m8-4a2 2 0 012 2v2m-6 4h.01M12 16h.01M8 16h.01M16 16h.01" />
                    </svg>
                    <span>Chat Bot</span>
                  </span>
                </button>
              </a>
            </li>
          </ul>

          <div
            onClick={toggleDesktopProfileDropdown}
            className="mx-3 cursor-pointer px-2 my-2 py-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold rounded-lg shadow-md transition duration-300 relative flex items-center space-x-2"
            ref={profileDropdownRef}
            role="button"
            tabIndex={0}
          >
            {user ? (
              <AccountCircleIcon className="text-gray-200" style={{ fontSize: 25 }} />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
              </svg>
            )}
            <span>Profile</span>
            {/* Profile Dropdown (Desktop) */}
            <div className={` ${showProfileDropdown ? "block" : "hidden"} absolute top-full right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg p-2 z-50`}>
              <ul className="list-reset">
                <li className="py-2">
                  <button
                    onClick={() => { router.push("/my-orders"); setShowProfileDropdown(false); }}
                    className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg transition duration-300"
                  ><Cart className="!h-5 !w-5 mr-1"/>
                    My Orders
                  </button>
                </li>
                <li className="py-2">
                  <button
                    onClick={() => { router.push("/track-requests"); setShowProfileDropdown(false); }}
                    className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg transition duration-300"
                  ><Timeline className="!h-5 !w-5 mr-1"/>
                    Track Requests
                  </button>
                </li>
                <li className="py-2">
                  <button
                    onClick={() => { router.push("/settings"); setShowProfileDropdown(false); }}
                    className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg transition duration-300"
                  ><SettingsIcon/>
                    Settings
                  </button>
                </li>
                {!user && (
                  <li className="py-2">
                    <button
                      onClick={() => { router.push("/login"); setShowProfileDropdown(false); }}
                      className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg transition duration-300"
                    >
                      Login
                    </button>
                  </li>
                )}
                {user && (
                  <li className="py-2">
                    <button
                      onClick={toggleConfirm}
                      className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg transition duration-300"
                    >
                      Logout
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Logout Confirmation Modal */}
        <div className={` ${logConfirm ? "block" : "hidden"} fixed inset-0 flex items-center justify-center z-50`}>
            <div className="bg-white text-black shadow-lg rounded-lg p-6">
                <p className="mb-4 text-lg font-semibold">Confirm logout?</p>
                <div className="flex justify-center space-x-4">
                    <button className="bg-green-500 text-white cursor-pointer px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300" onClick={handleLogout}>Confirm</button>
                    <button className="bg-red-500 text-white cursor-pointer px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300" onClick={toggleConfirm}>Cancel</button>
                </div>
            </div>
        </div>
      </div>
      <hr className="border-b border-gray-100 opacity-25 my-0 py-0" />
    </nav>
  );
};

export default Navbar;