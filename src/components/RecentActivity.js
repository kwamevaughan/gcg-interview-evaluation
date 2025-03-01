import { Icon } from "@iconify/react";

export default function RecentActivity({ candidates, setSelectedCandidate, setIsModalOpen, mode }) {
    const recent = candidates.slice(0, 5);

    const handleViewClick = (candidate) => {
        setSelectedCandidate(candidate);
        setIsModalOpen(true);
    };

    return (
        <div className={`p-6 rounded-xl shadow-lg mb-6 ${mode === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`text-lg font-semibold mb-4 ${mode === "dark" ? "text-white" : "text-[#231812]"}`}>
                Recent Activity
            </h3>
            <ul className="space-y-4">
                {recent.map((candidate) => (
                    <li key={candidate.id} className="flex justify-between items-center animate-fade-in">
                        <span className={`${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                            {candidate.full_name} applied for {candidate.opening}
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
        </div>
    );
}