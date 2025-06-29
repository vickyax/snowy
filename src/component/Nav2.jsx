"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from '@/context/AuthContext';
import supabase from '@/utils/supabaseServer';


import snowfeed from "@/public/logojc3.jpg";


// --- SVG Icons (Unchanged) ---
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const CustomAlert = ({ severity, children }) => {
    const aStyles = {
        success: 'bg-green-100 border-green-400 text-green-700',
        error: 'bg-red-100 border-red-400 text-red-700',
    };
    return (
        <div className={`fixed top-20 right-4 z-50 border px-4 py-3 rounded-md shadow-lg ${aStyles[severity] || 'bg-blue-100 border-blue-400 text-blue-700'}`} role="alert">
            <span className="block sm:inline">{children}</span>
        </div>
    );
};

const Navbar = () => {
    const { user, loading } = useAuth();
    const { setCurrentPage } = useAuth();
    const router = useRouter();
    const [navFloat, setNavFloat] = useState(false);
    const [logConfirm, setLogConfirm] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const menuRef = useRef(null);
    const profileDropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setNavFloat(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                if(!event.target.closest('[aria-label="Toggle menu"]')) {
                    setShowMenu(false);
                }
            }
            // Check for profile dropdown click outside
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                // Also ensure the profile icon itself wasn't clicked
                if (!event.target.closest('[aria-label="Toggle profile dropdown"]')) {
                    setShowProfileDropdown(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            setLogConfirm(false);
            setShowSuccess(true);
            setShowProfileDropdown(false);
            setShowMenu(false);
            setTimeout(() => setShowSuccess(false), 3000);
            router.push("/");
        } else {
            console.error("Logout failed:", error.message);
        }
    };
    
    const navigate = (path) => {
      setShowMenu(false);
      setShowProfileDropdown(false);
      // The timeout ensures the state has time to update and close the menu
      // before the page transition begins.
      setTimeout(() => {
        router.push(path);
      }, 100); 
    };

    // --- NEW: Dedicated handler for the logout button click ---
    const handleLogoutClick = () => {
        setShowProfileDropdown(false); // Close the dropdown
        setLogConfirm(true);           // Open the confirmation modal
    };

    const navLinks = [
        { name: 'Dashboard', path: '/technician/dashboard', icon: <DashboardIcon /> },
        { name: 'My Schedule', path: '/technician/schedule', icon: <CalendarIcon /> },
        { name: 'Job History', path: '/technician/history', icon: <HistoryIcon /> },
    ];
    
    return (
        <nav className={`fixed w-full z-30 top-0 text-white ${navFloat ? "bg-slate-800 shadow-lg" : "bg-slate-900/80 backdrop-blur-sm"} transition duration-300 ease-in-out`}>
            {showSuccess && (
                <CustomAlert severity="success">
                    Successfully logged out.
                </CustomAlert>
            )}

            <div className="w-full container mx-auto flex items-center justify-between py-3 px-4">
                <div className="flex items-center space-x-4">
                    <button onClick={() => setCurrentPage("dashboard")} className="flex items-center space-x-2">
                       <Image
                                src={snowfeed}
                                alt="Snowfeed Icon"
                                width={45}
                                height={45}
                                style={{ borderRadius: "50%", position: "relative", zIndex: 1 }}
                              />
                        <span className="text-xl font-bold text-white hidden sm:block">Technician Panel</span>
                    </button>
                </div>
                
                <div className="hidden lg:flex items-center space-x-2">
                    
                    <button  onClick={() => setCurrentPage("dashboard")} className="flex items-center px-4 py-2 text-gray-300 hover:bg-slate-700 hover:text-white rounded-md transition-colors">
                           <DashboardIcon /> Dashboard
                        </button>
                    <button   className="flex items-center px-4 py-2 text-gray-300 hover:bg-slate-700 hover:text-white rounded-md transition-colors">
                           <CalendarIcon />  My Shedule
                        </button>
                    <button  className="flex items-center px-4 py-2 text-gray-300 hover:bg-slate-700 hover:text-white rounded-md transition-colors">
                           <HistoryIcon />  Job History
                        </button>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="hidden lg:block relative" ref={profileDropdownRef}>
                        <button onClick={() => setShowProfileDropdown(prev => !prev)} aria-label="Toggle profile dropdown" className="flex items-center p-2 bg-slate-700 rounded-full hover:bg-slate-600 transition">
                            <ProfileIcon />
                        </button>
                        {showProfileDropdown && (
                             <div className="absolute top-full right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-lg p-2 z-50">
                                 {/* --- CHANGE 1: Use the `Maps` function --- */}
                                 <button onClick={() => setCurrentPage("settings")} className="w-full text-left flex items-center px-4 py-2 hover:bg-gray-100 rounded-md"><SettingsIcon /> Settings</button>
                                 <div className="border-t my-1 border-gray-200"></div>
                                 {/* --- CHANGE 2: Use the new handler function --- */}
                                 <button onClick={handleLogoutClick} className="w-full text-left flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"><LogoutIcon /> Logout</button>
                             </div>
                        )}
                    </div>

                    <div className="lg:hidden">
                        <button onClick={() => setShowMenu(prev => !prev)} className="flex items-center p-2 text-gray-300 hover:bg-slate-700 rounded-md" aria-label="Toggle menu">
                            <svg className="fill-current h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
                        </button>
                    </div>
                </div>
            </div>

             <div ref={menuRef} className={`lg:hidden absolute top-full left-0 w-full bg-slate-800/95 backdrop-blur-sm p-4 transition-transform duration-300 ease-in-out ${showMenu ? 'translate-y-0' : '-translate-y-[150%]'}`}>
                 <ul className="flex flex-col space-y-2">
                     {navLinks.map((link) => (
                         <li key={link.name}>
                             <button onClick={() => navigate(link.path)} className="w-full flex items-center px-4 py-3 text-gray-200 hover:bg-slate-700 rounded-md transition-colors">
                                 {link.icon} {link.name}
                             </button>
                         </li>
                     ))}
                     <div className="border-t my-2 border-slate-600"></div>
                     {/* --- CHANGE 3: Use navigate here too for consistency --- */}
                     <li><button onClick={() => setCurrentPage("settings")} className="w-full flex items-center px-4 py-3 text-gray-200 hover:bg-slate-700 rounded-md transition-colors"><SettingsIcon /> Settings</button></li>
                     <li><button onClick={() => {setLogConfirm(true); setShowMenu(false);}} className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-slate-700 rounded-md transition-colors"><LogoutIcon /> Logout</button></li>
                 </ul>
             </div>
            
            {logConfirm && (
                <div className="fixed inset-0 top-20 flex items-center justify-center z-50 bg-black/60">
                    <div className="bg-white text-black shadow-lg rounded-lg p-6 mx-4">
                        <p className="mb-4 text-lg font-semibold">Are you sure you want to log out?</p>
                        <div className="flex justify-end space-x-4">
                            <button className="bg-gray-200 text-gray-800 cursor-pointer px-6 py-2 rounded-lg hover:bg-gray-300 transition" onClick={() => setLogConfirm(false)}>Cancel</button>
                            <button className="bg-red-600 text-white cursor-pointer px-6 py-2 rounded-lg hover:bg-red-700 transition" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;