import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import HRSidebar from "@/layouts/hrSidebar";
import HRHeader from "@/layouts/hrHeader";
import useSidebar from "@/hooks/useSidebar";
import SimpleFooter from "@/layouts/simpleFooter";
import ApplicantsTable from "@/components/ApplicantsTable";
import ApplicantsFilters from "@/components/ApplicantsFilters";
import CandidateModal from "@/components/CandidateModal";
import EmailModal from "@/components/EmailModal";
import ExportModal from "@/components/ExportModal";
import useStatusChange from "@/hooks/useStatusChange";
import { Icon } from "@iconify/react";
import { fetchHRData } from "../../../utils/hrData";
import { supabase } from "@/lib/supabase";

export default function HRApplicants({
    mode = "light",
    toggleMode,
    initialCandidates,
    initialQuestions,
}) {
    const [candidates, setCandidates] = useState(initialCandidates || []);
    const [filteredCandidates, setFilteredCandidates] = useState(initialCandidates || []);
    const [sortField, setSortField] = useState("full_name");
    const [sortDirection, setSortDirection] = useState("asc");
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const router = useRouter();
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [emailData, setEmailData] = useState({ subject: "", body: "" });

    const { handleStatusChange } = useStatusChange({
        candidates,
        setCandidates,
        setFilteredCandidates,
        setSelectedCandidate,
        setEmailData,
        setIsEmailModalOpen,
    });

    useEffect(() => {
        if (!localStorage.getItem("hr_session")) {
            router.push("/hr/login");
        } else {
            const { opening } = router.query;
            const savedOpening = localStorage.getItem("filterOpening") || "all";
            const savedStatus = localStorage.getItem("filterStatus") || "all";

            let initialFilter = [...candidates];
            if (opening && initialFilter.some((c) => c.opening === opening)) {
                initialFilter = initialFilter.filter((c) => c.opening === opening);
            } else if (savedOpening !== "all") {
                initialFilter = initialFilter.filter((c) => c.opening === savedOpening);
            }
            if (savedStatus !== "all") {
                initialFilter = initialFilter.filter((c) => c.status === savedStatus);
            }
            setFilteredCandidates(initialFilter);
        }
    }, [router, candidates]);

    const handleLogout = () => {
        localStorage.removeItem("hr_session");
        document.cookie = "hr_session=; path=/; max-age=0";
        toast.success("Logged out successfully!");
        setTimeout(() => router.push("/hr/login"), 1000);
    };

    const handleViewCandidate = (candidate) => {
        setSelectedCandidate(candidate);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCandidate(null);
    };

    const handleFilterChange = ({ searchQuery, filterOpening, filterStatus }) => {
        let result = [...candidates];
        console.log("Filter Change - Opening:", filterOpening, "Status:", filterStatus);

        if (searchQuery) {
            result = result.filter(
                (c) =>
                    c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (filterOpening !== "all") {
            result = result.filter((c) => c.opening === filterOpening);
        }
        if (filterStatus !== "all") {
            result = result.filter((c) => (c.status || "Pending") === filterStatus);
        }
        setFilteredCandidates(result);

        const currentOpening = localStorage.getItem("filterOpening") || "all";
        const currentStatus = localStorage.getItem("filterStatus") || "all";
        const currentQueryOpening = router.query.opening || "all";

        if (filterOpening !== currentOpening || filterStatus !== currentStatus) {
            localStorage.setItem("filterOpening", filterOpening);
            localStorage.setItem("filterStatus", filterStatus);

            if (filterOpening !== currentQueryOpening) {
                if (filterOpening !== "all") {
                    router.push(
                        { pathname: "/hr/applicants", query: { opening: filterOpening } },
                        undefined,
                        { shallow: true }
                    );
                } else if (router.query.opening) {
                    router.push("/hr/applicants", undefined, { shallow: true });
                }
            }
        }
    };

    const handleSort = (field) => {
        const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortDirection(newDirection);

        const sorted = [...filteredCandidates].sort((a, b) => {
            const aValue = a[field] || "";
            const bValue = b[field] || "";
            if (field === "score") {
                return newDirection === "asc" ? aValue - bValue : bValue - aValue;
            }
            return newDirection === "asc"
                ? aValue.toString().localeCompare(bValue.toString())
                : bValue.toString().localeCompare(aValue.toString());
        });
        setFilteredCandidates(sorted);
    };

    const handleSendEmail = async (emailDataWithToast) => {
        const { toastId, subject, body, ...restEmailData } = emailDataWithToast; // Extract toastId and email fields
        try {
            const response = await fetch("/api/send-status-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: selectedCandidate.full_name,
                    email: selectedCandidate.email,
                    opening: selectedCandidate.opening,
                    status: selectedCandidate.status,
                    subject,
                    body,
                }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Failed to send email");

            toast.dismiss(toastId); // Dismiss "Please wait..."
            toast.success("Email sent successfully!", { icon: "✅" });
            setIsEmailModalOpen(false);
        } catch (error) {
            console.error("Error sending email:", error);
            toast.dismiss(toastId); // Dismiss "Please wait..." on error
            toast.error("Failed to send email.");
        }
    };

    const handleDeleteCandidate = async (candidateId) => {
        const confirmed = await new Promise((resolve) => {
            toast.custom(
                (t) => (
                    <div
                        className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                    >
                        <div className="flex-1 w-0 p-4">
                            <p className="text-xl font-medium text-gray-900">Delete Candidate?</p>
                            <p className="mt-2 text-base text-gray-500">
                                Are you sure you want to delete this candidate? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex border-l border-gray-200">
                            <button
                                onClick={() => { toast.dismiss(t.id); resolve(true); }}
                                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[#f05d23] hover:text-[#d94f1e] hover:bg-[#ffe0b3] transition-colors"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => { toast.dismiss(t.id); resolve(false); }}
                                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 hover:bg-[#f3f4f6] transition-colors"
                            >
                                No
                            </button>
                        </div>
                    </div>
                ),
                { duration: Infinity }
            );
        });

        if (!confirmed) return;

        const loadingToast = toast.loading("Please wait...");
        try {
            const { data: responseData, error: fetchError } = await supabase
                .from("responses")
                .select("resume_file_id, cover_letter_file_id")
                .eq("user_id", candidateId)
                .single();
            if (fetchError) throw fetchError;

            console.log("File IDs for candidate", candidateId, ":", {
                resumeFileId: responseData?.resume_file_id,
                coverLetterFileId: responseData?.cover_letter_file_id,
            });

            const resumeFileId = responseData?.resume_file_id;
            const coverLetterFileId = responseData?.cover_letter_file_id;

            const { error: candidateError } = await supabase
                .from("candidates")
                .delete()
                .eq("id", candidateId);
            if (candidateError) throw candidateError;

            const { error: responseError } = await supabase
                .from("responses")
                .delete()
                .eq("user_id", candidateId);
            if (responseError) throw responseError;

            const fileIds = [resumeFileId, coverLetterFileId].filter(id => id);
            console.log("Sending file IDs to delete:", fileIds);
            if (fileIds.length > 0) {
                const deleteResponse = await fetch("/api/delete-files", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fileIds }),
                });
                const deleteResult = await deleteResponse.json();
                console.log("Delete files response:", deleteResult);
                if (!deleteResponse.ok) {
                    throw new Error(deleteResult.error || "Failed to delete files from Google Drive");
                }
            } else {
                console.log("No file IDs found to delete for candidate", candidateId);
            }

            const updatedCandidates = candidates.filter((c) => c.id !== candidateId);
            setCandidates(updatedCandidates);
            setFilteredCandidates(updatedCandidates);
            toast.success("Candidate and associated files deleted successfully!", { id: loadingToast, icon: "✅" });
        } catch (error) {
            console.error("Error deleting candidate:", error);
            toast.error("Failed to delete candidate or files.", { id: loadingToast });
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) {
            toast.error("No candidates selected for deletion.");
            return;
        }

        const confirmed = await new Promise((resolve) => {
            toast.custom(
                (t) => (
                    <div
                        className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                    >
                        <div className="flex-1 w-0 p-4">
                            <p className="text-xl font-medium text-gray-900">Delete Selected?</p>
                            <p className="mt-2 text-base text-gray-500">
                                Are you sure you want to delete {selectedIds.length} candidate(s)? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex border-l border-gray-200">
                            <button
                                onClick={() => { toast.dismiss(t.id); resolve(true); }}
                                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[#f05d23] hover:text-[#d94f1e] hover:bg-[#ffe0b3] transition-colors"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => { toast.dismiss(t.id); resolve(false); }}
                                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 hover:bg-[#f3f4f6] transition-colors"
                            >
                                No
                            </button>
                        </div>
                    </div>
                ),
                { duration: Infinity }
            );
        });

        if (!confirmed) return;

        const loadingToast = toast.loading("Please wait...");
        try {
            const { data: responsesData, error: fetchError } = await supabase
                .from("responses")
                .select("user_id, resume_file_id, cover_letter_file_id")
                .in("user_id", selectedIds);
            if (fetchError) throw fetchError;

            console.log("Responses data for bulk delete:", responsesData);

            const fileIdsToDelete = responsesData.reduce((acc, response) => {
                if (response.resume_file_id) acc.push(response.resume_file_id);
                if (response.cover_letter_file_id) acc.push(response.cover_letter_file_id);
                return acc;
            }, []);

            console.log("File IDs to delete:", fileIdsToDelete);

            const { error: candidateError } = await supabase
                .from("candidates")
                .delete()
                .in("id", selectedIds);
            if (candidateError) throw candidateError;

            const { error: responseError } = await supabase
                .from("responses")
                .delete()
                .in("user_id", selectedIds);
            if (responseError) throw responseError;

            if (fileIdsToDelete.length > 0) {
                const deleteResponse = await fetch("/api/delete-files", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fileIds: fileIdsToDelete }),
                });
                const deleteResult = await deleteResponse.json();
                console.log("Bulk delete files response:", deleteResult);
                if (!deleteResponse.ok) {
                    throw new Error(deleteResult.error || "Failed to delete files from Google Drive");
                }
            } else {
                console.log("No file IDs found to delete for selected candidates");
            }

            const updatedCandidates = candidates.filter((c) => !selectedIds.includes(c.id));
            setCandidates(updatedCandidates);
            setFilteredCandidates(updatedCandidates);
            setSelectedIds([]);
            toast.success(`${selectedIds.length} candidate(s) and associated files deleted successfully!`, { id: loadingToast, icon: "✅" });
        } catch (error) {
            console.error("Error deleting candidates:", error);
            toast.error("Failed to delete selected candidates or files.", { id: loadingToast });
        }
    };

    return (
        <div
            className={`min-h-screen flex flex-col ${
                mode === "dark"
                    ? "bg-gradient-to-b from-gray-900 to-gray-800"
                    : "bg-gradient-to-b from-gray-50 to-gray-100"
            }`}
        >

            <HRHeader
                toggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
                mode={mode}
                toggleMode={toggleMode}
                onLogout={handleLogout}
                pageName="Applicants"
                pageDescription="Browse and manage job applicants."
            />
            <div className="flex flex-1">
                <HRSidebar
                    isOpen={isSidebarOpen}
                    mode={mode}
                    onLogout={handleLogout}
                    toggleSidebar={toggleSidebar}
                />
                <div
                    className={`content-container flex-1 p-6 transition-all duration-300 overflow-hidden ${
                        isSidebarOpen ? "md:ml-[300px]" : "md:ml-[80px]"
                    }`}
                >
                    <div className="max-w-7xl mx-auto space-y-6">
                        <ApplicantsFilters
                            candidates={candidates}
                            onFilterChange={handleFilterChange}
                            mode={mode}
                            initialOpening={router.query.opening || "all"}
                        />
                        <ApplicantsTable
                            candidates={filteredCandidates}
                            mode={mode}
                            onViewCandidate={handleViewCandidate}
                            onDeleteCandidate={handleDeleteCandidate}
                            onSort={handleSort}
                            sortField={sortField}
                            sortDirection={sortDirection}
                            selectedIds={selectedIds}
                            setSelectedIds={setSelectedIds}
                            handleBulkDelete={handleBulkDelete}
                            setIsExportModalOpen={setIsExportModalOpen}
                        />
                    </div>
                </div>
            </div>

            <CandidateModal
                candidate={selectedCandidate}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onStatusChange={handleStatusChange}
                mode={mode}
            />
            <EmailModal
                candidate={selectedCandidate}
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                emailData={emailData}
                setEmailData={setEmailData}
                onSend={handleSendEmail}
                mode={mode}
            />
            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                candidates={filteredCandidates}
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

    const { initialCandidates, initialQuestions } = await fetchHRData({ fetchCandidates: true, fetchQuestions: true });
    return {
        props: {
            initialCandidates,
            initialQuestions,
        },
    };
}