// src/components/ScoreChart.js
import { Radar } from "react-chartjs-2"; // Changed from Bar to Radar
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // For counts

ChartJS.register(RadialLinearScale, PointElement, LineElement, Tooltip, Legend, ChartDataLabels);

export default function ScoreChart({ candidates, mode, onFilter }) {
    // Aggregate score distribution
    const scoreDistribution = candidates.reduce((acc, c) => {
        const bin = Math.floor(c.score / 20) * 20;
        acc[bin] = (acc[bin] || 0) + 1;
        return acc;
    }, {});

    // Brand-based color palette with gradients
    const labels = Object.keys(scoreDistribution).map((k) => `${k}-${parseInt(k) + 20}`);
    const baseColors = [
        "#f05d23", // Main orange
        "#231812", // Secondary brown
        "#f28c5e", // Lighter orange
        "#4a2e24", // Darker brown
    ];

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Candidates",
                data: Object.values(scoreDistribution),
                backgroundColor: "rgba(240, 93, 35, 0.3)", // Semi-transparent #f05d23 fill
                borderColor: "#f05d23", // Solid #f05d23 line
                pointBackgroundColor: labels.map((_, index) => baseColors[index % baseColors.length]), // Points use brand colors
                pointBorderColor: mode === "dark" ? "#fff" : "#231812",
                pointHoverBackgroundColor: "#d94f1e", // Darker orange on hover
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
                    color: mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(35, 24, 18, 0.2)", // Subtle angle lines
                },
                grid: {
                    color: mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(35, 24, 18, 0.2)", // Subtle grid
                },
                ticks: {
                    color: mode === "dark" ? "#fff" : "#231812",
                    backdropColor: "transparent", // Remove tick background
                },
                pointLabels: {
                    color: mode === "dark" ? "#fff" : "#231812",
                    font: { size: 14 },
                },
            },
        },
        plugins: {
            legend: {
                display: false, // Hide legend since it's a single dataset
            },
            tooltip: {
                backgroundColor: "rgba(240, 93, 35, 0.9)", // #f05d23 with opacity
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: "#231812",
                borderWidth: 1,
                cornerRadius: 8,
            },
            datalabels: {
                color: mode === "dark" ? "#fff" : "#231812", // White in dark mode, brown in light
                font: {
                    size: 14,
                    weight: "bold",
                },
                formatter: (value) => value, // Display count
                anchor: "end", // Position outside the point
                align: "end",
                offset: 10, // Distance from point
                textShadowBlur: 4,
                textShadowColor: mode === "dark" ? "#000" : "#ccc",
            },
        },
        animation: {
            animateScale: true, // Scale in from center
            animateRotate: true, // Rotate in
            duration: 2000, // 2-second animation
            easing: "easeOutBounce", // Bouncy effect
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
            <h3
                className={`text-lg font-semibold mb-6 ${
                    mode === "dark" ? "text-white" : "text-[#231812]"
                }`}
            >
                Score Distribution
            </h3>
            <div className="h-72"> {/* Increased height for better visuals */}
                <Radar data={data} options={options} />
            </div>
        </div>
    );
}