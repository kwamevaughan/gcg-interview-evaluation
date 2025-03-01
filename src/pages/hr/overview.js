// src/pages/hr/HROverview.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
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
import CountryChart from "@/components/CountryChart";
import DeviceChart from "@/components/DeviceChart";
import EmailModal from "@/components/EmailModal";
import { Icon } from "@iconify/react";

export default function HROverview({ mode = "light", toggleMode }) {
    const [candidates, setCandidates] = useState([]);
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [jobOpenings, setJobOpenings] = useState([]);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
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

            const combinedData = candidatesData.map((candidate) => {
                const response = responsesData.find((r) => r.user_id === candidate.id) || {};
                let parsedAnswers = [];
                if (response.answers) {
                    if (typeof response.answers === "string") {
                        try {
                            parsedAnswers = JSON.parse(response.answers);
                        } catch (e) {
                            parsedAnswers = response.answers.split(",").map(a => a.trim());
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
                    country: response.country || "Unknown",
                    device: response.device || "Unknown",
                    submitted_at: response.submitted_at || null,
                };
            });
            setCandidates(combinedData);
            setFilteredCandidates(combinedData);
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
        let filtered;
        switch (type) {
            case "status":
                filtered = candidates.filter(c => c.status === value);
                toast.success(`Showing ${value} candidates`, { duration: 2000 });
                break;
            case "score":
                const [min, max] = value.split("-").map(Number);
                filtered = candidates.filter(c => c.score >= min && c.score < max);
                toast.success(`Showing scores ${value}`, { duration: 2000 });
                break;
            case "country":
                filtered = candidates.filter(c => c.country === value);
                toast.success(`Showing ${value} applicants`, { duration: 2000 });
                break;
            case "device":
                filtered = candidates.filter(c => c.device === value);
                toast.success(`Showing ${value} devices`, { duration: 2000 });
                break;
            case "date":
                const date = new Date(value).toDateString();
                filtered = candidates.filter(c => new Date(c.submitted_at).toDateString() === date);
                toast.success(`Showing applicants from ${date}`, { duration: 2000 });
                break;
            default:
                filtered = candidates;
                toast.success("Reset filters", { duration: 2000 });
        }
        setFilteredCandidates(filtered);
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
                        <h2
                            className={`text-3xl font-bold mb-8 flex items-center gap-2 ${
                                mode === "dark" ? "text-white" : "text-[#231812]"
                            }`}
                        >
                            <Icon icon="mdi:dashboard" className="w-8 h-8 text-[#f05d23]" />
                            HR Overview
                        </h2>

                        {/* Full-width Welcome Card */}
                        <WelcomeCard
                            totalApplicants={candidates.length}
                            openPositions={jobOpenings.length}
                            pendingReviews={candidates.filter(c => c.status === "Pending").length}
                            mode={mode}
                        />

                        {/* 3-Column Chart Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <StatusChart candidates={candidates} mode={mode} onFilter={value => handleChartFilter("status", value)} />
                            <ScoreChart candidates={candidates} mode={mode} onFilter={value => handleChartFilter("score", value)} />
                            <CountryChart candidates={candidates} mode={mode} onFilter={value => handleChartFilter("country", value)} />
                        </div>

                        {/* Full-width Score Trend */}
                        <div className="mb-6">
                            <ScoreTrend candidates={candidates} mode={mode} onFilter={value => handleChartFilter("date", value)} />
                        </div>

                        {/* 2-Column Widgets */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <TopPerformers
                                candidates={candidates}
                                setEmailData={setEmailData}
                                setIsEmailModalOpen={setIsEmailModalOpen}
                                mode={mode}
                            />
                            <RecentActivity candidates={filteredCandidates} router={router} mode={mode} />
                        </div>

                        {/* Full-width Job Openings */}
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

            <SimpleFooter mode={mode} />
        </div>
    );
}