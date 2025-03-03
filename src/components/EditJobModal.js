// src/components/EditJobModal.js
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TiptapToolbar from "./TiptapToolbar";

export default function EditJobModal({ isOpen, job, onClose, onSave, mode, onPreview }) {
    const [editJob, setEditJob] = useState(job || {});

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Ensure the initial paragraph has a minimum height
                paragraph: {
                    HTMLAttributes: {
                        class: "",
                    },
                },
            }),
            Underline,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
        ],
        content: job?.description || "<p>Type your description here...</p>", // Placeholder for new jobs
        onUpdate: ({ editor }) => {
            setEditJob(prev => ({ ...prev, description: editor.getHTML() }));
        },
        editorProps: {
            attributes: {
                class: "focus:outline-none",
            },
        },
    });

    useEffect(() => {
        if (job && editor) {
            editor.commands.setContent(job.description || "<p>Type your description here...</p>");
            setEditJob({ ...job });
        }
    }, [job, editor]);

    useEffect(() => {
        if (editor && editor.isEditable) {
            // Delay focus slightly to ensure editor is fully rendered
            const timer = setTimeout(() => {
                editor.chain().focus().run();
            }, 50);
            return () => clearTimeout(timer); // Cleanup timeout on unmount
        }
    }, [editor]);

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
            description: editJob.description === "<p>Type your description here...</p>" ? null : editJob.description,
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
            onPreview(url);
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
                        type="button"
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition duration-200"
                    >
                        <Icon icon="mdi:close" width={24} height={24} />
                    </button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6 h-full flex flex-col">
                        <div>
                            <label
                                className={`block text-sm font-medium mb-2 ${
                                    mode === "dark" ? "text-gray-200 bg-gray-800" : "text-[#231812] bg-white"
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
                                    placeholder="e.g., Comms and Projects Specialist"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label
                                className={`block text-sm font-medium mb-2 ${
                                    mode === "dark" ? "text-gray-200 bg-gray-800" : "text-[#231812] bg-white"
                                }`}
                            >
                                Description (Optional)
                            </label>
                            <TiptapToolbar editor={editor} mode={mode} />
                            <EditorContent
                                editor={editor}
                                className={`border rounded-lg p-3 min-h-[300px] ${
                                    mode === "dark"
                                        ? "bg-gray-700 text-gray-200 border-gray-600 caret-white"
                                        : "bg-white text-[#231812] border-gray-300 caret-black"
                                }`}
                                onClick={() => editor?.chain().focus().run()}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    className={`block text-sm font-medium mb-2 ${
                                        mode === "dark" ? "text-gray-200 bg-gray-800" : "text-[#231812] bg-white"
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
                                {(editJob.file_url || editJob.newFile) && !editJob.removeFile && (
                                    <div
                                        className={`mt-4 p-4 border rounded-lg shadow-md ${
                                            mode === "dark"
                                                ? "bg-gray-800 border-gray-700 text-gray-300"
                                                : "bg-gray-100 border-gray-200 text-gray-600"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="truncate flex-1 text-sm">
                                                {editJob.newFile
                                                    ? editJob.newFile.name
                                                    : `Job Description - ${editJob.title}`}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {editJob.file_url && !editJob.newFile && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handlePreviewClick(e, editJob.file_url)}
                                                        className={`p-2 rounded-full ${
                                                            mode === "dark"
                                                                ? "bg-gray-700 text-[#f05d23] hover:bg-gray-600"
                                                                : "bg-gray-200 text-[#f05d23] hover:bg-gray-300"
                                                        } transition duration-200`}
                                                        title="View file"
                                                    >
                                                        <Icon icon="mdi:eye" width={24} height={24} />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditJob({
                                                            ...editJob,
                                                            removeFile: !editJob.newFile,
                                                            newFile: null,
                                                        });
                                                    }}
                                                    className={`p-2 rounded-full ${
                                                        mode === "dark"
                                                            ? "bg-gray-700 text-red-500 hover:bg-gray-600"
                                                            : "bg-gray-200 text-red-500 hover:bg-gray-300"
                                                    } transition duration-200`}
                                                    title="Remove file"
                                                >
                                                    <Icon icon="mdi:trash-can" width={24} height={24} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {editJob.removeFile && (
                                    <p className="mt-4 text-sm text-red-500">File will be removed on save.</p>
                                )}
                            </div>
                            <div>
                                <label
                                    className={`block text-sm font-medium mb-2 ${
                                        mode === "dark" ? "text-gray-200 bg-gray-800" : "text-[#231812] bg-white"
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
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className={`flex-1 py-2 rounded-full transition duration-200 flex items-center justify-center gap-2 shadow-md ${
                                    mode === "dark"
                                        ? "bg-gray-600 text-white hover:bg-gray-500"
                                        : "bg-gray-200 text-[#231812] hover:bg-gray-300"
                                }`}
                            >
                                <Icon icon="mdi:close" width={20} height={20} />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-2 bg-[#f05d23] text-white rounded-full hover:bg-[#d94f1e] transition duration-200 flex items-center justify-center gap-2 shadow-md"
                            >
                                <Icon icon="mdi:content-save" width={20} height={20} />
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}