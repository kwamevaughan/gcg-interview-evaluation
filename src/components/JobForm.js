// src/components/JobForm.js
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

export default function JobForm({ mode, onJobAdded }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [expiresOn, setExpiresOn] = useState("");

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
        // content: "<p>Type your description here...</p>", // Placeholder for new jobs
        onUpdate: ({ editor }) => {
            setDescription(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "focus:outline-none",
            },
        },
    });

    useEffect(() => {
        if (editor && editor.isEditable) {
            // Delay focus slightly to ensure editor is fully rendered
            const timer = setTimeout(() => {
                editor.chain().focus().run();
            }, 50);
            return () => clearTimeout(timer); // Cleanup timeout on unmount
        }
    }, [editor]);

    const handleSubmitJob = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Please wait...");

        let fileUrl = null;
        let fileId = null;

        if (file) {
            const fileData = await fileToBase64(file);
            const fileType = file.name.split(".").pop().toLowerCase();
            const response = await fetch("/api/upload-job-file", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileData: fileData.split(",")[1], fileType, opening: title }),
            });
            const result = await response.json();
            if (!response.ok || result.error) {
                toast.error("Failed to upload file.", { id: toastId });
                return;
            }
            fileUrl = result.url;
            fileId = result.fileId;
        }

        const jobData = {
            title,
            description: description === "<p>Type your description here...</p>" ? null : description,
            file_url: fileUrl,
            file_id: fileId,
            expires_on: expiresOn,
            is_expired: false,
        };

        const { error } = await supabase.from("job_openings").insert([jobData]);
        if (error) {
            toast.error("Failed to submit job opening.", { id: toastId });
            console.error("Insert error:", error);
        } else {
            toast.success("Job opening added successfully!", { icon: "✅", id: toastId });
            setTitle("");
            editor?.commands.setContent("<p>Type your description here...</p>");
            setFile(null);
            setExpiresOn("");
            onJobAdded();
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

    const handleFileChange = (e) => setFile(e.target.files[0]);
    const handleRemoveFile = () => setFile(null);
    const handleReplaceFile = () => document.getElementById("file-upload").click();

    const handleDateClick = (e) => {
        e.preventDefault();
        const input = e.currentTarget.querySelector("input[type='date']");
        input.showPicker();
    };

    return (
        <div
            className={`p-6 rounded-lg shadow-lg mb-8 border-t-4 border-[#f05d23] ${
                mode === "dark" ? "bg-gray-800" : "bg-white"
            }`}
        >
            <div className="flex items-center mb-4">
                <Icon icon="mdi:briefcase-plus" className="w-6 h-6 text-[#f05d23] mr-2" />
                <h3
                    className={`text-xl font-bold ${
                        mode === "dark" ? "text-white" : "text-[#231812]"
                    }`}
                >
                    Add New Job Opening
                </h3>
            </div>
            <form onSubmit={handleSubmitJob} className="space-y-6">
                <div>
                    <label
                        className={`block text-sm font-medium mb-2 ${
                            mode === "dark" ? "text-gray-300" : "text-[#231812]"
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
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] ${
                                mode === "dark"
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-gray-50 border-gray-300 text-[#231812]"
                            }`}
                            placeholder="e.g., Comms and Projects Specialist"
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <label
                        className={`block text-sm font-medium mb-2 ${
                            mode === "dark" ? "text-gray-300" : "text-[#231812]"
                        }`}
                    >
                        Description (Optional)
                    </label>
                    <TiptapToolbar editor={editor} mode={mode} />
                    <EditorContent
                        editor={editor}
                        className={`border rounded-lg p-3 min-h-[150px] ${
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
                                mode === "dark" ? "text-gray-300" : "text-[#231812]"
                            }`}
                        >
                            Upload Job Description (DOCX/PDF, Optional)
                        </label>
                        <div className="relative">
                            <Icon
                                icon="mdi:file-upload"
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#f05d23]"
                            />
                            <input
                                id="file-upload"
                                type="file"
                                accept=".pdf,.docx"
                                onChange={handleFileChange}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                                    mode === "dark"
                                        ? "bg-gray-700 border-gray-600 text-gray-300"
                                        : "bg-gray-50 border-gray-300 text-[#231812]"
                                }`}
                            />
                        </div>
                        {file && (
                            <div
                                className={`mt-4 p-4 border rounded-lg shadow-md ${
                                    mode === "dark"
                                        ? "bg-gray-800 border-gray-700 text-gray-300"
                                        : "bg-gray-100 border-gray-200 text-gray-600"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="truncate flex-1 text-sm">{file.name}</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={handleRemoveFile}
                                            className={`p-2 rounded-full ${
                                                mode === "dark"
                                                    ? "bg-gray-700 text-red-500 hover:bg-gray-600"
                                                    : "bg-gray-200 text-red-500 hover:bg-gray-300"
                                            } transition duration-200`}
                                            title="Remove file"
                                        >
                                            <Icon icon="mdi:trash-can" width={24} height={24} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleReplaceFile}
                                            className={`p-2 rounded-full ${
                                                mode === "dark"
                                                    ? "bg-gray-700 text-[#f05d23] hover:bg-gray-600"
                                                    : "bg-gray-200 text-[#f05d23] hover:bg-gray-300"
                                            } transition duration-200`}
                                            title="Replace file"
                                        >
                                            <Icon icon="mdi:refresh" width={24} height={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        <label
                            className={`block text-sm font-medium mb-2 ${
                                mode === "dark" ? "text-gray-300" : "text-[#231812]"
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
                                value={expiresOn}
                                onChange={(e) => setExpiresOn(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] ${
                                    mode === "dark"
                                        ? "bg-gray-700 border-gray-600 text-white"
                                        : "bg-gray-50 border-gray-300 text-[#231812]"
                                }`}
                                required
                            />
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full py-3 bg-[#f05d23] text-white rounded-lg hover:bg-[#d94f1e] transition duration-200 shadow-md flex items-center justify-center gap-2"
                >
                    <Icon icon="mdi:plus" width={20} height={20} />
                    Add Job Opening
                </button>
            </form>
        </div>
    );
}