// src/pages/hr/jobs.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import HRSidebar from "@/layouts/hrSidebar";
import HRHeader from "@/layouts/hrHeader";
import useSidebar from "@/hooks/useSidebar";
import JobForm from "@/components/JobForm";
import JobListings from "@/components/JobListings";
import EditJobModal from "@/components/EditJobModal";
import PreviewModal from "@/components/PreviewModal";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import SimpleFooter from "@/layouts/simpleFooter";

const JobDescriptionModal = dynamic(() => import("@/components/JobDescriptionModal"), { ssr: false });

export default function HRJobBoard({ mode = "light", toggleMode }) {
    const [jobs, setJobs] = useState([]);
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const router = useRouter();
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
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
        const loadingToast = toast.loading("Loading data...");
        try {
            const { data, error } = await supabase
                .from("job_openings")
                .select("*")
                .order("created_at", { ascending: false });
            if (error) throw error;

            const updatedJobs = data.map((job) => ({
                ...job,
                is_expired: new Date(job.expires_on) < new Date(),
            }));
            setJobs(updatedJobs);
            toast.success("Data loaded successfully!", { id: loadingToast });
        } catch (error) {
            console.error("Error fetching jobs:", error);
            toast.error("Failed to load job openings.", { id: loadingToast });
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
        console.log("Closing edit modal explicitly");
        setIsEditModalOpen(false);
        setEditJob(null);
        setIsPreviewModalOpen(false);
    };

    const handleEditSave = (updatedJob) => {
        handleCloseEditModal();
        fetchJobs();
    };

    const handlePreview = (url) => {
        if (!url) {
            console.error("No URL provided for preview");
            toast.error("Unable to preview file.");
            return;
        }
        setPreviewUrl(url); // Pass the raw URL directly
        setIsPreviewModalOpen(true);
    };

    const handleClosePreviewModal = () => {
        console.log("Closing preview modal from parent");
        setIsPreviewModalOpen(false);
        setPreviewUrl(null);
    };

    return (
        <div
            className={`min-h-screen flex flex-col ${
                mode === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-800" : "bg-gradient-to-b from-gray-50 to-gray-100"
            }`}
        >
            <Toaster position="top-center" reverseOrder={false} />
            <HRHeader
                toggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
                mode={mode}
                toggleMode={toggleMode}
                onLogout={handleLogout}
                pageName="Job Postings"
                pageDescription="Manage and create job openings for your organization."
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
                    <div className="max-w-6xl mx-auto">
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
            <EditJobModal
                isOpen={isEditModalOpen}
                job={editJob}
                onClose={handleCloseEditModal}
                onSave={handleEditSave}
                mode={mode}
                onPreview={handlePreview}
            />

            {/* Preview Modal */}
            <PreviewModal
                isOpen={isPreviewModalOpen}
                url={previewUrl}
                onClose={handleClosePreviewModal}
                mode={mode}
            />

            <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
    );
}