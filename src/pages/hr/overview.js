// src/pages/hr/HROverview.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import toast, { Toaster } from "react-hot-toast";
import { Icon } from "@iconify/react";
import HRSidebar from "@/layouts/hrSidebar";
import HRHeader from "@/layouts/hrHeader";
import useSidebar from "@/hooks/useSidebar";
import { supabaseServer } from "@/lib/supabaseServer";
import SimpleFooter from "@/layouts/simpleFooter";
import WelcomeCard from "@/components/WelcomeCard";
import StatusChart from "@/components/StatusChart";
import ScoreChart from "@/components/ScoreChart";
import ScoreTrend from "@/components/ScoreTrend";
import RecentActivity from "@/components/RecentActivity";
import JobOpenings from "@/components/JobOpenings";
import TopPerformers from "@/components/TopPerformers";
import DeviceChart from "@/components/DeviceChart";
import EmailModal from "@/components/EmailModal";
import CandidateModal from "@/components/CandidateModal";

// Dynamic import for CountryChart to disable SSR
const CountryChart = dynamic(() => import("@/components/CountryChart"), { ssr: false });

// Import country code to name mapping at the top
import countriesGeoJson from "../../data/countries.js"; // Adjusted path from src/pages/hr/

// Map country codes to full names
const countryCodeToName = countriesGeoJson.features.reduce((acc, feature) => {
    acc[feature.properties.iso_a2.toUpperCase()] = feature.properties.sovereignt;
    return acc;
}, {});

