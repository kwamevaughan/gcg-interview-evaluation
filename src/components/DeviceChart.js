import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function DeviceChart({ candidates, mode }) {
    const deviceCounts = candidates.reduce((acc, c) => {
        acc[c.device || "Unknown"] = (acc[c.device || "Unknown"] || 0) + 1;
        return acc;
    }, {});
    const data = {
        labels: Object.keys(deviceCounts),
        datasets: [{
            label: "Devices",
            data: Object.values(deviceCounts),
            backgroundColor: "#f05d23",
            borderColor: "#d94f1e",
            borderWidth: 1,
        }],
    };

    return (
        <div className={`p-6 rounded-xl shadow-lg animate-scale-up ${mode === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`text-lg font-semibold mb-4 ${mode === "dark" ? "text-white" : "text-[#231812]"}`}>
                Device Usage
            </h3>
            <div className="h-64">
                <Bar
                    data={data}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: { ticks: { color: mode === "dark" ? "#fff" : "#231812" } },
                            y: { ticks: { color: mode === "dark" ? "#fff" : "#231812" } },
                        },
                        plugins: {
                            legend: { display: false },
                            tooltip: { backgroundColor: "#f05d23" },
                        },
                    }}
                />
            </div>
        </div>
    );
}