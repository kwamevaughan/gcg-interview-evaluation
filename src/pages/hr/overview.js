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
    const [jobOpenings, setJobOpenings] = useState([]);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [emailData, setEmailData] = useState({ subject: "", body: "" });
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
                let parsedAnswers;
                try {
                    parsedAnswers = response.answers ? JSON.parse(response.answers) : [];
                } catch (e) {
                    parsedAnswers = response.answers ? response.answers.split(",").map(a => a.trim()) : [];
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
            setJobOpenings([...new Set(combinedData.map((c) => c.opening))]);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load overview data.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("hr_session");
        toast.success("Logged out successfully!");
        setTimeout(() => router.push("/hr/login"), 1000);
    };

    const handleSendEmail = async () => {
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

                        <WelcomeCard
                            totalApplicants={candidates.length}
                            openPositions={jobOpenings.length}
                            pendingReviews={candidates.filter(c => c.status === "Pending").length}
                            mode={mode}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            <StatusChart candidates={candidates} mode={mode} />
                            <ScoreChart candidates={candidates} mode={mode} />
                            <CountryChart candidates={candidates} mode={mode} />
                            <DeviceChart candidates={candidates} mode={mode} />
                            <ScoreTrend candidates={candidates} mode={mode} />
                            <TopPerformers
                                candidates={candidates}
                                setEmailData={setEmailData}
                                setIsEmailModalOpen={setIsEmailModalOpen}
                                mode={mode}
                            />
                        </div>

                        <RecentActivity candidates={candidates} router={router} mode={mode} />
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