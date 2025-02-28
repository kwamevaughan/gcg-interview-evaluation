// src/components/ApplicantsTable.js
import { Icon } from "@iconify/react";

export default function ApplicantsTable({ candidates, mode, onViewCandidate, onSort, sortField, sortDirection }) {
    const getSortIcon = (field) => {
        if (sortField !== field) return <Icon icon="mdi:sort" className="w-4 h-4 ml-1 opacity-50" />;
        return sortDirection === "asc" ? (
            <Icon icon="mdi:sort-ascending" className="w-4 h-4 ml-1" />
        ) : (
            <Icon icon="mdi:sort-descending" className="w-4 h-4 ml-1" />
        );
    };

    const getStatusBadge = (status) => {
        const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
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
        <div className="rounded-lg shadow-lg overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full">
                    <thead className="sticky top-0 z-10">
                    <tr className={`${mode === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-[#231812]"}`}>
                        <th className="p-4 text-left text-sm font-semibold cursor-pointer" onClick={() => onSort("full_name")}>
                            Name {getSortIcon("full_name")}
                        </th>
                        <th className="p-4 text-left text-sm font-semibold cursor-pointer" onClick={() => onSort("email")}>
                            Email {getSortIcon("email")}
                        </th>
                        <th className="p-4 text-left text-sm font-semibold cursor-pointer" onClick={() => onSort("opening")}>
                            Opening {getSortIcon("opening")}
                        </th>
                        <th className="p-4 text-left text-sm font-semibold cursor-pointer" onClick={() => onSort("score")}>
                            Score {getSortIcon("score")}
                        </th>
                        <th className="p-4 text-left text-sm font-semibold cursor-pointer" onClick={() => onSort("status")}>
                            Status {getSortIcon("status")}
                        </th>
                        <th className="p-4 text-left text-sm font-semibold">Actions</th>
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
                                <td className="p-4 text-sm">{candidate.full_name}</td>
                                <td className="p-4 text-sm">{candidate.email}</td>
                                <td className="p-4 text-sm">{candidate.opening}</td>
                                <td className="p-4 text-sm">
                                    {candidate.score}/{candidate.questions.length * 10} ({percentage}%)
                                </td>
                                <td className="p-4 text-sm">{getStatusBadge(candidate.status)}</td>
                                <td className="p-4 text-sm">
                                    <button
                                        onClick={() => onViewCandidate(candidate)}
                                        className="px-3 py-1 bg-[#f05d23] text-white rounded-lg hover:bg-[#d94f1e] transition duration-200 flex items-center gap-2"
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
                {candidates.length === 0 && (
                    <p className={`text-center p-4 italic ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        No applicants available yet.
                    </p>
                )}
            </div>
        </div>
    );
}