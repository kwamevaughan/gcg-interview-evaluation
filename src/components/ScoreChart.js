// src/components/ScoreChart.js
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function ScoreChart({ candidates, mode, onFilter }) {
    const scoreDistribution = candidates.reduce((acc, c) => {
        const bin = Math.floor(c.score / 20) * 20;
        acc[bin] = (acc[bin] || 0) + 1;
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

    const labels = Object.keys(scoreDistribution).map(k => `${k}-${parseInt(k) + 20}`);
    const data = {
        labels: labels,
        datasets: [{
            label: "Candidates",
            data: Object.values(scoreDistribution),
            backgroundColor: labels.map((_, index) => colors[index % colors.length]), // Cycle through colors
            borderColor: labels.map((_, index) => hoverColors[index % hoverColors.length]),
            borderWidth: 1,
            hoverBackgroundColor: labels.map((_, index) => hoverColors[index % hoverColors.length]), // Hover matches border
        }],
    };

    return (
        <div className={`border-t-4 border-[#f05d23] p-6 rounded-xl shadow-md hover:shadow-none animate-fade-in transition-shadow duration-500 animate-scale-up ${mode === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`text-lg font-semibold mb-4 ${mode === "dark" ? "text-white" : "text-[#231812]"}`}>
                Score Distribution
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
                                const range = data.labels[index];
                                onFilter("score", range);
                            }
                        },
                    }}
                />
            </div>
        </div>
    );
}