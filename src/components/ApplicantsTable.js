// src/components/ApplicantsTable.js
import { useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

export default function ApplicantsTable({
                                            candidates,
                                            mode,
                                            onViewCandidate,
                                            onDeleteCandidate,
                                            onSort,
                                            sortField,
                                            sortDirection,
                                            selectedIds,
                                            setSelectedIds,
                                            handleBulkDelete,
                                            setIsExportModalOpen,
                                        }) {
    const [visibleColumns, setVisibleColumns] = useState({
        full_name: true,
        email: true,
        opening: true,
        score: true,
        status: true,
        phone: false,
        linkedin: false,
    });

    const allColumns = [
        { key: "full_name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "opening", label: "Opening" },
        { key: "score", label: "Score" },
        { key: "status", label: "Status" },
        { key: "phone", label: "Phone" },
        { key: "linkedin", label: "LinkedIn" },
    ];

    const getSortIcon = (field) => {
        if (sortField !== field)
            return <Icon icon="mdi:sort" className="w-4 sm:w-5 h-4 sm:h-5 ml-1 opacity-50" />;
        return sortDirection === "asc" ? (
            <Icon icon="mdi:sort-ascending" className="w-4 sm:w-5 h-4 sm:h-5 ml-1" />
        ) : (
            <Icon icon="mdi:sort-descending" className="w-4 sm:w-5 h-4 sm:h-5 ml-1" />
        );
    };

    const getStatusBadge = (status) => {
        const baseStyle =
            "inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold shadow-sm";
        switch (status) {
            case "Pending":
                return <span className={`${baseStyle} bg-yellow-100 text-yellow-800`}>{status}</span>;
            case "Reviewed":
                return <span className={`${baseStyle} bg-[#f05d23] text-white`}>{status}</span>; // Use brand color
            case "Shortlisted":
                return <span className={`${baseStyle} bg-green-100 text-green-800`}>{status}</span>;
            case "Rejected":
                return <span className={`${baseStyle} bg-red-100 text-red-800`}>{status}</span>;
            default:
                return <span className={`${baseStyle} bg-gray-100 text-gray-800`}>{status || "Pending"}</span>;
        }
    };

    const handleToggleColumn = (key) => {
        setVisibleColumns((prev) => {
            const newState = { ...prev, [key]: !prev[key] };
            const visibleCount = Object.values(newState).filter(Boolean).length;
            if (visibleCount === 0) {
                toast.error("At least one column must be visible!", { icon: "⚠️" });
                return prev;
            }
            toast.success(`${newState[key] ? "Show" : "Hide"} ${allColumns.find((c) => c.key === key).label}`, {
                icon: "✅",
            });
            return newState;
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(candidates.map((c) => c.id));
            toast.success(`Selected all ${candidates.length} candidates`, { icon: "✅" });
        } else {
            setSelectedIds([]);
            toast.success("Cleared selection", { icon: "✅" });
        }
    };

    const handleSelectRow = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    return (
        <div
            className={`rounded-lg shadow-lg overflow-hidden border-t-4 border-[#f05d23] ${
                mode === "dark" ? "bg-gray-800" : "bg-white"
            }`}
        >
            <div className="flex flex-col sm:flex-row justify-between items-center p-2 gap-4">
                {selectedIds.length > 0 && (
                    <button
                        onClick={handleBulkDelete}
                        className={`px-4 py-2 rounded-full flex items-center gap-2 transition duration-200 shadow-md ${
                            mode === "dark"
                                ? "bg-red-700 text-white hover:bg-red-600"
                                : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                    >
                        <Icon icon="mdi:trash-can" width={20} height={20} />
                        Delete Selected ({selectedIds.length})
                    </button>
                )}
                <div className="flex items-center gap-4 ml-auto">
                    <div className="relative group">
                        <button
                            className={`px-4 py-2 rounded-full flex items-center gap-2 transition duration-200 shadow-md ${
                                mode === "dark"
                                    ? "bg-gray-700 text-[#f05d23] hover:bg-gray-600"
                                    : "bg-gray-200 text-[#f05d23] hover:bg-gray-300"
                            }`}
                        >
                            <Icon icon="mdi:table-column" width={20} height={20} />
                            Columns
                        </button>
                        <div className="absolute right-0 top-full mt-0 w-48 hidden group-hover:flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                            {allColumns.map((col) => (
                                <label
                                    key={col.key}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={visibleColumns[col.key]}
                                        onChange={() => handleToggleColumn(col.key)}
                                        className="h-4 w-4 text-[#f05d23] border-gray-300 rounded focus:ring-[#f05d23]"
                                    />
                                    <span
                                        className={`text-sm ${
                                            mode === "dark" ? "text-gray-300" : "text-[#231812]"
                                        }`}
                                    >
                                        {col.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={() => setIsExportModalOpen(true)}
                        className={`px-4 py-2 rounded-full flex items-center gap-2 transition duration-200 shadow-md ${
                            mode === "dark"
                                ? "bg-[#f05d23] text-white hover:bg-[#d94f1e]"
                                : "bg-[#f05d23] text-white hover:bg-[#d94f1e]"
                        }`}
                    >
                        <Icon icon="mdi:export" width={20} height={20} />
                        Export
                    </button>
                </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#f05d23] scrollbar-track-gray-200">
                <table className="w-full hidden sm:table">
                    <thead className="sticky top-0 z-10">
                    <tr
                        className={`${
                            mode === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-[#231812]"
                        }`}
                    >
                        <th className="p-2 sm:p-5">
                            <input
                                type="checkbox"
                                checked={selectedIds.length === candidates.length && candidates.length > 0}
                                onChange={handleSelectAll}
                                className="h-4 w-4 text-[#f05d23] border-gray-300 rounded focus:ring-[#f05d23]"
                            />
                        </th>
                        {allColumns.map(
                            (col) =>
                                visibleColumns[col.key] && (
                                    <th
                                        key={col.key}
                                        className="p-2 sm:p-5 text-left text-xs sm:text-sm font-semibold cursor-pointer"
                                        onClick={() => onSort(col.key)}
                                    >
                                            <span className="inline-flex items-center">
                                                {col.label} {getSortIcon(col.key)}
                                            </span>
                                    </th>
                                )
                        )}
                        <th className="p-2 sm:p-5 text-left text-xs sm:text-sm font-semibold">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {candidates.map((candidate, index) => {
                        const percentage = candidate.questions.length
                            ? Math.round((candidate.score / (candidate.questions.length * 10)) * 100)
                            : 0;
                        return (
                            <tr
                                key={candidate.id}
                                className={`border-b hover:bg-opacity-80 transition duration-200 animate-fade-in ${
                                    index % 2 === 0
                                        ? mode === "dark"
                                            ? "bg-gray-900"
                                            : "bg-gray-50"
                                        : mode === "dark"
                                            ? "bg-gray-800"
                                            : "bg-white"
                                } ${
                                    mode === "dark"
                                        ? "border-gray-700 hover:bg-gray-700 text-white"
                                        : "border-gray-200 hover:bg-gray-100 text-[#231812]"
                                }`}
                            >
                                <td className="p-2 sm:p-5">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(candidate.id)}
                                        onChange={() => handleSelectRow(candidate.id)}
                                        className="h-4 w-4 text-[#f05d23] border-gray-300 rounded focus:ring-[#f05d23]"
                                    />
                                </td>
                                {visibleColumns.full_name && (
                                    <td className="p-2 sm:p-5 text-xs sm:text-base">
                                        {candidate.full_name}
                                    </td>
                                )}
                                {visibleColumns.email && (
                                    <td className="p-2 sm:p-5 text-xs sm:text-base">{candidate.email}</td>
                                )}
                                {visibleColumns.opening && (
                                    <td className="p-2 sm:p-5 text-xs sm:text-base">
                                        {candidate.opening}
                                    </td>
                                )}
                                {visibleColumns.score && (
                                    <td className="p-2 sm:p-5 text-xs sm:text-base">
                                        {candidate.score}/{candidate.questions.length * 10} ({percentage}%)
                                    </td>
                                )}
                                {visibleColumns.status && (
                                    <td className="p-2 sm:p-5 text-xs sm:text-base">
                                        {getStatusBadge(candidate.status)}
                                    </td>
                                )}
                                {visibleColumns.phone && (
                                    <td className="p-2 sm:p-5 text-xs sm:text-base">{candidate.phone || "-"}</td>
                                )}
                                {visibleColumns.linkedin && (
                                    <td className="p-2 sm:p-5 text-xs sm:text-base">
                                        {candidate.linkedin || "-"}
                                    </td>
                                )}
                                <td className="p-2 sm:p-5 text-xs sm:text-base flex flex-col sm:flex-row gap-2">
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
                                    <button
                                        onClick={() => onDeleteCandidate(candidate.id)}
                                        className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full flex items-center gap-1 sm:gap-2 transition duration-200 shadow-md text-xs sm:text-base ${
                                            mode === "dark"
                                                ? "bg-red-700 text-white hover:bg-red-600"
                                                : "bg-red-500 text-white hover:bg-red-600"
                                        }`}
                                    >
                                        <Icon icon="mdi:trash-can" width={16} height={16} />
                                        Delete
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
                                className={`p-3 rounded-lg border animate-fade-in ${
                                    mode === "dark"
                                        ? "bg-gray-700 border-gray-600 text-gray-300"
                                        : "bg-gray-50 border-gray-200 text-gray-800"
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(candidate.id)}
                                        onChange={() => handleSelectRow(candidate.id)}
                                        className="h-4 w-4 text-[#f05d23] border-gray-300 rounded focus:ring-[#f05d23]"
                                    />
                                    {visibleColumns.full_name && (
                                        <div className="text-sm font-semibold">
                                            {candidate.full_name}
                                        </div>
                                    )}
                                </div>
                                {visibleColumns.email && (
                                    <div className="text-xs mb-1">
                                        <span className="font-medium">Email:</span> {candidate.email}
                                    </div>
                                )}
                                {visibleColumns.opening && (
                                    <div className="text-xs mb-1">
                                        <span className="font-medium">Opening:</span> {candidate.opening}
                                    </div>
                                )}
                                {visibleColumns.score && (
                                    <div className="text-xs mb-1">
                                        <span className="font-medium">Score:</span>{" "}
                                        {candidate.score}/{candidate.questions.length * 10} ({percentage}%)
                                    </div>
                                )}
                                {visibleColumns.status && (
                                    <div className="text-xs mb-2">{getStatusBadge(candidate.status)}</div>
                                )}
                                {visibleColumns.phone && (
                                    <div className="text-xs mb-1">
                                        <span className="font-medium">Phone:</span> {candidate.phone || "-"}
                                    </div>
                                )}
                                {visibleColumns.linkedin && (
                                    <div className="text-xs mb-1">
                                        <span className="font-medium">LinkedIn:</span>{" "}
                                        {candidate.linkedin || "-"}
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-2">
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
                                    <button
                                        onClick={() => onDeleteCandidate(candidate.id)}
                                        className={`px-2 py-1 rounded-full flex items-center gap-1 transition duration-200 shadow-md text-xs ${
                                            mode === "dark"
                                                ? "bg-red-700 text-white hover:bg-red-600"
                                                : "bg-red-500 text-white hover:bg-red-600"
                                        }`}
                                    >
                                        <Icon icon="mdi:trash-can" width={14} height={14} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

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