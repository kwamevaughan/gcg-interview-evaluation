// src/components/ApplicantsTable.js
import { Icon } from "@iconify/react";

export default function ApplicantsTable({ candidates, mode, onViewCandidate, onSort, sortField, sortDirection }) {
    const getSortIcon = (field) => {
        if (sortField !== field) return <Icon icon="mdi:sort" className="w-4 sm:w-5 h-4 sm:h-5 ml-1 opacity-50" />;
        return sortDirection === "asc" ? (
            <Icon icon="mdi:sort-ascending" className="w-4 sm:w-5 h-4 sm:h-5 ml-1" />
        ) : (
            <Icon icon="mdi:sort-descending" className="w-4 sm:w-5 h-4 sm:h-5 ml-1" />
        );
    };

    const getStatusBadge = (status) => {
        const baseStyle = "inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold shadow-sm";
        switch (status) {
            case "Pending":
                return <span className={`${baseStyle} bg-yellow-100 text-yellow-800`}>{status}</span>;
            case "Reviewed":
                return <span className={`${baseStyle} bg-blue-100 text-blue-800`}>{status}</span>;
            case "Shortlisted":
                return <span className={`${baseStyle} bg-green-100 text-green-800`}>{status}</span>;
            case "Rejected":
                return <span className={`${baseStyle} bg-red-100 text-red-800`}>{status}</span>;
            default:
                return <span className={`${baseStyle} bg-gray-100 text-gray-800`}>{status || "Pending"}</span>;
        }
    };

    return (
        <div
            className={`rounded-lg shadow-lg overflow-hidden border-t-4 border-[#f05d23] ${
                mode === "dark" ? "bg-gray-800" : "bg-white"
            }`}
        >
            <div className="max-h-[500px] overflow-y-auto">
                {/* Table for larger screens */}
                <table className="w-full hidden sm:table">
                    <thead className="sticky top-0 z-10">
                    <tr
                        className={`${
                            mode === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-[#231812]"
                        }`}
                    >
                        <th
                            className="p-2 sm:p-5 text-left text-xs sm:text-sm font-semibold cursor-pointer"
                            onClick={() => onSort("full_name")}
                        >
                            Name {getSortIcon("full_name")}
                        </th>
                        <th
                            className="p-2 sm:p-5 text-left text-xs sm:text-sm font-semibold cursor-pointer"
                            onClick={() => onSort("email")}
                        >
                            Email {getSortIcon("email")}
                        </th>
                        <th
                            className="p-2 sm:p-5 text-left text-xs sm:text-sm font-semibold cursor-pointer"
                            onClick={() => onSort("opening")}
                        >
                            Opening {getSortIcon("opening")}
                        </th>
                        <th
                            className="p-2 sm:p-5 text-left text-xs sm:text-sm font-semibold cursor-pointer"
                            onClick={() => onSort("score")}
                        >
                            Score {getSortIcon("score")}
                        </th>
                        <th
                            className="p-2 sm:p-5 text-left text-xs sm:text-sm font-semibold cursor-pointer"
                            onClick={() => onSort("status")}
                        >
                            Status {getSortIcon("status")}
                        </th>
                        <th className="p-2 sm:p-5 text-left text-xs sm:text-sm font-semibold">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {candidates.map((candidate) => {
                        const percentage = candidate.questions.length
                            ? Math.round((candidate.score / (candidate.questions.length * 10)) * 100)
                            : 0;
                        return (
                            <tr
                                key={candidate.id}
                                className={`border-b hover:bg-opacity-80 transition duration-200 ${
                                    mode === "dark"
                                        ? "border-gray-700 hover:bg-gray-700 text-white"
                                        : "border-gray-200 hover:bg-gray-50 text-[#231812]"
                                }`}
                            >
                                <td className="p-2 sm:p-5 text-xs sm:text-base">{candidate.full_name}</td>
                                <td className="p-2 sm:p-5 text-xs sm:text-base">{candidate.email}</td>
                                <td className="p-2 sm:p-5 text-xs sm:text-base">{candidate.opening}</td>
                                <td className="p-2 sm:p-5 text-xs sm:text-base">
                                    {candidate.score}/{candidate.questions.length * 10} ({percentage}%)
                                </td>
                                <td className="p-2 sm:p-5 text-xs sm:text-base">
                                    {getStatusBadge(candidate.status)}
                                </td>
                                <td className="p-2 sm:p-5 text-xs sm:text-base">
                                    <button
                                        onClick={() => onViewCandidate(candidate)}
                                        className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full flex items-center gap-1 sm:gap-2 transition duration-200 shadow-md text-xs sm:text-base ${
                                            mode === "dark"
                                                ? "bg-gray-700 text-[#f05d23] hover:bg-gray-600"
                                                : "bg-gray-200 text-[#f05d23] hover:bg-gray-300"
                                        }`}
                                    >
                                        <Icon icon="mdi:eye" width={16} height={16} />
                                        View
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                {/* Card layout for mobile */}
                <div className="sm:hidden space-y-4 p-2">
                    {candidates.map((candidate) => {
                        const percentage = candidate.questions.length
                            ? Math.round((candidate.score / (candidate.questions.length * 10)) * 100)
                            : 0;
                        return (
                            <div
                                key={candidate.id}
                                className={`p-3 rounded-lg border ${
                                    mode === "dark"
                                        ? "bg-gray-700 border-gray-600 text-gray-300"
                                        : "bg-gray-50 border-gray-200 text-gray-800"
                                }`}
                            >
                                <div className="text-sm font-semibold mb-1">{candidate.full_name}</div>
                                <div className="text-xs mb-1">
                                    <span className="font-medium">Email:</span> {candidate.email}
                                </div>
                                <div className="text-xs mb-1">
                                    <span className="font-medium">Opening:</span> {candidate.opening}
                                </div>
                                <div className="text-xs mb-1">
                                    <span className="font-medium">Score:</span>{" "}
                                    {candidate.score}/{candidate.questions.length * 10} ({percentage}%)
                                </div>
                                <div className="text-xs mb-2">{getStatusBadge(candidate.status)}</div>
                                <div className="flex justify-start">
                                    <button
                                        onClick={() => onViewCandidate(candidate)}
                                        className={`px-2 py-1 rounded-full flex items-center gap-1 transition duration-200 shadow-md text-xs ${
                                            mode === "dark"
                                                ? "bg-gray-700 text-[#f05d23] hover:bg-gray-600"
                                                : "bg-gray-200 text-[#f05d23] hover:bg-gray-300"
                                        }`}
                                    >
                                        <Icon icon="mdi:eye" width={14} height={14} />
                                        View
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* No candidates message */}
                {candidates.length === 0 && (
                    <p
                        className={`text-center p-4 italic ${
                            mode === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                    >
                        No applicants available yet.
                    </p>
                )}
            </div>
        </div>
    );
}