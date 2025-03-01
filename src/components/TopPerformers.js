import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

export default function TopPerformers({ candidates, setEmailData, setIsEmailModalOpen, mode }) {
    const topThree = candidates.sort((a, b) => b.score - a.score).slice(0, 3);

    const handleEmailClick = (candidate) => {
        toast.loading("Preparing email...");
        setEmailData({
            fullName: candidate.full_name,
            email: candidate.email,
            opening: candidate.opening,
            status: candidate.status,
            subject: `Congratulations, ${candidate.full_name}!`,
            body: `<p>Dear ${candidate.full_name},</p><p>We’re impressed with your score of ${candidate.score}!</p><p>Next steps...</p>`,
        });
        setIsEmailModalOpen(true);
        toast.dismiss(); // Clear loading toast
    };

    return (
        <div className={`p-6 rounded-xl shadow-lg mb-6 ${mode === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`text-lg font-semibold mb-4 ${mode === "dark" ? "text-white" : "text-[#231812]"}`}>
                Top Performers
            </h3>
            <ul className="space-y-4">
                {topThree.map((candidate) => (
                    <li key={candidate.id} className="flex justify-between items-center animate-fade-in">
                        <div>
                            <p className={`${mode === "dark" ? "text-white" : "text-[#231812]"} font-medium`}>
                                {candidate.full_name} - {candidate.opening}
                            </p>
                            <p className={`text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                Score: {candidate.score}
                            </p>
                        </div>
                        <button
                            onClick={() => handleEmailClick(candidate)}
                            className="text-[#f05d23] hover:text-[#d94f1e] flex items-center gap-1"
                        >
                            <Icon icon="mdi:email" className="w-4 h-4" /> Email
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}