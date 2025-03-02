// src/components/WelcomeCard.js
import CountUp from "react-countup";

export default function WelcomeCard({ totalApplicants, openPositions, pendingReviews, mode }) {
    return (
        <div
            className={`mt-6 p-6 rounded-xl shadow-md hover:shadow-none animate-fade-in transition-shadow duration-500 border-t-4 border-[#f05d23] mb-6 ${
                mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-[#231812]"
            }`}
        >

            <div className="flex flex-col md:flex-row justify-between items-center mb-8">

            <h3 className="text-xl font-semibold">Welcome back, Growthpad!</h3>
            <p className={`text-sm font-bold ${mode === "dark" ? "text-gray-400" : "text-gray-900"}`}>
                {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })}
            </p>
            </div>
            <div className="flex justify-evenly gap-4 mt-4">
                <div className="text-center">
                    <CountUp end={totalApplicants} duration={2} className="text-3xl font-bold text-[#f05d23]"/>
                    <p className="text-sm">Total Applicants</p>
                </div>
                <div className="text-center">
                    <CountUp end={openPositions} duration={2} className="text-3xl font-bold text-[#f05d23]"/>
                    <p className="text-sm">Open Positions</p>
                </div>
                <div className="text-center">
                    <CountUp end={pendingReviews} duration={2} className="text-3xl font-bold text-[#f05d23]"/>
                    <p className="text-sm">Pending Reviews</p>
                </div>
            </div>
        </div>
    );
}