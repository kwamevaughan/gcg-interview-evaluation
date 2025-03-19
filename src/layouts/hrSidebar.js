// src/layouts/hrSidebar.js
import { useEffect, useState, useRef } from "react";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import toast, { Toaster } from "react-hot-toast";


const HRSidebar = ({ isOpen, mode, onLogout, toggleSidebar }) => {
    const [windowWidth, setWindowWidth] = useState(null);
    const router = useRouter();
    const sidebarRef = useRef(null);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Handle outside click/tap to close sidebar on mobile
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (
                isOpen &&
                windowWidth < 640 && // Mobile only
                sidebarRef.current &&
                !sidebarRef.current.contains(e.target)
            ) {
                toggleSidebar(); // Close sidebar
            }
        };

        // Listen for both mouse and touch events
        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
        };
    }, [isOpen, windowWidth, toggleSidebar]); // Dependencies

    if (windowWidth === null) return null;

    const fullName = "GCG BD Team"; // Static for now

    const isActive = (pathname) =>
        router.pathname === pathname
            ? mode === "dark"
                ? "bg-[#f05d23] text-white shadow-md"
                : "bg-[#f05d23] text-white shadow-md"
            : mode === "dark"
                ? "text-gray-200 hover:bg-gray-700 hover:text-white"
                : "text-[#231812] hover:bg-gray-200 hover:text-[#f05d23]";

    return (
        <div
            ref={sidebarRef}
            className={`fixed left-0 top-0 z-50 h-full transition-all duration-300 ${
                mode === "dark" ? "bg-gray-900" : "bg-gray-50"
            }`}
            style={{
                width: isOpen ? "300px" : windowWidth < 640 ? "0" : "80px",
            }}
        >
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className={`flex justify-center py-8 ${isOpen ? "px-6" : "px-0"}`}>
                    {isOpen ? (
                        <Image
                            src={mode === "dark" ? "/assets/images/logo-white.svg" : "/assets/images/logo.svg"}
                            alt="Growthpad Logo"
                            width={180}
                            height={75}
                            className="object-contain"
                        />
                    ) : (
                        <Image
                            src={mode === "dark" ? "/favicon-white.png" : "/favicon.png"}
                            alt="Growthpad Logo"
                            width={48}
                            height={48}
                            className="object-contain"
                        />
                    )}
                </div>

                {/* Navigation */}
                <ul className="flex-grow px-2">
                    {[
                        { href: "/hr/overview", icon: "mdi:view-dashboard", label: "Dashboard Overview" },
                        { href: "/hr/jobs", icon: "mdi:briefcase", label: "Job Postings" },
                        { href: "/hr/applicants", icon: "mdi:account-group", label: "Applicants" },
                        {
                            href: "/hr/interview-questions",
                            icon: "mdi:account-question",
                            label: "Interview Questions",
                        },
                        {
                            href: "/hr/email-templates",
                            icon: "lsicon:email-send-outline",
                            label: "Email Templates",
                        },
                        {
                            href: "/hr/automations",
                            icon: "carbon:power-virtual-server-disaster-recovery-automation",
                            label: "Automations",
                        },
                    ].map(({ href, icon, label }) => (
                        <li key={href} className="py-2">
                            <button
                                onClick={() => {
                                    router.push(href);
                                    if (windowWidth < 640) toggleSidebar(); // Close sidebar on mobile nav click
                                }}
                                className={`flex items-center font-semibold text-sm w-full ${
                                    isOpen ? "justify-start px-6" : "justify-center px-0"
                                } py-3 rounded-lg hover:shadow-md transition-all duration-200 group relative ${isActive(
                                    href
                                )}`}
                            >
                                <Icon
                                    icon={icon}
                                    className={`${
                                        isOpen ? "h-7 w-7 mr-3" : "h-6 w-6"
                                    } group-hover:scale-110 transition-transform`}
                                />
                                {isOpen && <span className="text-base">{label}</span>}
                                {!isOpen && (
                                    <span
                                        className={`absolute left-full ml-2 text-xs ${
                                            mode === "dark"
                                                ? "bg-gray-800 text-gray-200"
                                                : "bg-gray-700 text-white"
                                        } rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50`}
                                    >
                                        {label}
                                    </span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Profile/Logout */}
                {(!isOpen && windowWidth < 640) ? null : (
                    <div
                        className={`flex items-center justify-between px-4 py-6 mt-auto ${
                            mode === "dark"
                                ? "bg-gradient-to-r from-gray-800 to-gray-700"
                                : "bg-gradient-to-r from-gray-200 to-gray-100"
                        } shadow-inner`}
                    >
                        {isOpen ? (
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 overflow-hidden">
                                        <Image
                                            src={mode === "dark" ? "/favicon-white.png" : "/favicon.png"}
                                            alt="Profile"
                                            width={48}
                                            height={48}
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className={`text-base font-medium ${mode === "dark" ? "text-gray-200" : "text-[#231812]"}`}>
                                        {fullName}
                                    </span>
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="flex items-center justify-center text-red-500 hover:text-red-600 transition-colors"
                                    aria-label="Logout"
                                >
                                    <ArrowRightStartOnRectangleIcon className="h-7 w-7" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full relative group">
                                <button
                                    onClick={onLogout}
                                    className="flex items-center justify-center text-red-500 hover:text-red-600 transition-colors"
                                    aria-label="Logout"
                                >
                                    <ArrowRightStartOnRectangleIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                </button>
                                <span
                                    className={`absolute left-full ml-2 text-xs ${
                                        mode === "dark" ? "bg-gray-800 text-gray-200" : "bg-gray-700 text-white"
                                    } rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50`}
                                >
                                    Sign Out
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HRSidebar;