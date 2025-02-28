// src/components/Step4Confirmation.js
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Icon } from "@iconify/react";

export default function Step4Confirmation({ formData, submissionStatus, mode }) {
    useEffect(() => {
        if (submissionStatus?.success) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#f05d23", "#231812", "#d94f1e"],
            });
        }
    }, [submissionStatus]);

    // Calculate percentage
    const percentage = submissionStatus?.success ? Math.round((submissionStatus.score / 190) * 100) : 0;

    return (
        <div className="animate-fade-in max-w-2xl mx-auto">
            <div
                className={`shadow-lg rounded-lg p-6 border-t-4 border-[#f05d23] ${
                    mode === "dark" ? "bg-gray-800" : "bg-white"
                }`}
            >
                <div className="text-center">
                    <Icon
                        icon={submissionStatus.success ? "mdi:check-circle" : "mdi:alert-circle"}
                        className={`w-16 h-16 mx-auto mb-4 animate-bounce ${
                            submissionStatus.success ? "text-[#f05d23]" : "text-red-500"
                        }`}
                    />
                    <h2
                        className={`text-3xl font-bold mb-4 ${
                            mode === "dark" ? "text-white" : "text-[#231812]"
                        }`}
                    >
                        {submissionStatus.success
                            ? `Thank You, ${formData.fullName}!`
                            : "Submission Failed"}
                    </h2>
                    <p
                        className={`text-lg mb-4 ${
                            mode === "dark" ? "text-gray-300" : "text-[#231812]"
                        }`}
                    >
                        {submissionStatus.success
                            ? "Your application has been successfully submitted."
                            : "Something went wrong. Please try again."}
                    </p>
                    {submissionStatus.success && (
                        <>
                            <p className="text-xl font-semibold text-[#f05d23] mb-6">
                                Your Score: {submissionStatus.score}/190 ({percentage}%)
                            </p>
                            <p
                                className={`text-sm max-w-md mx-auto ${
                                    mode === "dark" ? "text-gray-400" : "text-[#231812]"
                                }`}
                            >
                                We’ve sent a confirmation email to {formData.email}. Please check your inbox (and spam folder) for further details.
                            </p>
                        </>
                    )}
                    {!submissionStatus.success && (
                        <p
                            className={`text-sm text-red-500 max-w-md mx-auto ${
                                mode === "dark" ? "text-red-400" : ""
                            }`}
                        >
                            {submissionStatus.message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}