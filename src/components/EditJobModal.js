// src/components/EditJobModal.js
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

export default function EditJobModal({ isOpen, job, onClose, onSave, mode, onPreview }) {
    const [editJob, setEditJob] = useState(job || {});

    useEffect(() => {
        if (job) {
            setEditJob(job);
        }
    }, [job]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Updating job opening...");

        let fileUrl = editJob.file_url;
        let fileId = editJob.file_id;

        if (editJob.newFile) {
            const fileData = await fileToBase64(editJob.newFile);
            const fileType = editJob.newFile.name.split(".").pop().toLowerCase();
            const response = await fetch("/api/upload-job-file", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileData: fileData.split(",")[1], fileType }),
            });
            const result = await response.json();
            if (!response.ok || result.error) {
                toast.error("Failed to upload new file.", { id: toastId });
                return;
            }
            fileUrl = result.url;
            fileId = result.fileId;
        } else if (editJob.removeFile) {
            fileUrl = null;
            fileId = null;
        }

        const updatedJobData = {
            title: editJob.title,
            description: editJob.description || null,
            file_url: fileUrl,
            file_id: fileId,
            expires_on: editJob.expires_on,
            is_expired: new Date(editJob.expires_on) < new Date(),
        };

        const { error } = await supabase
            .from("job_openings")
            .update(updatedJobData)
            .eq("id", editJob.id);

        if (error) {
            toast.error("Failed to update job opening.", { id: toastId });
            console.error("Update error:", error);
        } else {
            toast.success("Job opening updated successfully!", { icon: "✅", id: toastId });
            onSave(updatedJobData);
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleDateClick = (e) => {
        e.preventDefault();
        const input = e.currentTarget.querySelector("input[type='date']");
        input.showPicker();
    };

    const handlePreviewClick = (e, url) => {
        e.preventDefault();
        e.stopPropagation();
        if (url) {
            onPreview(url); // Pass the raw file_url as stored in editJob.file_url
        } else {
            toast.error("No file available to preview.");
        }
    };

    if (!isOpen || !editJob) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div
                className={`rounded-xl shadow-2xl transform transition-all duration-300 animate-fade-in w-full max-w-3xl mx-4 flex flex-col max-h-[90vh] overflow-hidden ${
                    mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-[#231812]"
                }`}
            >
                <div className="bg-gradient-to-r from-[#f05d23] to-[#d94f1e] rounded-t-xl p-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Icon icon="mdi:briefcase" className="w-8 h-8 text-white mr-3" />
                        <h2 className="text-2xl font-bold text-white">Edit Job Opening</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition duration-200"
                    >
                        <Icon icon="mdi:close" width={24} height={24} />
                    </button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                className={`block text-sm font-medium mb-2 ${
                                    mode === "dark" ? "text-gray-200" : "text-[#231812]"
                                }`}
                            >
                                Job Title <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Icon
                                    icon="mdi:format-title"
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#f05d23]"
                                />
                                <input
                                    type="text"
                                    value={editJob.title || ""}
                                    onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] ${
                                        mode === "dark"
                                            ? "bg-gray-700 text-gray-200 border-gray-600"
                                            : "bg-gray-50 text-[#231812] border-gray-300"
                                    }`}
                                    placeholder="e.g., Software Engineer"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label
                                className={`block text-sm font-medium mb-2 ${
                                    mode === "dark" ? "text-gray-200" : "text-[#231812]"
                                }`}
                            >
                                Description (Optional)
                            </label>
                            <textarea
                                value={editJob.description || ""}
                                onChange={(e) => setEditJob({ ...editJob, description: e.target.value })}
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] min-h-[100px] ${
                                    mode === "dark"
                                        ? "bg-gray-700 text-gray-200 border-gray-600"
                                        : "bg-gray-50 text-[#231812] border-gray-300"
                                }`}
                                placeholder="Enter job description..."
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    className={`block text-sm font-medium mb-2 ${
                                        mode === "dark" ? "text-gray-200" : "text-[#231812]"
                                    }`}
                                >
                                    Job Description File (DOCX/PDF, Optional)
                                </label>
                                <div className="relative">
                                    <Icon
                                        icon="mdi:file-upload"
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#f05d23]"
                                    />
                                    <input
                                        type="file"
                                        accept=".pdf,.docx"
                                        onChange={(e) =>
                                            setEditJob({ ...editJob, newFile: e.target.files[0], removeFile: false })
                                        }
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                                            mode === "dark"
                                                ? "bg-gray-700 text-gray-200 border-gray-600"
                                                : "bg-gray-50 text-[#231812] border-gray-300"
                                        }`}
                                    />
                                </div>
                                {editJob.file_url && !editJob.newFile && !editJob.removeFile && (
                                    <div
                                        className={`mt-2 flex items-center justify-between p-2 border rounded-lg shadow-sm ${
                                            mode === "dark"
                                                ? "bg-gray-700 border-gray-600 text-gray-300"
                                                : "bg-gray-50 border-gray-200 text-gray-600"
                                        } hover:bg-opacity-80 transition duration-200`}
                                    >
                                        <span className="truncate flex-1">
                                            Job Description - {editJob.title}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => handlePreviewClick(e, editJob.file_url)}
                                                className="text-[#f05d23] hover:text-[#d94f1e] flex items-center gap-1"
                                                title="View file"
                                            >
                                                <Icon icon="mdi:eye" width={16} height={16} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditJob({ ...editJob, removeFile: true, newFile: null });
                                                }}
                                                className="text-red-500 hover:text-red-600 flex items-center gap-1"
                                                title="Remove file"
                                            >
                                                <Icon icon="mdi:trash-can" width={16} height={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {editJob.newFile && (
                                    <div
                                        className={`mt-2 flex items-center justify-between p-2 border rounded-lg shadow-sm ${
                                            mode === "dark"
                                                ? "bg-gray-700 border-gray-600 text-gray-300"
                                                : "bg-gray-50 border-gray-200 text-gray-600"
                                        } hover:bg-opacity-80 transition duration-200`}
                                    >
                                        <span className="truncate flex-1">{editJob.newFile.name}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditJob({ ...editJob, newFile: null });
                                            }}
                                            className="text-red-500 hover:text-red-600 flex items-center gap-1"
                                            title="Remove new file"
                                        >
                                            <Icon icon="mdi:trash-can" width={16} height={16} />
                                        </button>
                                    </div>
                                )}
                                {editJob.removeFile && (
                                    <p className="mt-2 text-sm text-red-500">File will be removed on save.</p>
                                )}
                            </div>
                            <div>
                                <label
                                    className={`block text-sm font-medium mb-2 ${
                                        mode === "dark" ? "text-gray-200" : "text-[#231812]"
                                    }`}
                                >
                                    Expires On <span className="text-red-500">*</span>
                                </label>
                                <div
                                    className="relative flex items-center cursor-pointer"
                                    onClick={handleDateClick}
                                >
                                    <Icon
                                        icon="mdi:calendar"
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#f05d23]"
                                    />
                                    <input
                                        type="date"
                                        value={editJob.expires_on ? editJob.expires_on.split("T")[0] : ""}
                                        onChange={(e) =>
                                            setEditJob({ ...editJob, expires_on: e.target.value })
                                        }
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] ${
                                            mode === "dark"
                                                ? "bg-gray-700 text-gray-200 border-gray-600"
                                                : "bg-gray-50 text-[#231812] border-gray-300"
                                        }`}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div
                    className={`sticky bottom-0 p-4 border-t rounded-b-xl shadow-md ${
                        mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                    }`}
                >
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className={`px-6 py-2 rounded-full transition duration-200 flex items-center gap-2 shadow-md ${
                                mode === "dark"
                                    ? "bg-gray-600 text-white hover:bg-gray-500"
                                    : "bg-gray-200 text-[#231812] hover:bg-gray-300"
                            }`}
                        >
                            <Icon icon="mdi:close" width={20} height={20} />
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-[#f05d23] text-white rounded-full hover:bg-[#d94f1e] transition duration-200 flex items-center gap-2 shadow-md"
                        >
                            <Icon icon="mdi:content-save" width={20} height={20} />
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}