export default function HROverview({ mode = "light", toggleMode }) {
    const [candidates, setCandidates] = useState([]);
    const [jobOpenings, setJobOpenings] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [filterType, setFilterType] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [emailData, setEmailData] = useState({ subject: "", body: "", email: "" });
    const { isSidebarOpen, toggleSidebar } = useSidebar();
    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem("hr_session")) {
            router.push("/hr/login");
        } else {
            fetchData();
        }
    }, [router]);

    const fetchData = async () => {
        const loadingToast = toast.loading("Loading data...");
        try {
            const { data: candidatesData, error: candidatesError } = await supabaseServer
                .from("candidates")
                .select("id, full_name, email, phone, linkedin, opening");
            if (candidatesError) throw candidatesError;

            const { data: responsesData, error: responsesError } = await supabaseServer
                .from("responses")
                .select("user_id, answers, score, resume_url, cover_letter_url, status, country, device, submitted_at");
            if (responsesError) throw responsesError;

            const { data: questionsData, error: questionsError } = await supabaseServer
                .from("interview_questions")
                .select("*")
                .order("order", { ascending: true });
            if (questionsError) throw questionsError;

            const combinedData = candidatesData.map((candidate) => {
                const response = responsesData.find((r) => r.user_id === candidate.id) || {};
                let parsedAnswers = [];
                if (response.answers) {
                    if (typeof response.answers === "string") {
                        try {
                            parsedAnswers = JSON.parse(response.answers);
                        } catch (e) {
                            parsedAnswers = response.answers.split(",").map((a) => a.trim());
                        }
                    } else if (Array.isArray(response.answers)) {
                        parsedAnswers = response.answers;
                    }
                }
                return {
                    ...candidate,
                    answers: Array.isArray(parsedAnswers) ? parsedAnswers : [],
                    score: response.score || 0,
                    resumeUrl: response.resume_url,
                    coverLetterUrl: response.cover_letter_url,
                    status: response.status || "Pending",
                    country: response.country ? response.country.toUpperCase() : "Unknown", // Normalize to uppercase
                    device: response.device || "Unknown",
                    submitted_at: response.submitted_at || null,
                    questions: questionsData,
                };
            });
            setCandidates(combinedData);
            setQuestions(questionsData);
            setJobOpenings([...new Set(combinedData.map((c) => c.opening))]);
            toast.success("Data loaded successfully!", { id: loadingToast });
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load overview data.", { id: loadingToast });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("hr_session");
        toast.success("Logged out successfully!");
        setTimeout(() => router.push("/hr/login"), 1000);
    };

    const handleSendEmail = async () => {
        const sendingToast = toast.loading("Sending email...");
        try {
            const response = await fetch("/api/send-status-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: emailData.fullName,
                    email: emailData.email,
                    opening: emailData.opening,
                    status: emailData.status,
                    subject: emailData.subject,
                    body: emailData.body,
                }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Failed to send email");

            toast.success("Email sent successfully!", { icon: "✅", id: sendingToast });
            setIsEmailModalOpen(false);
        } catch (error) {
            console.error("Error sending email:", error);
            toast.error("Failed to send email.", { id: sendingToast });
        }
    };

    const handleChartFilter = (type, value) => {
        console.log(`Opening modal for ${type}: ${value}`);
        let filtered;
        switch (type) {
            case "status":
                filtered = candidates.filter((c) => c.status === value);
                toast.success(`Showing ${value} candidates`, { duration: 2000 });
                break;
            case "score":
                const [min, max] = value.split("-").map(Number);
                filtered = candidates.filter((c) => c.score >= min && c.score < max);
                toast.success(`Showing scores ${value}`, { duration: 2000 });
                break;
            case "country":
                // Match by full name (case-insensitive) or code (uppercase)
                filtered = candidates.filter((c) => {
                    const countryCode = (c.country || "Unknown").toUpperCase();
                    const fullName = countryCodeToName[countryCode] || countryCode;
                    return fullName.toLowerCase() === value.toLowerCase() || countryCode === value.toUpperCase();
                });
                toast.success(`Showing ${value} applicants`, { duration: 2000 });
                break;
            case "device":
                filtered = candidates.filter((c) => c.device === value);
                toast.success(`Showing ${value} devices`, { duration: 2000 });
                break;
            case "date":
                const date = new Date(value).toDateString();
                filtered = candidates.filter((c) => new Date(c.submitted_at).toDateString() === date);
                toast.success(`Showing applicants from ${date}`, { duration: 2000 });
                break;
            default:
                filtered = candidates;
                toast.success("Showing all candidates", { duration: 2000 });
        }
        setFilteredCandidates(filtered);
        setFilterType(type);
        setFilterValue(value);
        setIsFilterModalOpen(true);
    };

    const handleCloseCandidateModal = () => {
        setIsCandidateModalOpen(false);
        setSelectedCandidate(null);
    };

    const handleCloseFilterModal = () => {
        setIsFilterModalOpen(false);
        setFilteredCandidates([]);
        setFilterType("");
        setFilterValue("");
    };

    const handleStatusChange = async (candidateId, newStatus) => {
        try {
            const { error } = await supabaseServer
                .from("responses")
                .update({ status: newStatus })
                .eq("user_id", candidateId);
            if (error) throw error;

            const updatedCandidates = candidates.map((c) =>
                c.id === candidateId ? { ...c, status: newStatus } : c
            );
            setCandidates(updatedCandidates);
            if (filteredCandidates.length > 0) {
                setFilteredCandidates(
                    filteredCandidates.map((c) =>
                        c.id === candidateId ? { ...c, status: newStatus } : c
                    )
                );
            }
            if (selectedCandidate && selectedCandidate.id === candidateId) {
                setSelectedCandidate({ ...selectedCandidate, status: newStatus });
            }
            toast.success(`Status updated to ${newStatus}!`, { duration: 2000 });
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status.");
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
                pageName="HR Overview"
                pageDescription="View and manage candidate applications."
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
                    <div className="max-w-7xl mx-auto">
                        <WelcomeCard
                            totalApplicants={candidates.length}
                            openPositions={jobOpenings.length}
                            pendingReviews={candidates.filter((c) => c.status === "Pending").length}
                            mode={mode}
                        />
                        {/* Full-width CountryChart */}
                        <div className="mb-6">
                            <CountryChart candidates={candidates} mode={mode} onFilter={handleChartFilter} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <StatusChart candidates={candidates} mode={mode} onFilter={handleChartFilter} />
                            <DeviceChart candidates={candidates} mode={mode} onFilter={handleChartFilter} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <ScoreChart candidates={candidates} mode={mode} onFilter={handleChartFilter} />
                            <ScoreTrend candidates={candidates} mode={mode} onFilter={handleChartFilter} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <TopPerformers
                                candidates={candidates}
                                setEmailData={setEmailData}
                                setIsEmailModalOpen={setIsEmailModalOpen}
                                mode={mode}
                            />
                            <RecentActivity
                                candidates={candidates}
                                setSelectedCandidate={setSelectedCandidate}
                                setIsModalOpen={setIsCandidateModalOpen}
                                mode={mode}
                            />
                        </div>
                        <JobOpenings candidates={candidates} jobOpenings={jobOpenings} router={router} mode={mode} />
                    </div>
                </div>
            </div>

            <EmailModal
                candidate={emailData}
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                emailData={emailData}
                setEmailData={setEmailData}
                onSend={handleSendEmail}
                mode={mode}
            />
            <CandidateModal
                candidate={selectedCandidate}
                isOpen={isCandidateModalOpen}
                onClose={handleCloseCandidateModal}
                onStatusChange={handleStatusChange}
                mode={mode}
            />
            {isFilterModalOpen && (
                <ChartFilterModal
                    candidates={filteredCandidates}
                    type={filterType}
                    value={filterValue}
                    onClose={handleCloseFilterModal}
                    setSelectedCandidate={setSelectedCandidate}
                    setIsCandidateModalOpen={setIsCandidateModalOpen}
                    mode={mode}
                />
            )}

            <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
    );
}

function ChartFilterModal({
                              candidates,
                              type,
                              value,
                              onClose,
                              setSelectedCandidate,
                              setIsCandidateModalOpen,
                              mode,
                          }) {
    const handleViewClick = (candidate) => {
        setSelectedCandidate(candidate);
        setIsCandidateModalOpen(true);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div
                className={`rounded-xl shadow-2xl w-full max-w-4xl mx-4 flex flex-col max-h-[90vh] ${
                    mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-[#231812]"
                }`}
            >
                <div className="bg-gradient-to-r from-[#f05d23] to-[#d94f1e] rounded-t-xl p-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                        {type === "status" && `Status: ${value}`}
                        {type === "country" && `Country: ${value}`}
                        {type === "score" && `Score Range: ${value}`}
                        {type === "device" && `Device: ${value}`}
                        {type === "date" && `Date: ${new Date(value).toLocaleDateString()}`}
                    </h2>
                    <button onClick={onClose} className="text-white hover:text-gray-200 transition duration-200">
                        <Icon icon="mdi:close" width={24} height={24} />
                    </button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                    {candidates.length > 0 ? (
                        <ul className="space-y-4">
                            {candidates.map((candidate) => (
                                <li
                                    key={candidate.id}
                                    className="flex justify-between items-center animate-fade-in"
                                >
                                    <span
                                        className={`${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}
                                    >
                                        {candidate.full_name} - {candidate.opening} (Score: {candidate.score})
                                    </span>
                                    <button
                                        onClick={() => handleViewClick(candidate)}
                                        className="text-[#f05d23] hover:text-[#d94f1e] flex items-center gap-1"
                                    >
                                        <Icon icon="mdi:eye" className="w-4 h-4" /> View
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">
                            No candidates match this filter.
                        </p>
                    )}
                </div>
                <div
                    className={`p-4 border-t border-gray-200 dark:border-gray-700 rounded-b-xl shadow-md ${
                        mode === "dark" ? "bg-gray-800" : "bg-white"
                    }`}
                >
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-[#231812] dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-200 flex items-center gap-2 shadow-md"
                        >
                            <Icon icon="mdi:close" width={20} height={20} />
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}