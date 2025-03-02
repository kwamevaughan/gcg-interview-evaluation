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
import useStatusChange from "@/hooks/useStatusChange"; // Import the hook

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

            console.log("Candidates Data:", candidatesData);
            console.log("Responses Data:", responsesData);
            console.log("Questions Data:", questionsData);

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
                const combined = {
                    ...candidate,
                    answers: Array.isArray(parsedAnswers) ? parsedAnswers : [],
                    score: response.score || 0,
                    resumeUrl: response.resume_url,
                    coverLetterUrl: response.cover_letter_url,
                    status: response.status || "Pending",
                    questions: questionsData,
                };
                console.log(`Combined data for ${candidate.full_name}:`, combined);
                return combined;
            });
            setCandidates(combinedData);
            setFilteredCandidates(combinedData);
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
            result = result.filter((c) => c.status === filterStatus);
        }
        setFilteredCandidates(result);
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
                    className={`flex-1 p-6 transition-all duration-300 ${
                        isSidebarOpen ? "md:ml-[300px]" : "md:ml-[80px]"
                    }`}
                >
                    <div className="max-w-6xl mx-auto space-y-10">
                        <ApplicantsFilters
                            candidates={candidates}
                            onFilterChange={handleFilterChange}
                            mode={mode}
                        />
                        <ApplicantsTable
                            candidates={filteredCandidates}
                            mode={mode}
                            onViewCandidate={handleViewCandidate}
                            onSort={handleSort}
                            sortField={sortField}
                            sortDirection={sortDirection}
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

            <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
    );
}