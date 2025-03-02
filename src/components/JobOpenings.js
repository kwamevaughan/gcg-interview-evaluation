export default function JobOpenings({ candidates, jobOpenings, router, mode }) {
    return (
        <div className={`border-t-4 border-[#f05d23] p-6 rounded-xl shadow-md hover:shadow-none animate-fade-in transition-shadow duration-500 ${mode === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`text-lg font-semibold mb-4 ${mode === "dark" ? "text-white" : "text-[#231812]"}`}>
                Job Openings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {jobOpenings.map((opening) => {
                    const count = candidates.filter(c => c.opening === opening).length;
                    return (
                        <div
                            key={opening}
                            className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all animate-scale-up ${
                                mode === "dark" ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"
                            }`}
                            onClick={() => router.push(`/hr/applicants?opening=${opening}`)}
                        >
                            <p className={`font-medium ${mode === "dark" ? "text-white" : "text-[#231812]"}`}>
                                {opening}
                            </p>
                            <p className={`text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                {count} Applicants
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}