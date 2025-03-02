// src/components/ApplicantsFilters.js
import { useState } from "react";
import { Icon } from "@iconify/react";

export default function ApplicantsFilters({ candidates, onFilterChange, mode }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterOpening, setFilterOpening] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");

    const uniqueOpenings = ["all", ...new Set(candidates.map((c) => c.opening))];
    const statuses = ["all", "Pending", "Reviewed", "Shortlisted", "Rejected"];

    const handleFilter = () => {
        onFilterChange({ searchQuery, filterOpening, filterStatus });
    };

    return (
        <div className={`border-t-4 border-[#f05d23] mt-10 mb-6 p-4 rounded-lg shadow-md ${mode === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className={`block text-sm font-medium mb-1 ${mode === "dark" ? "text-gray-300" : "text-[#231812]"}`}>
                        Search
                    </label>
                    <div className="relative">
                        <Icon
                            icon="mdi:magnify"
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#f05d23]"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                handleFilter();
                            }}
                            placeholder="Search by name or email..."
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] ${
                                mode === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-[#231812]"
                            }`}
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <label className={`block text-sm font-medium mb-1 ${mode === "dark" ? "text-gray-300" : "text-[#231812]"}`}>
                        Filter by Opening
                    </label>
                    <select
                        value={filterOpening}
                        onChange={(e) => {
                            setFilterOpening(e.target.value);
                            handleFilter();
                        }}
                        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] ${
                            mode === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-[#231812]"
                        }`}
                    >
                        {uniqueOpenings.map((opening) => (
                            <option key={opening} value={opening}>
                                {opening}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <label className={`block text-sm font-medium mb-1 ${mode === "dark" ? "text-gray-300" : "text-[#231812]"}`}>
                        Filter by Status
                    </label>
                    <select
                        value={filterStatus}
                        onChange={(e) => {
                            setFilterStatus(e.target.value);
                            handleFilter();
                        }}
                        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] ${
                            mode === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-[#231812]"
                        }`}
                    >
                        {statuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}