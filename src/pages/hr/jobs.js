// src/pages/hr/jobs.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import HRSidebar from "@/layouts/hrSidebar";
import HRHeader from "@/layouts/hrHeader";
import useSidebar from "@/hooks/useSidebar";
import JobForm from "@/components/JobForm";
import JobListings from "@/components/JobListings";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { Icon } from "@iconify/react";
import SimpleFooter from "@/layouts/simpleFooter";  // Adjust the path if necessary

const JobDescriptionModal = dynamic(() => import("@/components/JobDescriptionModal"), { ssr: false });

export default function HRJobBoard({ mode = "light", toggleMode }) {
    const [jobs, setJobs] = useState([]);
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const router = useRouter();
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedOpening, setSelectedOpening] = useState(null);
    const [editJob, setEditJob] = useState(null);

    useEffect(() => {
        if (!localStorage.getItem("hr_session")) {
            router.push("/hr/login");
        } else {
            fetchJobs();
        }

        const handleOpenModal = (e) => {
            setSelectedOpening(e.detail);
            setIsViewModalOpen(true);
        };

        const handleEditModal = (e) => {
            setEditJob(e.detail);
            setIsEditModalOpen(true);
        };

        window.addEventListener("openJobModal", handleOpenModal);
        window.addEventListener("editJobModal", handleEditModal);
        return () => {
            window.removeEventListener("openJobModal", handleOpenModal);
            window.removeEventListener("editJobModal", handleEditModal);
        };
    }, [router]);

    const fetchJobs = async () => {
        const { data, error } = await supabase
            .from("job_openings")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) {
            console.error("Error fetching jobs:", error);
            toast.error("Failed to load job openings.");
        } else {
            const updatedJobs = data.map((job) => ({
                ...job,
                is_expired: new Date(job.expires_on) < new Date(),
            }));
            setJobs(updatedJobs);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("hr_session");
        toast.success("Logged out successfully!");
        setTimeout(() => router.push("/hr/login"), 1000);
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedOpening(null);
    };

    const handleProceed = () => {
        console.log("Proceed clicked for:", selectedOpening);
        handleCloseViewModal();
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditJob(null);
    };

    const handleEditSubmit = async (e) => {
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
            handleCloseEditModal();
            fetchJobs();
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

    return (
        <div
            className={`min-h-screen flex flex-col ${
                mode === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-gray-50 to-gray-100"
            }`}
        >
            <Toaster position="top-right" reverseOrder={false} />
            <HRHeader
                toggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
                mode={mode}
                toggleMode={toggleMode}
                onLogout={handleLogout}
            />
            <div className="flex flex-1">
                <HRSidebar
                    isOpen={isSidebarOpen}
                    mode={mode}
                    onLogout={handleLogout}
                    toggleSidebar={toggleSidebar}
                />
                <div
                    className={`flex-1 p-6 transition-all duration-300 ${
                        isSidebarOpen ? "md:ml-[300px]" : "md:ml-[80px]"
                    }`}
                >
                    <div className="max-w-4xl mx-auto">
                        <JobListings mode={mode} jobs={jobs} onJobDeleted={fetchJobs} />

                        <JobForm mode={mode} onJobAdded={fetchJobs} />
                    </div>
                </div>
            </div>

            {/* View Modal */}
            <JobDescriptionModal
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
                onProceed={handleProceed}
                selectedOpening={selectedOpening}
            />

            {/* Edit Modal */}
            {isEditModalOpen && editJob && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl max-w-3xl w-full mx-4 shadow-2xl transform transition-all duration-300 animate-fade-in flex flex-col max-h-[90vh]">
                        <div className="bg-gradient-to-r from-[#f05d23] to-[#d94f1e] rounded-t-xl p-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <Icon icon="mdi:briefcase" className="w-8 h-8 text-white mr-3" />
                                <h2 className="text-2xl font-bold text-white">Edit Job Opening</h2>
                            </div>
                            <button
                                onClick={handleCloseEditModal}
                                className="text-white hover:text-gray-200 transition duration-200"
                            >
                                <Icon icon="mdi:close" width={24} height={24} />
                            </button>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto">
                            <form onSubmit={handleEditSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[#231812]">
                                        Job Title <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Icon
                                            icon="mdi:format-title"
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#f05d23]"
                                        />
                                        <input
                                            type="text"
                                            value={editJob.title}
                                            onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] bg-gray-50 text-[#231812]"
                                            placeholder="e.g., Software Engineer"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[#231812]">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        value={editJob.description || ""}
                                        onChange={(e) => setEditJob({ ...editJob, description: e.target.value })}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] min-h-[100px] bg-gray-50 text-[#231812]"
                                        placeholder="Enter job description..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[#231812]">
                                        Upload Job Description (DOCX/PDF, Optional)
                                    </label>
                                    <div className="relative">
                                        <Icon
                                            icon="mdi:file-upload"
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#f05d23]"
                                        />
                                        <input
                                            type="file"
                                            accept=".pdf,.docx"
                                            onChange={(e) => setEditJob({ ...editJob, newFile: e.target.files[0] })}
                                            className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-50 text-[#231812]"
                                        />
                                    </div>
                                    {editJob.file_url && !editJob.newFile && (
                                        <p className="mt-2 text-sm text-gray-600">
                                            Current file: {editJob.file_url.split("/").pop()}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[#231812]">
                                        Expires On <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Icon
                                            icon="mdi:calendar"
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#f05d23]"
                                        />
                                        <input
                                            type="date"
                                            value={editJob.expires_on.split("T")[0]}
                                            onChange={(e) => setEditJob({ ...editJob, expires_on: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f05d23] bg-gray-50 text-[#231812]"
                                            required
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 rounded-b-xl shadow-md">
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={handleCloseEditModal}
                                    className="px-6 py-2 bg-gray-200 text-[#231812] rounded-full hover:bg-gray-300 transition duration-200 flex items-center gap-2 shadow-md"
                                >
                                    <Icon icon="mdi:close" width={20} height={20} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEditSubmit}
                                    className="px-6 py-2 bg-[#f05d23] text-white rounded-full hover:bg-[#d94f1e] transition duration-200 flex items-center gap-2 shadow-md"
                                >
                                    <Icon icon="mdi:content-save" width={20} height={20} />
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <SimpleFooter mode={mode} />


        </div>
    );
}