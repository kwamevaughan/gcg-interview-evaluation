// src/components/DeviceChart.js
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function DeviceChart({ candidates, mode, onFilter }) {
    const deviceCounts = candidates.reduce((acc, c) => {
        acc[c.device || "Unknown"] = (acc[c.device || "Unknown"] || 0) + 1;
        return acc;
    }, {});

    // Define a color palette
    const colors = [
        "#f05d23", // Brand orange
        "#231812", // Brand brown
        "#36A2EB", // Blue
        "#4CAF50", // Green
        "#FFCE56", // Yellow
        "#9B59B6", // Purple
    ];
    const hoverColors = [
        "#d94f1e", // Darker orange
        "#4a2e24", // Darker brown
        "#2E8BCF", // Darker blue
        "#43A047", // Darker green
        "#E0B84C", // Darker yellow
        "#8E4BA6", // Darker purple
    ];

    const labels = Object.keys(deviceCounts);
    const data = {
        labels: labels,
        datasets: [{
            label: "Devices",
            data: Object.values(deviceCounts),
            backgroundColor: labels.map((_, index) => colors[index % colors.length]), // Cycle through colors
            borderColor: labels.map((_, index) => hoverColors[index % hoverColors.length]),
            borderWidth: 1,
            hoverBackgroundColor: labels.map((_, index) => hoverColors[index % hoverColors.length]), // Hover matches border
        }],
    };

    return (
        <div className={`border-t-4 border-[#f05d23] p-6 rounded-xl shadow-md hover:shadow-none animate-fade-in transition-shadow duration-500 animate-scale-up ${mode === "dark" ? "bg-gray-800" : "bg-white"}`}>
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
                            tooltip: { backgroundColor: "#f05d23" }, // Keep tooltip consistent
                        },
                        onClick: (e, elements) => {
                            if (elements.length > 0) {
                                const index = elements[0].index;
                                const device = data.labels[index];
                                onFilter("device", device);
                            }
                        },
                    }}
                />
            </div>
        </div>
    );
}