import { useEffect, useState, useRef } from "react";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";

const HRSidebar = ({ isOpen, mode, onLogout, toggleSidebar }) => {
    const [windowWidth, setWindowWidth] = useState(null);
    const router = useRouter();
    const sidebarRef = useRef(null);

    // Ensure windowWidth is updated only on the client
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize(); // Set windowWidth on mount
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Check if windowWidth is set before rendering
    if (windowWidth === null) return null; // Prevent rendering until windowWidth is initialized

    const fullName = "HR Admin"; // Static for now

    const isActive = (pathname) =>
        router.pathname === pathname
            ? mode === "dark"
                ? "bg-[#f05d23] text-white"
                : "bg-[#f05d23] text-white"
            : mode === "dark"
                ? "text-white"
                : "text-[#231812]";

    return (
        <div
            ref={sidebarRef}
            className={`fixed left-0 top-0 z-50 h-full transition-all duration-300 ${
                mode === "dark" ? "text-white" : "text-[#231812]"
            }`}
            style={{
                width: isOpen ? "300px" : windowWidth < 640 ? "0" : "80px",
                backgroundColor: mode === "dark" ? "#4b5563" : "#e5e7eb", // Gray shades
            }}
        >
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className={`flex flex-col items-center py-10 ${isOpen ? "px-4" : "px-0"}`}>
                    {isOpen ? (
                        <Image
                            src={mode === "dark" ? "/assets/images/logo-white.svg" : "/assets/images/logo.svg"}
                            alt="Growthpad Logo"
                            width={200}
                            height={75}
                        />
                    ) : (
                        <Image
                            src={mode === "dark" ? "/assets/images/logo-white.svg" : "/assets/images/logo.svg"}
                            alt="Growthpad Logo"
                            width={40}
                            height={40}
                        />
                    )}
                </div>

                {/* Navigation */}
                <ul className="flex-grow">
                    {[
                        { href: "/hr/overview", icon: "mdi:view-dashboard", label: "Overview" },
                        { href: "/hr/jobs", icon: "mdi:briefcase", label: "Job Postings" },
                        { href: "/hr/applicants", icon: "mdi:account-group", label: "Applicants" },
                        { href: "/hr/interview-questions", icon: "mdi:account-question", label: "Interview Questions" },
                        { href: "/hr/analytics", icon: "mdi:chart-bar", label: "Analytics" },
                        { href: "/hr/settings", icon: "mdi:cog", label: "Settings" },
                    ].map(({ href, icon, label }) => (
                        <li key={href} className="py-2">
                            <button
                                onClick={() => router.push(href)}
                                className={`flex items-center font-normal ${isOpen ? "justify-start px-8" : "justify-center px-0"} py-2 hover:bg-[#f05d23] hover:text-white transition duration-300 group relative ${isActive(href)}`}
                            >
                                <Icon
                                    icon={icon}
                                    className={`${isOpen ? "h-8 w-8 mr-2" : "h-6 w-6"} transition`}
                                />
                                {isOpen && <span>{label}</span>}
                                {!isOpen && (
                                    <span className="absolute left-full ml-2 text-xs text-white bg-gray-700 rounded py-1 px-2 opacity-0 group-hover:opacity-75 transition-opacity whitespace-nowrap">
                                        {label}
                                    </span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Logout */}
                {(!isOpen && windowWidth < 640) ? null : (
                    <div
                        className={`flex items-center justify-between px-4 py-4 mt-auto rounded-2xl ${
                            mode === "dark" ? "bg-[#374151]" : "bg-[#d1d5db]"
                        }`}
                    >
                        {isOpen ? (
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full overflow-hidden">
                                        <Image
                                            src="/favicon.png"
                                            alt="Profile"
                                            width={40}
                                            height={40}
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="text-md">{fullName}</span>
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="flex items-center justify-center text-red-500 hover:text-red-600"
                                    aria-label="Logout"
                                >
                                    <ArrowRightStartOnRectangleIcon className="h-8 w-8" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full relative group">
                                <button
                                    onClick={onLogout}
                                    className="flex items-center justify-center text-red-500 hover:text-red-600"
                                    aria-label="Logout"
                                >
                                    <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
                                </button>
                                <span className="absolute left-full ml-2 text-xs text-white bg-gray-700 rounded py-1 px-2 opacity-0 group-hover:opacity-75 transition-opacity whitespace-nowrap">
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
