// src/pages/hr/overview.js
import { useState } from "react";
import HRSidebar from "@/layouts/hrSidebar";
import HRHeader from "@/layouts/hrHeader";
import { Toaster } from "react-hot-toast";

export default function HROverview({ mode = "light", toggleMode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("hr_session");
        // Add logout logic here if needed
    };

    return (
        <div
            className={`min-h-screen flex flex-col ${
                mode === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-gray-50 to-gray-100"
            }`}
        >
            <Toaster position="top-right" reverseOrder={false} />
            <HRHeader mode={mode} toggleMode={toggleMode} onLogout={handleLogout} />
            <div className="flex flex-1">
                <HRSidebar
                    isOpen={isSidebarOpen}
                    mode={mode}
                    onLogout={handleLogout}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <div
                    className={`flex-1 p-6 transition-all duration-300 ${
                        isSidebarOpen ? "md:ml-[300px]" : "md:ml-[80px]"
                    }`}
                >
                    <h3 className={`text-xl font-bold mb-4 ${mode === "dark" ? "text-white" : "text-[#231812]"}`}>
                        Overview
                    </h3>
                    <p className={`${mode === "dark" ? "text-gray-300" : "text-[#231812]"}`}>
                        Placeholder for HR dashboard reports coming soon...
                    </p>
                </div>
            </div>
            <footer
                className={`p-4 text-center text-sm shadow-inner ${
                    mode === "dark" ? "bg-gray-900 text-gray-400" : "bg-white text-gray-500"
                }`}
            >
                © {new Date().getFullYear()} Growthpad Consulting Group. All rights reserved.
            </footer>
        </div>
    );
}