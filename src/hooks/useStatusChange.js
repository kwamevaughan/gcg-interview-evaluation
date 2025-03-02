// src/hooks/useStatusChange.js
import { useState } from "react";
import toast from "react-hot-toast";
import { supabaseServer } from "@/lib/supabaseServer";

const useStatusChange = ({
                             candidates,
                             setCandidates,
                             setFilteredCandidates,
                             setSelectedCandidate,
                             setEmailData,
                             setIsEmailModalOpen,
                         }) => {
    const handleStatusChange = async (candidateId, newStatus) => {
        try {
            const statusToastId = toast.loading(`Updating status to ${newStatus}...`);

            const candidate = candidates.find((c) => c.id === candidateId);
            const answers = candidate.answers.length > 0 ? candidate.answers : [];

            const { error } = await supabaseServer
                .from("responses")
                .upsert(
                    {
                        user_id: candidateId,
                        answers: answers,
                        status: newStatus,
                        score: candidate.score || 0,
                        resume_url: candidate.resumeUrl,
                        cover_letter_url: candidate.coverLetterUrl,
                        country: candidate.country,
                        device: candidate.device,
                        submitted_at: candidate.submitted_at,
                    },
                    { onConflict: ["user_id"] }
                )
                .eq("user_id", candidateId);
            if (error) throw error;

            const updatedCandidates = candidates.map((c) =>
                c.id === candidateId ? { ...c, status: newStatus } : c
            );
            setCandidates(updatedCandidates);
            if (setFilteredCandidates) {
                setFilteredCandidates(
                    updatedCandidates.filter((c) =>
                        candidates.some((fc) => fc.id === c.id)
                    )
                );
            }
            if (setSelectedCandidate) {
                setSelectedCandidate((prev) =>
                    prev && prev.id === candidateId ? { ...prev, status: newStatus } : prev
                );
            }

            toast.dismiss(statusToastId);
            toast.success(`Status updated to ${newStatus}!`, { duration: 2000 });

            if (["Reviewed", "Shortlisted", "Rejected"].includes(newStatus)) {
                const response = await fetch(
                    `/api/get-email-template?status=${newStatus}&fullName=${encodeURIComponent(
                        candidate.full_name
                    )}&opening=${encodeURIComponent(candidate.opening)}`
                );
                const { template } = await response.json();
                if (!response.ok) throw new Error("Failed to fetch email template");

                const emailPayload = {
                    fullName: candidate.full_name,
                    email: candidate.email,
                    opening: candidate.opening,
                    status: newStatus,
                    subject: {
                        Reviewed: `Application Reviewed for ${candidate.opening} - Growthpad Consulting Group`,
                        Shortlisted: `Congratulations! You've Been Shortlisted for ${candidate.opening} - Growthpad Consulting Group`,
                        Rejected: `Application Update for ${candidate.opening} - Growthpad Consulting Group`,
                    }[newStatus],
                    body: template,
                };
                setEmailData(emailPayload);

                toast.custom(
                    (t) => (
                        <div
                            className={`${
                                t.visible ? "animate-enter" : "animate-leave"
                            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                        >
                            <div className="flex-1 w-0 p-4">
                                <div className="flex items-start">
                                    <div className="ml-3 flex-1">
                                        <p className="text-xl font-medium text-gray-900">
                                            Send email notification?
                                        </p>
                                        <p className="mt-2 text-base text-gray-500">
                                            Would you like to notify {candidate.full_name} about their{" "}
                                            {newStatus.toLowerCase()} status?
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex border-l border-gray-200">
                                <button
                                    onClick={() => {
                                        toast.dismiss(t.id);
                                        setIsEmailModalOpen(true);
                                    }}
                                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[#f05d23] hover:text-[#d94f1e] hover:bg-[#ffe0b3] transition-colors focus:outline-none"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => {
                                        toast.dismiss(t.id);
                                    }}
                                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 hover:bg-[#f3f4f6] transition-colors focus:outline-none"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    ),
                    { duration: Infinity }
                );
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(`Failed to update status: ${error.message}`);
        }
    };

    return { handleStatusChange };
};

export default useStatusChange;