// TODO: Extract modal logic to useJobModals hook for better maintainability
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
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
import NotifyEmailGroupModal from "@/components/NotifyEmailGroupModal";

// Helper function to format ISO date as DD/MM/YYYY for display
const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const JobDescriptionModal = dynamic(() => import("@/components/JobDescriptionModal"), { ssr: false });

export default function HRJobBoard({ mode = "light", toggleMode, initialJobs = [] }) {
    const [jobs, setJobs] = useState(initialJobs || []);
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const router = useRouter();
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedOpening, setSelectedOpening] = useState(null);
    const [editJob, setEditJob] = useState(null);
    const [lastJob, setLastJob] = useState(null);

    useEffect(() => {
        console.log("Initial jobs on mount:", initialJobs);
        if (!localStorage.getItem("hr_session")) {
            router.push("/hr/login");
        }

        const handleOpenModal = (e) => {
            setSelectedOpening(e.detail);
            setIsViewModalOpen(true);
        };

        const handleEditModal = (e) => {
            console.log("Opening EditJobModal with job:", e.detail);
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
                expires_on_display: formatDate(job.expires_on), // For display only
            }));
            setJobs(updatedJobs);
            toast.success("Data loaded successfully!", { id: loadingToast });
        } catch (error) {
            console.error("Error fetching jobs:", error);
            toast.error("Failed to load job openings.", { id: loadingToast });
            setJobs([]);
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

    const handleEditSave = async (updatedJob) => {
        console.log("Saved job:", updatedJob);
        setJobs((prevJobs) =>
            prevJobs.map((j) =>
                j.id === updatedJob.id
                    ? { ...j, ...updatedJob, expires_on_display: formatDate(updatedJob.expires_on) }
                    : j
            )
        );
        await fetchJobs(); // Refetch to ensure consistency
        handleCloseEditModal();
    };

    const handleJobAdded = (newJob) => {
        console.log("New job added:", newJob);
        setJobs((prevJobs) => [
            { ...newJob, expires_on_display: formatDate(newJob.expires_on) },
            ...prevJobs,
        ]);
        setLastJob({
            title: newJob.title,
            id: newJob.id,
            expiresOn: formatDate(newJob.expires_on), // For NotifyEmailGroupModal
            slug: newJob.slug,
        });
        setIsNotifyModalOpen(true);
    };

    const handlePreview = (url) => {
        if (!url) {
            console.error("No URL provided for preview");
            toast.error("Unable to preview file.");
            return;
        }
        setPreviewUrl(url);
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
                    className={`content-container flex-1 p-6 transition-all duration-300 ${
                        isSidebarOpen ? "md:ml-[300px]" : "md:ml-[80px]"
                    }`}
                >
                    <div className="max-w-7xl mx-auto">
                        {jobs.length ? (
                            <JobListings mode={mode} jobs={jobs} onJobDeleted={fetchJobs} />
                        ) : (
                            <p>Loading jobs...</p>
                        )}
                        <JobForm mode={mode} onJobAdded={handleJobAdded} />
                    </div>
                </div>
            </div>

            <JobDescriptionModal
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
                onProceed={handleProceed}
                selectedOpening={selectedOpening}
            />
            <EditJobModal
                isOpen={isEditModalOpen}
                job={editJob}
                onClose={handleCloseEditModal}
                onSave={handleEditSave}
                mode={mode}
                onPreview={handlePreview}
            />
            <PreviewModal
                isOpen={isPreviewModalOpen}
                url={previewUrl}
                onClose={handleClosePreviewModal}
                mode={mode}
            />
            <NotifyEmailGroupModal
                isOpen={isNotifyModalOpen}
                onClose={() => setIsNotifyModalOpen(false)}
                jobTitle={lastJob?.title}
                jobId={lastJob?.id}
                expiresOn={lastJob?.expiresOn}
                mode={mode}
            />
            <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
    );
}

export async function getServerSideProps(context) {
    const { req } = context;

    if (!req.cookies.hr_session) {
        return {
            redirect: {
                destination: "/hr/login",
                permanent: false,
            },
        };
    }

    try {
        console.time("fetchJobs");
        const { data, error } = await supabase
            .from("job_openings")
            .select("*")
            .order("created_at", { ascending: false });
        console.timeEnd("fetchJobs");

        if (error) throw error;

        const initialJobs = data.map((job) => ({
            ...job,
            is_expired: new Date(job.expires_on) < new Date(),
            expires_on_display: formatDate(job.expires_on), // For display only
        }));

        return {
            props: {
                initialJobs,
            },
        };
    } catch (error) {
        console.error("Error fetching jobs in getServerSideProps:", error);
        return {
            props: {
                initialJobs: [],
            },
        };
    }
}