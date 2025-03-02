// src/components/ExportModal.js
import { useState } from "react";
import { Icon } from "@iconify/react";
import { CSVLink } from "react-csv"; // For CSV export

export default function ExportModal({ isOpen, onClose, candidates, mode }) {
    const [selectedFields, setSelectedFields] = useState({
        full_name: true,
        email: true,
        opening: true,
        score: true,
        status: true,
        phone: false,
        linkedin: false,
    });
    const [exportFormat, setExportFormat] = useState("csv");

    const fields = [
        { label: "Name", key: "full_name" },
        { label: "Email", key: "email" },
        { label: "Opening", key: "opening" },
        { label: "Score", key: "score" },
        { label: "Status", key: "status" },
        { label: "Phone", key: "phone" },
        { label: "LinkedIn", key: "linkedin" },
    ];

    const handleFieldToggle = (key) => {
        setSelectedFields((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const filteredCandidates = candidates.map((candidate) => {
        const filtered = {};
        Object.keys(selectedFields).forEach((key) => {
            if (selectedFields[key]) {
                filtered[key] = candidate[key] || "";
            }
        });
        return filtered;
    });

    const csvHeaders = fields.filter((f) => selectedFields[f.key]).map((f) => ({
        label: f.label,
        key: f.key,
    }));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[100]">
            <div
                className={`rounded-xl max-w-2xl w-full mx-4 shadow-2xl transform transition-all duration-300 animate-fade-in flex flex-col max-h-[80vh] ${
                    mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-[#231812]"
                }`}
            >
                <div className="bg-gradient-to-r from-[#f05d23] to-[#d94f1e] rounded-t-xl p-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Icon icon="mdi:export" className="w-8 h-8 text-white mr-3" />
                        <h2 className="text-2xl font-bold text-white">Export Applicants</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition duration-200"
                    >
                        <Icon icon="mdi:close" width={24} height={24} />
                    </button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-6">
                        <div>
                            <label
                                className={`block text-sm font-medium mb-2 ${
                                    mode === "dark" ? "text-gray-200" : "text-[#231812]"
                                }`}
                            >
                                Select Fields to Export
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {fields.map((field) => (
                                    <label key={field.key} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedFields[field.key]}
                                            onChange={() => handleFieldToggle(field.key)}
                                            className="h-4 w-4 text-[#f05d23] border-gray-300 rounded focus:ring-[#f05d23]"
                                        />
                                        <span
                                            className={`text-sm ${
                                                mode === "dark" ? "text-gray-300" : "text-[#231812]"
                                            }`}
                                        >
                                            {field.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label
                                className={`block text-sm font-medium mb-2 ${
                                    mode === "dark" ? "text-gray-200" : "text-[#231812]"
                                }`}
                            >
                                Export Format
                            </label>
                            <select
                                value={exportFormat}
                                onChange={(e) => setExportFormat(e.target.value)}
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] text-sm ${
                                    mode === "dark"
                                        ? "bg-gray-700 border-gray-600 text-white"
                                        : "bg-gray-50 border-gray-300 text-[#231812]"
                                }`}
                            >
                                <option value="csv">CSV</option>
                                <option value="pdf" disabled>
                                    PDF (Coming Soon)
                                </option>
                            </select>
                        </div>
                        <div>
                            <label
                                className={`block text-sm font-medium mb-2 ${
                                    mode === "dark" ? "text-gray-200" : "text-[#231812]"
                                }`}
                            >
                                Preview (First 3 Rows)
                            </label>
                            <div
                                className={`p-4 rounded-lg border overflow-x-auto ${
                                    mode === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                                }`}
                            >
                                <table className="w-full text-xs">
                                    <thead>
                                    <tr
                                        className={
                                            mode === "dark" ? "bg-gray-600" : "bg-gray-100"
                                        }
                                    >
                                        {csvHeaders.map((header) => (
                                            <th
                                                key={header.key}
                                                className="p-2 text-left font-semibold"
                                            >
                                                {header.label}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredCandidates.slice(0, 3).map((candidate, index) => (
                                        <tr
                                            key={index}
                                            className={`border-b ${
                                                mode === "dark" ? "border-gray-600" : "border-gray-200"
                                            }`}
                                        >
                                            {csvHeaders.map((header) => (
                                                <td key={header.key} className="p-2">
                                                    {candidate[header.key]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={`sticky bottom-0 p-4 border-t rounded-b-xl shadow-md ${
                        mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                    }`}
                >
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className={`px-6 py-2 rounded-full flex items-center gap-2 transition duration-200 shadow-md ${
                                mode === "dark"
                                    ? "bg-gray-700 text-white hover:bg-gray-600"
                                    : "bg-gray-200 text-[#231812] hover:bg-gray-300"
                            }`}
                        >
                            <Icon icon="mdi:close" width={20} height={20} />
                            Cancel
                        </button>
                        <CSVLink
                            data={filteredCandidates}
                            headers={csvHeaders}
                            filename="applicants_export.csv"
                            className={`px-6 py-2 rounded-full flex items-center gap-2 transition duration-200 shadow-md ${
                                mode === "dark"
                                    ? "bg-[#f05d23] text-white hover:bg-[#d94f1e]"
                                    : "bg-[#f05d23] text-white hover:bg-[#d94f1e]"
                            }`}
                        >
                            <Icon icon="mdi:download" width={20} height={20} />
                            Export
                        </CSVLink>
                    </div>
                </div>
            </div>
        </div>
    );
}