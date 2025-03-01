import { Icon } from "@iconify/react";
import CountUp from "react-countup";

export default function WelcomeCard({ totalApplicants, openPositions, pendingReviews, mode }) {
    return (
        <div
            className={`p-6 rounded-xl shadow-lg mb-6 animate-fade-in ${
                mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-[#231812]"
            }`}
        >
            <h3 className="text-xl font-semibold flex items-center gap-2">
                <Icon icon="mdi:hand-wave" className="w-6 h-6 text-[#f05d23]" />
                Welcome back, HR Team!
            </h3>
            <p className={`text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                    <CountUp end={totalApplicants} duration={2} className="text-3xl font-bold text-[#f05d23]" />
                    <p className="text-sm">Total Applicants</p>
                </div>
                <div className="text-center">
                    <CountUp end={openPositions} duration={2} className="text-3xl font-bold text-[#f05d23]" />
                    <p className="text-sm">Open Positions</p>
                </div>
                <div className="text-center">
                    <CountUp end={pendingReviews} duration={2} className="text-3xl font-bold text-[#f05d23]" />
                    <p className="text-sm">Pending Reviews</p>
                </div>
            </div>
        </div>
    );
}