"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

// Dynamically import EditorComponent with SSR disabled
const EditorComponent = dynamic(() => import("../components/EditorComponent"), { ssr: false });

export default function JobForm({ mode, onJobAdded }) {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [expiresOn, setExpiresOn] = useState("");
    const [description, setDescription] = useState("");

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

        const isDefaultDescription = description === "" || description === "<p><br></p>";
        const jobData = {
            title,
            description: isDefaultDescription ? null : description, // Use description directly
            file_url: fileUrl,
            file_id: fileId,
            expires_on: expiresOn,
            is_expired: false,
        };
        console.log("Job data to insert:", jobData);

        const { data, error } = await supabase.from("job_openings").insert([jobData]).select().single();
        if (error) {
            toast.error("Failed to submit job opening.", { id: toastId });
            console.error("Insert error:", error);
        } else {
            toast.success("Job opening added successfully!", { icon: "✅", id: toastId });
            setTitle("");
            setDescription(""); // Reset description
            setFile(null);
            setExpiresOn("");
            onJobAdded(data); // Pass the newly inserted job directly
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
                mode === "dark" ? "bg-gray-800 shadow-gray-900" : "bg-white shadow-gray-300"
            } transition-shadow duration-300 hover:shadow-xl`}
        >
            <div className="flex items-center mb-6">
                <Icon
                    icon="mdi:briefcase-plus"
                    className="w-8 h-8 text-[#f05d23] mr-3 animate-pulse"
                />
                <h3
                    className={`text-2xl font-bold ${
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
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] transition-all duration-200 ${
                                mode === "dark"
                                    ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                                    : "bg-gray-50 border-gray-300 text-[#231812] hover:bg-gray-100"
                            }`}
                            placeholder="e.g., Comms and Projects Specialist"
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Description (3/4 width) */}
                    <div className="lg:col-span-3 flex flex-col">
                        <label
                            className={`block text-sm font-medium mb-2 ${
                                mode === "dark" ? "text-gray-300" : "text-[#231812]"
                            }`}
                        >
                            Description (Optional)
                        </label>
                        <EditorComponent
                            initialValue={description}
                            onBlur={(newContent) => setDescription(newContent)}
                            mode={mode}
                            holderId="jodit-editor-job-form"
                            className="w-full"
                        />
                    </div>
                    {/* Right Column (1/4 width) */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        {/* Upload */}
                        <div>
                            <label
                                className={`block text-sm font-medium mb-2 ${
                                    mode === "dark" ? "text-gray-300" : "text-[#231812]"
                                }`}
                            >
                                Upload Job Description (Optional)
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
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-200 ${
                                        mode === "dark"
                                            ? "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                                            : "bg-gray-50 border-gray-300 text-[#231812] hover:bg-gray-100"
                                    }`}
                                />
                            </div>
                            {file && (
                                <div
                                    className={`mt-4 p-4 border rounded-lg shadow-md animate-fade-in ${
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
                                                className={`p-2 rounded-full transition-transform duration-200 hover:scale-110 ${
                                                    mode === "dark"
                                                        ? "bg-gray-700 text-red-500 hover:bg-gray-600"
                                                        : "bg-gray-200 text-red-500 hover:bg-gray-300"
                                                }`}
                                            >
                                                <Icon icon="mdi:trash-can" width={24} height={24} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleReplaceFile}
                                                className={`p-2 rounded-full transition-transform duration-200 hover:scale-110 ${
                                                    mode === "dark"
                                                        ? "bg-gray-700 text-[#f05d23] hover:bg-gray-600"
                                                        : "bg-gray-200 text-[#f05d23] hover:bg-gray-300"
                                                }`}
                                            >
                                                <Icon icon="mdi:refresh" width={24} height={24} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Date */}
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
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] transition-all duration-200 ${
                                        mode === "dark"
                                            ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                                            : "bg-gray-50 border-gray-300 text-[#231812] hover:bg-gray-100"
                                    }`}
                                    required
                                />
                            </div>
                        </div>
                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`w-full py-3 bg-[#f05d23] text-white rounded-lg hover:bg-[#d94f1e] transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform hover:scale-105`}
                        >
                            <Icon icon="mdi:plus" width={20} height={20} />
                            Add Job Opening
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}