// src/layouts/hrHeader.js
import { useState, useEffect, useRef } from "react";
import { MoonIcon, SunIcon, ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Icon } from "@iconify/react";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/16/solid";

const HRHeader = ({ mode, toggleSidebar, toggleMode, isSidebarOpen, onLogout }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fullName = "HR Admin"; // Static for now; integrate user data later

    return (
        <header
            className={`relative top-0 left-0 right-0 z-50 transition-all duration-300 shadow-sm border-b ${
                mode === 'dark' ? 'border-[#8DC63F] bg-[#0a0c1d] text-white' : 'border-gray-300 bg-[#ececec] text-black'
            } ${isSidebarOpen ? 'md:ml-[300px]' : 'md:ml-[80px]'} backdrop-blur-md bg-opacity-30`}
        >
            <div className="flex items-center justify-between p-2 md:p-4">
                {/* Left Section: Logo */}
                <div className="flex items-center space-x-2">

                    <button
                        onClick={toggleSidebar}
                        className="p-2 focus:outline-none"
                        aria-label="Toggle sidebar"
                    >
                        {isSidebarOpen ? <XMarkIcon className="h-6 w-6"/> : <Bars3Icon className="h-6 w-6"/>}
                    </button>
                    <h1 className="text-2xl font-bold">HR Dashboard</h1>
                </div>

                {/* Right Section: Dark Mode, User */}
                <div className="flex items-center space-x-2">
                    {/* Dark Mode Toggle (Mobile) */}
                    <button
                        onClick={toggleMode}
                        className="p-2 focus:outline-none md:hidden"
                        aria-label="Toggle dark mode"
                    >
                        {mode === "dark" ? <SunIcon className="h-6 w-6"/> : <MoonIcon className="h-6 w-6"/>}
                    </button>
                    {/* Dark Mode Toggle (Desktop) */}
                    <label className="hidden md:inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={mode === "dark"} onChange={toggleMode} className="hidden"/>
                        <div
                            className={`relative w-14 h-8 rounded-full border-2 flex items-center ${
                                mode === "dark" ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-gray-300"
                            } transition`}
                        >
                            <div
                                className={`absolute w-6 h-6 rounded-full bg-white flex items-center justify-center transition-transform ${
                                    mode === "dark" ? "translate-x-6" : ""
                                }`}
                            >
                                {mode === "dark" ? (
                                    <Icon icon="bi:moon" className="h-4 w-4 text-gray-700"/>
                                ) : (
                                    <Icon icon="bi:sun" className="h-4 w-4 text-yellow-500"/>
                                )}
                            </div>
                        </div>
                    </label>

                    {/* User Dropdown */}
                    <div
                        className="flex items-center gap-2 relative group cursor-default"
                        ref={dropdownRef}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <div className="flex items-center gap-2 cursor-pointer">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                    src="/favicon.png"
                                    alt="User Profile"
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                />
                            </div>
                            <div className="hidden md:block">
                                <span
                                    className={`font-bold ${
                                        mode === "dark" ? "text-white" : "text-[#231812]"
                                    }`}
                                >
                                    {fullName}
                                </span>
                                <span
                                    className={`block text-sm font-normal ${
                                        mode === "dark" ? "text-[#f05d23]" : "text-[#f05d23]"
                                    }`}
                                >
                                    HR Team
                                </span>
                            </div>
                            <Icon
                                icon={dropdownOpen ? "mingcute:arrow-up-fill" : "mingcute:arrow-down-fill"}
                                className={`h-5 w-5 font-bold transform transition-transform duration-300 ${
                                    mode === "dark" ? "text-white" : "text-[#231812]"
                                }`}
                            />
                        </div>

                        {dropdownOpen && (
                            <div
                                className={`absolute top-full mt-2 right-0 w-80 rounded-2xl shadow-lg z-10 ${
                                    mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-[#231812]"
                                }`}
                            >
                                <div className="p-8">
                                    <p className="text-lg mb-6">User Profile</p>
                                    <div className="flex items-center gap-2 border-b pb-6 w-full">
                                        <div className="rounded-full overflow-hidden flex-shrink-0">
                                            <Image
                                                src="/favicon.png"
                                                alt="User Profile"
                                                width={40}
                                                height={40}
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-md font-bold">{fullName}</span>
                                            <span className="text-sm">HR Team</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onLogout}
                                        className="block w-full text-center text-white px-4 py-2 bg-[#f05d23] rounded-full hover:bg-[#d94f1e] transition duration-200 mt-4"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HRHeader;