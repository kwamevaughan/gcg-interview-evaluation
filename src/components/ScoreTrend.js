// src/components/ScoreTrend.js
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, TimeScale, LinearScale, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chartjs-adapter-date-fns";

ChartJS.register(LineElement, PointElement, TimeScale, LinearScale, Tooltip, Legend, ChartDataLabels);

export default function ScoreTrend({ candidates, mode, onFilter }) {
    // Map scores by date
    const scoresByDate = candidates
        .map((c) => ({
            x: new Date(c.submitted_at).getTime(),
            y: c.score,
            date: new Date(c.submitted_at).toISOString().split("T")[0], // For onFilter
        }))
        .sort((a, b) => a.x - b.x);

    // Gradient function for area fill
    const createGradient = (ctx, chartArea) => {
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, "rgba(240, 93, 35, 0)"); // Fade to transparent
        gradient.addColorStop(1, "rgba(240, 93, 35, 0.5)"); // #f05d23 with opacity
        return gradient;
    };

    const data = {
        datasets: [
            {
                label: "Scores Over Time",
                data: scoresByDate,
                borderColor: "#f05d23",
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return null;
                    return createGradient(ctx, chartArea);
                },
                pointBackgroundColor: "#f05d23",
                pointBorderColor: mode === "dark" ? "#fff" : "#231812",
                pointHoverBackgroundColor: "#d94f1e",
                fill: true,
                tension: 0.4, // Smooth curve
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointStyle: "circle",
                pointBorderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: "time",
                time: {
                    unit: "day",
                    tooltipFormat: "MMM d, yyyy",
                    displayFormats: { day: "MMM d" },
                },
                ticks: {
                    color: mode === "dark" ? "#fff" : "#231812",
                    maxTicksLimit: 10, // Limit for readability
                },
                grid: {
                    color: mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(35, 24, 18, 0.1)",
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: mode === "dark" ? "#fff" : "#231812",
                    stepSize: 20,
                },
                grid: {
                    color: mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(35, 24, 18, 0.1)",
                },
            },
        },
        plugins: {
            legend: {
                display: false, // Single dataset
            },
            tooltip: {
                backgroundColor: "rgba(240, 93, 35, 0.9)",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: "#231812",
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: {
                    label: (context) => `Score: ${context.raw.y}`,
                },
            },
            datalabels: {
                color: mode === "dark" ? "#fff" : "#231812",
                font: { size: 12, weight: "bold" },
                formatter: (value) => value.y, // Show score value
                anchor: "end",
                align: "top",
                offset: 5,
                textShadowBlur: 4,
                textShadowColor: mode === "dark" ? "#000" : "#ccc",
            },
        },
        animation: {
            animateScale: true,
            animateRotate: true,
            duration: 2000,
            easing: "easeOutBounce", // Bouncy effect
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const date = scoresByDate[index].date; // Use ISO date for onFilter
                onFilter("date", date);
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
                Score Trend Over Time
            </h3>
            <div className="h-72">
                <Line data={data} options={options} />
            </div>
        </div>
    );
}