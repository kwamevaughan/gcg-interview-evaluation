import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CountryChart({ candidates, mode }) {
    const countryCounts = candidates.reduce((acc, c) => {
        acc[c.country || "Unknown"] = (acc[c.country || "Unknown"] || 0) + 1;
        return acc;
    }, {});
    const data = {
        labels: Object.keys(countryCounts),
        datasets: [{
            data: Object.values(countryCounts),
            backgroundColor: ["#f05d23", "#36A2EB", "#4CAF50", "#FF6384", "#FFCE56"],
            hoverBackgroundColor: ["#d94f1e", "#2E8BCF", "#43A047", "#E05575", "#E0B84C"],
        }],
    };

    return (
        <div className={`p-6 rounded-xl shadow-lg animate-scale-up ${mode === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`text-lg font-semibold mb-4 ${mode === "dark" ? "text-white" : "text-[#231812]"}`}>
                Applicants by Country
            </h3>
            <div className="h-64">
                <Pie
                    data={data}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: "bottom", labels: { color: mode === "dark" ? "#fff" : "#231812" } },
                            tooltip: { backgroundColor: "#f05d23" },
                        },
                    }}
                />
            </div>
        </div>
    );
}