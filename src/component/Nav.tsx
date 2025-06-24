"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import snowfeed from "@/public/logojc3.jpg";

const Navbar = () => {
  const router = useRouter();
  const [navFloat, setNavFloat] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [show, setshow] = useState(false);
  const hambugerEl = useRef<HTMLDivElement>(null);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavFloat(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
    if (show) {
      setshow(false);
    }
  };
  const togglepro = () => setshow((prev) => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (showMenu && hambugerEl.current && !hambugerEl.current.contains(event.target as Node)) {
      setShowMenu(false);
    }
  };
  const handleclick = (event: MouseEvent) => {
    if (showMenu && hambugerEl.current && !hambugerEl.current.contains(event.target as Node)) {
      setshow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showMenu]);
  useEffect(() => {
    document.addEventListener("click", handleclick);
    return () => document.removeEventListener("click", handleclick);
  }, [show]);

  return (
    <nav
      id="header"
      className={`fixed w-full z-30 top-0 text-white ${
        navFloat ? "bg-transparent" : "bg-blue-300 bg-opacity-20 shadow-md"
      } transition duration-300 ease-in-out`}
    >
      <div className="w-full container mx-auto flex items-center justify-between py-5">
        {/* Logo */}
        <div className="pl-4 flex items-center text-blue-400">
          <button
            className={`no-underline font-bold text-[18px] md:text-2xl lg:text-3xl cursor-pointer flex items-center space-x-1 ${
              navFloat
                ? "bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-violet-800 via-violet-600 to-cyan-600 bg-clip-text text-transparent"
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
        </div>

        {/* Hamburger Menu */}
{/* Hamburger Menu */}
<div className="block lg:hidden pr-4">
  <button
    onClick={toggleMenu}
    className="flex items-center p-1 text-pink-800 hover:text-gray-900 focus:outline-none transition duration-300"
  >
    <svg className="fill-current h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <title>Menu</title>
      <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
    </svg>
  </button>
</div>

{/* Sidebar Overlay */}
{showMenu && (
  <div
    className="fixed inset-0 z-40  bg-opacity-40 transition-opacity duration-300"
    onClick={toggleMenu}
  />
)}

{/* Sidebar */}
<div
  className={`fixed top-0 mt-20 left-0 h-full w-42 bg-white/50  shadow-lg z-50 transform transition-transform duration-300 ${
    showMenu ? "translate-x-0" : "-translate-x-full"
  } lg:hidden`}
>
  <button
    className="absolute top-4 right-4 text-black text-xl"
    onClick={toggleMenu}
  >
    ✕
  </button>
  <ul className="flex flex-col mt-16 space-y-4 px-6">
    <li>
      <button
        onClick={() => { router.push("/technicians"); toggleMenu(); }}
        className="w-full bg-teal-500 text-left px-4 py-2 rounded hover:bg-teal-300"
      >
        Technicians
      </button>
    </li>
    <li>
      <button
        onClick={() => { router.push("/login"); toggleMenu(); }}
        className="w-full bg-green-500 text-left px-4 py-2 rounded hover:bg-green-300"
      >
        Login
      </button>
    </li>
    <li>
      <button className="w-full bg-blue-500 text-left px-4 py-2 rounded hover:bg-blue-300">
        Services
      </button>
    </li>
    <li>
      <button className="bg-green-500 w-full text-left px-4 py-2 rounded hover:bg-green-300">
        FAQ
      </button>
    </li>
    <li>
      <a href="/chatbot">

        <button className="bg-blue-500 w-full text-left flex  flex-row px-4 py-2 rounded hover:bg-blue-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2m2-4h6m-6 0a2 2 0 00-2 2v2m8-4a2 2 0 012 2v2m-6 4h.01M12 16h.01M8 16h.01M16 16h.01" />
              </svg>
           <div className="ml-1">Chat Bot</div>
        </button>
      </a>
    </li>
  </ul>
</div>

{/* Desktop Navigation Links */}

        {/* Navigation Links */}
        <div className="hidden lg:flex lg:items-center lg:w-auto text-black">
          <ul className="list-reset lg:flex justify-end flex-1 items-center">
            <li className="mr-3">
              
                <button
                onClick={() => router.push("/technicians")}
                  className="mx-2 px-4 py-2 cursor-pointer  bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-black font-semibold rounded-full shadow-md transition duration-300"
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
              
                <button 
                onClick={() => router.push("/login")}
                 className="py-2 px-4  cursor-pointer text-black font-bold">Login</button>
             
            </li>
            <li className="mr-3">
              <button className="py-2 px-4 cursor-pointer text-black hover:text-gray-800">Services</button>
            </li>
            <li className="mr-3">
              <button className="py-2 px-4 cursor-pointer text-black hover:text-gray-800">FAQ</button>
            </li>
            <li className="mr-3">
              
          {/* Chat Bot Button */}
          <a href="/chatbot" >
          <button
            className="mx-2 px-4 py-2 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-black font-semibold rounded-lg shadow-md transition duration-300"
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

          <button
            onClick={togglepro}
            className="mx-3 cursor-pointer px-2 my-2 py-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-black font-semibold rounded-lg shadow-md transition duration-300"
          >
            <span className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
              </svg>
              <span>Profile</span>
            </span>
          </button>
        </div>
        <div className={` ${show ? "block" : "hidden"}  absolute top-25 right-0 bg-white text-black shadow-lg rounded-lg p-4`}>
          <ul className="list-reset">
            <li className="py-2">
              <button
                onClick={() => router.push("/technicians")}
                className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg transition duration-300"
              >
                My Orders
              </button>
            </li>
            <li className="py-2">
              <button
                onClick={() => router.push("/technicians")}
                className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg transition duration-300"
              >
                Track Requests
              </button>
            </li>
            <li className="py-2">
              <a href="/login">
                <button className="cursor-pointer w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg transition duration-300">
                  Login
                </button>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <hr className="border-b border-gray-100 opacity-25 my-0 py-0" />
    </nav>
  );
};

export default Navbar;