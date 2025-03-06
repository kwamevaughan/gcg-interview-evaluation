import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Icon } from "@iconify/react";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Tooltip, Legend, ChartDataLabels);

export default function ScoreChart({ candidates, mode, onFilter }) {
    // Aggregate score distribution
    const scoreDistribution = candidates.reduce((acc, c) => {
        const bin = Math.floor(c.score / 20) * 20;
        acc[bin] = (acc[bin] || 0) + 1;
        return acc;
    }, {});

    const labels = Object.keys(scoreDistribution).map((k) => `${k}-${parseInt(k) + 20}`);
    const baseColors = ["#f05d23", "#231812", "#f28c5e", "#4a2e24"];

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Candidates",
                data: Object.values(scoreDistribution),
                backgroundColor: "rgba(240, 93, 35, 0.3)",
                borderColor: "#f05d23",
                pointBackgroundColor: labels.map((_, index) => baseColors[index % baseColors.length]),
                pointBorderColor: mode === "dark" ? "#fff" : "#231812",
                pointHoverBackgroundColor: "#d94f1e",
                borderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: {
                    color: mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(35, 24, 18, 0.2)",
                },
                grid: {
                    color: mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(35, 24, 18, 0.2)",
                },
                ticks: {
                    color: mode === "dark" ? "#fff" : "#231812",
                    backdropColor: "transparent",
                },
                pointLabels: {
                    color: mode === "dark" ? "#fff" : "#231812",
                    font: { size: 14 },
                },
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "rgba(240, 93, 35, 0.9)",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: "#231812",
                borderWidth: 1,
                cornerRadius: 8,
            },
            datalabels: {
                color: mode === "dark" ? "#fff" : "#231812",
                font: { size: 14, weight: "bold" },
                formatter: (value) => value,
                anchor: "end",
                align: "end",
                offset: 10,
                textShadowBlur: 4,
                textShadowColor: mode === "dark" ? "#000" : "#ccc",
            },
        },
        animation: {
            animateScale: true,
            animateRotate: true,
            duration: 2000,
            easing: "easeOutBounce",
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const range = data.labels[index];
                onFilter("score", range);
            }
        },
    };

    return (
        <div
            className={`border-t-4 border-[#f05d23] p-6 rounded-xl shadow-lg hover:shadow-xl animate-fade-in transition-shadow duration-500 animate-scale-up ${
                mode === "dark" ? "bg-gray-800" : "bg-white"
            }`}
        >
            <div className="flex justify-between items-center mb-6">
                <h3
                    className={`text-lg font-semibold ${
                        mode === "dark" ? "text-white" : "text-[#231812]"
                    }`}
                >
                    Score Distribution
                </h3>
                <button
                    className={`p-1 rounded-full ${
                        mode === "dark"
                            ? "text-gray-300 hover:text-white hover:bg-gray-700"
                            : "text-gray-600 hover:text-[#231812] hover:bg-gray-200"
                    } transition-colors`}
                    title="More details"
                    onClick={() => console.log("Ellipsis clicked - future expansion possible")} // Placeholder for future action
                >
                    <Icon icon="mdi:ellipsis-vertical" width={20} height={20} />
                </button>
            </div>
            <div className="h-72">
                <Radar data={data} options={options} />
            </div>
        </div>
    );
}