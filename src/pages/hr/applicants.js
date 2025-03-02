// src/pages/hr/HRApplicants.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import HRSidebar from "@/layouts/hrSidebar";
import HRHeader from "@/layouts/hrHeader";
import useSidebar from "@/hooks/useSidebar";
import { supabaseServer } from "@/lib/supabaseServer";
import SimpleFooter from "@/layouts/simpleFooter";
import ApplicantsTable from "@/components/ApplicantsTable";
import ApplicantsFilters from "@/components/ApplicantsFilters";
import CandidateModal from "@/components/CandidateModal";
import EmailModal from "@/components/EmailModal";
import ExportModal from "@/components/ExportModal";
import useStatusChange from "@/hooks/useStatusChange";
import { Icon } from "@iconify/react";

export default function HRApplicants({ mode = "light", toggleMode }) {
    const [candidates, setCandidates] = useState([]);
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [sortField, setSortField] = useState("full_name");
    const [sortDirection, setSortDirection] = useState("asc");
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const router = useRouter();
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const { handleStatusChange } = useStatusChange({
        candidates,
        setCandidates,
        setFilteredCandidates,
        setSelectedCandidate,
        setEmailData: (data) => setEmailData(data),
        setIsEmailModalOpen,
    });

    const [emailData, setEmailData] = useState({ subject: "", body: "" });

    useEffect(() => {
        if (!localStorage.getItem("hr_session")) {
            router.push("/hr/login");
        } else {
            fetchCandidates();
        }
    }, [router]);

    const fetchCandidates = async () => {
        console.log("Fetching candidates with supabaseServer...");
        try {
            const { data: candidatesData, error: candidatesError } = await supabaseServer
                .from("candidates")
                .select("id, full_name, email, phone, linkedin, opening");
            if (candidatesError) throw candidatesError;

            const { data: responsesData, error: responsesError } = await supabaseServer
                .from("responses")
                .select("user_id, answers, score, resume_url, cover_letter_url, status");
            if (responsesError) throw responsesError;

            const { data: questionsData, error: questionsError } = await supabaseServer
                .from("interview_questions")
                .select("id, text")
                .order("order", { ascending: true });
            if (questionsError) throw questionsError;

            const combinedData = candidatesData.map((candidate) => {
                const response = responsesData.find((r) => r.user_id === candidate.id) || {};
                let parsedAnswers = [];
                if (response.answers) {
                    try {
                        parsedAnswers =
                            typeof response.answers === "string"
                                ? JSON.parse(response.answers)
                                : response.answers;
                        if (!Array.isArray(parsedAnswers) && typeof parsedAnswers === "object") {
                            parsedAnswers = Object.values(parsedAnswers);
                        }
                    } catch (e) {
                        console.error(`Error parsing answers for ${candidate.full_name}:`, e);
                        parsedAnswers = [];
                    }
                }
                const normalizedStatus = response.status ? response.status.trim() : "Pending";
                return {
                    ...candidate,
                    answers: Array.isArray(parsedAnswers) ? parsedAnswers : [],
                    score: response.score || 0,
                    resumeUrl: response.resume_url,
                    coverLetterUrl: response.cover_letter_url,
                    status: normalizedStatus,
                    questions: questionsData,
                };
            });
            setCandidates(combinedData);

            const { opening } = router.query;
            const savedOpening = localStorage.getItem("filterOpening") || "all";
            const savedStatus = localStorage.getItem("filterStatus") || "all";

            let initialFilter = combinedData;
            if (opening && combinedData.some((c) => c.opening === opening)) {
                initialFilter = combinedData.filter((c) => c.opening === opening);
            } else if (savedOpening !== "all") {
                initialFilter = combinedData.filter((c) => c.opening === savedOpening);
            }
            if (savedStatus !== "all") {
                initialFilter = initialFilter.filter((c) => c.status === savedStatus);
            }
            setFilteredCandidates(initialFilter);
            console.log("Initial Filter Applied - Status:", savedStatus, "Candidates:", initialFilter.length);
        } catch (error) {
            console.error("Error fetching candidates:", error);
            toast.error("Failed to load candidates.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("hr_session");
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
        console.log("Filter Status Applied:", filterStatus);
        console.log("All Candidate Statuses:", candidates.map((c) => c.status));

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
        console.log("Filtered Candidates:", result.map((c) => ({ id: c.id, status: c.status })));

        localStorage.setItem("filterOpening", filterOpening);
        localStorage.setItem("filterStatus", filterStatus);

        if (filterOpening !== "all") {
            router.push(
                { pathname: "/hr/applicants", query: { opening: filterOpening } },
                undefined,
                { shallow: true }
            );
        } else if (router.query.opening) {
            router.push("/hr/applicants", undefined, { shallow: true });
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

    const handleSendEmail = async () => {
        try {
            const response = await fetch("/api/send-status-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: selectedCandidate.full_name,
                    email: selectedCandidate.email,
                    opening: selectedCandidate.opening,
                    status: selectedCandidate.status,
                    subject: emailData.subject,
                    body: emailData.body,
                }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Failed to send email");

            toast.success("Email sent successfully!", { icon: "✅" });
            setIsEmailModalOpen(false);
        } catch (error) {
            console.error("Error sending email:", error);
            toast.error("Failed to send email.");
        }
    };

    const handleDeleteCandidate = async (candidateId) => {
        const confirmed = await new Promise((resolve) => {
            toast.custom(
                (t) => (
                    <div
                        className={`${
                            t.visible ? "animate-enter" : "animate-leave"
                        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                    >
                        <div className="flex-1 w-0 p-4">
                            <p className="text-xl font-medium text-gray-900">Delete Candidate?</p>
                            <p className="mt-2 text-base text-gray-500">
                                Are you sure you want to delete this candidate? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex border-l border-gray-200">
                            <button
                                onClick={() => {
                                    toast.dismiss(t.id);
                                    resolve(true);
                                }}
                                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[#f05d23] hover:text-[#d94f1e] hover:bg-[#ffe0b3] transition-colors"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => {
                                    toast.dismiss(t.id);
                                    resolve(false);
                                }}
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

        try {
            const { error: candidateError } = await supabaseServer
                .from("candidates")
                .delete()
                .eq("id", candidateId);
            if (candidateError) throw candidateError;

            const { error: responseError } = await supabaseServer
                .from("responses")
                .delete()
                .eq("user_id", candidateId);
            if (responseError) throw responseError;

            const updatedCandidates = candidates.filter((c) => c.id !== candidateId);
            setCandidates(updatedCandidates);
            setFilteredCandidates(updatedCandidates);
            toast.success("Candidate deleted successfully!", { icon: "✅" });
        } catch (error) {
            console.error("Error deleting candidate:", error);
            toast.error("Failed to delete candidate.");
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
                        className={`${
                            t.visible ? "animate-enter" : "animate-leave"
                        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                    >
                        <div className="flex-1 w-0 p-4">
                            <p className="text-xl font-medium text-gray-900">Delete Selected?</p>
                            <p className="mt-2 text-base text-gray-500">
                                Are you sure you want to delete {selectedIds.length} candidate(s)? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex border-l border-gray-200">
                            <button
                                onClick={() => {
                                    toast.dismiss(t.id);
                                    resolve(true);
                                }}
                                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[#f05d23] hover:text-[#d94f1e] hover:bg-[#ffe0b3] transition-colors"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => {
                                    toast.dismiss(t.id);
                                    resolve(false);
                                }}
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

        try {
            const { error: candidateError } = await supabaseServer
                .from("candidates")
                .delete()
                .in("id", selectedIds);
            if (candidateError) throw candidateError;

            const { error: responseError } = await supabaseServer
                .from("responses")
                .delete()
                .in("user_id", selectedIds);
            if (responseError) throw responseError;

            const updatedCandidates = candidates.filter((c) => !selectedIds.includes(c.id));
            setCandidates(updatedCandidates);
            setFilteredCandidates(updatedCandidates);
            setSelectedIds([]);
            toast.success(`${selectedIds.length} candidate(s) deleted successfully!`, { icon: "✅" });
        } catch (error) {
            console.error("Error deleting candidates:", error);
            toast.error("Failed to delete selected candidates.");
        }
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
                    className={`flex-1 p-6 transition-all duration-300 overflow-hidden ${
                        isSidebarOpen ? "md:ml-[300px]" : "md:ml-[80px]"
                    }`}
                >
                    <div className="max-w-6xl mx-auto space-y-6">
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
                            setIsExportModalOpen={setIsExportModalOpen} // Pass export control
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