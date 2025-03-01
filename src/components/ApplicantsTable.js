// src/components/ApplicantsTable.js
import { Icon } from "@iconify/react";

export default function ApplicantsTable({ candidates, mode, onViewCandidate, onSort, sortField, sortDirection }) {
    const getSortIcon = (field) => {
        if (sortField !== field) return <Icon icon="mdi:sort" className="w-5 h-5 ml-1 opacity-50" />;
        return sortDirection === "asc" ? (
            <Icon icon="mdi:sort-ascending" className="w-5 h-5 ml-1" />
        ) : (
            <Icon icon="mdi:sort-descending" className="w-5 h-5 ml-1" />
        );
    };

    const getStatusBadge = (status) => {
        const baseStyle = "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold shadow-sm";
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
        <div className="rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full">
                    <thead className="sticky top-0 z-10">
                    <tr className={`${mode === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-[#231812]"}`}>
                        <th
                            className="p-5 text-left text-sm font-semibold cursor-pointer"
                            onClick={() => onSort("full_name")}
                        >
                            Name {getSortIcon("full_name")}
                        </th>
                        <th
                            className="p-5 text-left text-sm font-semibold cursor-pointer"
                            onClick={() => onSort("email")}
                        >
                            Email {getSortIcon("email")}
                        </th>
                        <th
                            className="p-5 text-left text-sm font-semibold cursor-pointer"
                            onClick={() => onSort("opening")}
                        >
                            Opening {getSortIcon("opening")}
                        </th>
                        <th
                            className="p-5 text-left text-sm font-semibold cursor-pointer"
                            onClick={() => onSort("score")}
                        >
                            Score {getSortIcon("score")}
                        </th>
                        <th
                            className="p-5 text-left text-sm font-semibold cursor-pointer"
                            onClick={() => onSort("status")}
                        >
                            Status {getSortIcon("status")}
                        </th>
                        <th className="p-5 text-left text-sm font-semibold">Actions</th>
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
                                <td className="p-5 text-base">{candidate.full_name}</td>
                                <td className="p-5 text-base">{candidate.email}</td>
                                <td className="p-5 text-base">{candidate.opening}</td>
                                <td className="p-5 text-base">
                                    {candidate.score}/{candidate.questions.length * 10} ({percentage}%)
                                </td>
                                <td className="p-5 text-base">{getStatusBadge(candidate.status)}</td>
                                <td className="p-5 text-base">
                                    <button
                                        onClick={() => onViewCandidate(candidate)}
                                        className={`px-4 py-2 rounded-full flex items-center gap-2 transition duration-200 shadow-md ${
                                            mode === "dark"
                                                ? "bg-gray-700 text-[#f05d23] hover:bg-gray-600"
                                                : "bg-gray-200 text-[#f05d23] hover:bg-gray-300"
                                        }`}
                                    >
                                        <Icon icon="mdi:eye" width={20} height={20} />
                                        View
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                {candidates.length === 0 && (
                    <p className={`text-center p-5 italic ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        No applicants available yet.
                    </p>
                )}
            </div>
        </div>
    );
}