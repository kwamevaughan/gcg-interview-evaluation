// src/components/ExportModal.js
import { useState } from "react";
import { Icon } from "@iconify/react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

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
    const [previewRows, setPreviewRows] = useState(3);
    const [fieldsOrder, setFieldsOrder] = useState([
        { label: "Name", key: "full_name", icon: "mdi:account" },
        { label: "Email", key: "email", icon: "mdi:email" },
        { label: "Opening", key: "opening", icon: "mdi:briefcase" },
        { label: "Score", key: "score", icon: "mdi:star" },
        { label: "Status", key: "status", icon: "mdi:tag" },
        { label: "Phone", key: "phone", icon: "mdi:phone" },
        { label: "LinkedIn", key: "linkedin", icon: "mdi:linkedin" },
    ]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [dateRange, setDateRange] = useState([
        {
            startDate: null,
            endDate: null,
            key: "selection",
        },
    ]);

    const statuses = ["all", "Pending", "Reviewed", "Shortlisted", "Rejected"];

    // Fallback static ranges if defaultStaticRanges is unavailable
    const fallbackStaticRanges = [
        {
            label: "All Time",
            range: () => ({ startDate: null, endDate: null }),
            isSelected: () => !dateRange[0].startDate,
        },
        {
            label: "Today",
            range: () => {
                const today = new Date();
                return { startDate: today, endDate: today };
            },
            isSelected: (range) =>
                range.startDate?.toDateString() === new Date().toDateString() &&
                range.endDate?.toDateString() === new Date().toDateString(),
        },
        {
            label: "Last 7 Days",
            range: () => {
                const end = new Date();
                const start = new Date();
                start.setDate(end.getDate() - 6);
                return { startDate: start, endDate: end };
            },
            isSelected: (range) => {
                const end = new Date();
                const start = new Date();
                start.setDate(end.getDate() - 6);
                return (
                    range.startDate?.toDateString() === start.toDateString() &&
                    range.endDate?.toDateString() === end.toDateString()
                );
            },
        },
    ];

    const handleFieldToggle = (key) => {
        setSelectedFields((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSelectAll = () => {
        setSelectedFields(Object.fromEntries(fieldsOrder.map((f) => [f.key, true])));
        toast.success("All fields selected", { icon: "✅" });
    };

    const handleSelectNone = () => {
        setSelectedFields(Object.fromEntries(fieldsOrder.map((f) => [f.key, false])));
        toast.success("All fields deselected", { icon: "✅" });
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const reorderedFields = Array.from(fieldsOrder);
        const [movedField] = reorderedFields.splice(result.source.index, 1);
        reorderedFields.splice(result.destination.index, 0, movedField);
        setFieldsOrder(reorderedFields);
        toast.success("Fields reordered", { icon: "✅" });
    };

    const filteredCandidates = candidates
        .filter((candidate) => {
            if (filterStatus !== "all") {
                return (candidate.status || "Pending") === filterStatus;
            }
            return true;
        })
        .filter((candidate) => {
            if (!dateRange[0].startDate || !dateRange[0].endDate) return true;
            const submittedAt = new Date(candidate.submitted_at || "Invalid Date");
            return (
                submittedAt >= dateRange[0].startDate && submittedAt <= dateRange[0].endDate
            );
        })
        .map((candidate) => {
            const filtered = {};
            Object.keys(selectedFields).forEach((key) => {
                if (selectedFields[key]) {
                    filtered[key] = candidate[key] || "";
                }
            });
            return filtered;
        });

    const csvHeaders = fieldsOrder.filter((f) => selectedFields[f.key]).map((f) => ({
        label: f.label,
        key: f.key,
    }));

    const exportPDF = () => {
        const selectedKeys = fieldsOrder.filter((f) => selectedFields[f.key]).map((f) => f.key);
        if (selectedKeys.length === 0) {
            toast.error("Please select at least one field to export!", { icon: "⚠️" });
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Applicants Export", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);

        autoTable(doc, {
            head: [selectedKeys.map((key) => fieldsOrder.find((f) => f.key === key).label)],
            body: filteredCandidates.map((candidate) =>
                selectedKeys.map((key) => candidate[key] || "-")
            ),
            startY: 30,
            theme: "striped",
            headStyles: { fillColor: [240, 93, 35] }, // #f05d23
            styles: { textColor: mode === "dark" ? 255 : 35 },
        });

        doc.save("applicants_export.pdf");
        toast.success("PDF exported successfully!", { icon: "✅" });
    };

    const handleExportClick = () => {
        if (Object.values(selectedFields).every((v) => !v)) {
            toast.error("Please select at least one field to export!", { icon: "⚠️" });
            return false;
        }
        toast.success("CSV exported successfully!", { icon: "✅" });
    };

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
                <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-[#f05d23] scrollbar-track-gray-200">
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label
                                    className={`block text-sm font-medium ${
                                        mode === "dark" ? "text-gray-200" : "text-[#231812]"
                                    }`}
                                >
                                    Select Fields to Export
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSelectAll}
                                        className={`text-xs px-2 py-1 rounded-full ${
                                            mode === "dark"
                                                ? "bg-gray-700 text-[#f05d23] hover:bg-gray-600"
                                                : "bg-gray-200 text-[#f05d23] hover:bg-gray-300"
                                        }`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={handleSelectNone}
                                        className={`text-xs px-2 py-1 rounded-full ${
                                            mode === "dark"
                                                ? "bg-gray-700 text-[#f05d23] hover:bg-gray-600"
                                                : "bg-gray-200 text-[#f05d23] hover:bg-gray-300"
                                        }`}
                                    >
                                        None
                                    </button>
                                </div>
                            </div>
                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="fields">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="grid grid-cols-2 gap-4"
                                        >
                                            {fieldsOrder.map((field, index) => (
                                                <Draggable
                                                    key={field.key}
                                                    draggableId={field.key}
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <label
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="flex items-center gap-2 animate-fade-in bg-gray-100 dark:bg-gray-700 p-2 rounded-lg cursor-move"
                                                        >
                                                            <Icon
                                                                icon="mdi:drag"
                                                                className="w-4 h-4 text-[#f05d23]"
                                                            />
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedFields[field.key]}
                                                                onChange={() => handleFieldToggle(field.key)}
                                                                className="h-4 w-4 text-[#f05d23] border-gray-300 rounded focus:ring-[#f05d23]"
                                                            />
                                                            <Icon
                                                                icon={field.icon}
                                                                className="w-4 h-4 text-[#f05d23]"
                                                            />
                                                            <span
                                                                className={`text-sm ${
                                                                    mode === "dark"
                                                                        ? "text-gray-300"
                                                                        : "text-[#231812]"
                                                                }`}
                                                            >
                                                                {field.label}
                                                            </span>
                                                        </label>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                        <div>
                            <label
                                className={`block text-sm font-medium mb-2 ${
                                    mode === "dark" ? "text-gray-200" : "text-[#231812]"
                                }`}
                            >
                                Filter by Status
                            </label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] text-sm ${
                                    mode === "dark"
                                        ? "bg-gray-700 border-gray-600 text-white"
                                        : "bg-gray-50 border-gray-300 text-[#231812]"
                                }`}
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label
                                className={`block text-sm font-medium mb-2 ${
                                    mode === "dark" ? "text-gray-200" : "text-[#231812]"
                                }`}
                            >
                                Filter by Date Range
                            </label>
                            <DateRangePicker
                                ranges={dateRange}
                                onChange={(item) => setDateRange([item.selection])}
                                className="w-full"
                                inputRanges={[]}
                                staticRanges={fallbackStaticRanges} // Use fallback
                            />
                        </div>
                        <div>
                            <label
                                className={`block text-sm font-medium mb-2 ${
                                    mode === "dark" ? "text-gray-200" : "text-[#231812]"
                                }`}
                            >
                                Preview Rows
                            </label>
                            <select
                                value={previewRows}
                                onChange={(e) => setPreviewRows(Number(e.target.value))}
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] text-sm ${
                                    mode === "dark"
                                        ? "bg-gray-700 border-gray-600 text-white"
                                        : "bg-gray-50 border-gray-300 text-[#231812]"
                                }`}
                            >
                                <option value={3}>3 Rows</option>
                                <option value={5}>5 Rows</option>
                                <option value={10}>10 Rows</option>
                            </select>
                            <div
                                className={`mt-2 p-4 rounded-lg border max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#f05d23] scrollbar-track-gray-200 ${
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
                                    {filteredCandidates.slice(0, previewRows).map((candidate, index) => (
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
                            className={`px-6 py-2 rounded-full flex items-center gap-2 transition duration-200 shadow-md hover:shadow-lg ${
                                mode === "dark"
                                    ? "bg-gray-700 text-white hover:bg-gray-600"
                                    : "bg-gray-200 text-[#231812] hover:bg-gray-300"
                            }`}
                        >
                            <Icon icon="mdi:close" width={20} height={20} />
                            Cancel
                        </button>
                        {exportFormat === "csv" ? (
                            <CSVLink
                                data={filteredCandidates}
                                headers={csvHeaders}
                                filename="applicants_export.csv"
                                onClick={handleExportClick}
                                className={`px-6 py-2 rounded-full flex items-center gap-2 transition duration-200 shadow-md hover:shadow-lg ${
                                    mode === "dark"
                                        ? "bg-[#f05d23] text-white hover:bg-[#d94f1e]"
                                        : "bg-[#f05d23] text-white hover:bg-[#d94f1e]"
                                }`}
                            >
                                <Icon icon="mdi:download" width={20} height={20} />
                                Export CSV
                            </CSVLink>
                        ) : (
                            <button
                                onClick={exportPDF}
                                className={`px-6 py-2 rounded-full flex items-center gap-2 transition duration-200 shadow-md hover:shadow-lg ${
                                    mode === "dark"
                                        ? "bg-[#f05d23] text-white hover:bg-[#d94f1e]"
                                        : "bg-[#f05d23] text-white hover:bg-[#d94f1e]"
                                }`}
                            >
                                <Icon icon="mdi:download" width={20} height={20} />
                                Export PDF
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}