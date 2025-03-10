import { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, TimeScale, LinearScale, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chartjs-adapter-date-fns";
import { Icon } from "@iconify/react"; // Already imported

ChartJS.register(LineElement, PointElement, TimeScale, LinearScale, Tooltip, Legend, ChartDataLabels);

export default function ScoreTrend({ candidates, mode, onFilter }) {
    const [timeFilter, setTimeFilter] = useState("current");
    const currentYear = new Date().getFullYear();

    const scoresByDate = candidates
        .map((c) => ({
            x: new Date(c.submitted_at).getTime(),
            y: c.score,
            date: new Date(c.submitted_at).toISOString().split("T")[0],
        }))
        .filter((entry) => {
            const year = new Date(entry.x).getFullYear();
            if (timeFilter === "current") return year === currentYear && !isNaN(entry.x);
            if (timeFilter === "last") return year === currentYear - 1 && !isNaN(entry.x);
            return !isNaN(entry.x); // "all" includes all valid dates
        })
        .sort((a, b) => a.x - b.x);

    const createGradient = (ctx, chartArea) => {
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, "rgba(240, 93, 35, 0)");
        gradient.addColorStop(1, "rgba(240, 93, 35, 0.5)");
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
                tension: 0.4,
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
                    maxTicksLimit: 10,
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
            legend: { display: false },
            tooltip: {
                backgroundColor: "rgba(240, 93, 35, 0.9)",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: "#231812",
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: { label: (context) => `Score: ${context.raw.y}` },
            },
            datalabels: {
                color: mode === "dark" ? "#fff" : "#231812",
                font: { size: 12, weight: "bold" },
                formatter: (value) => value.y,
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
            easing: "easeOutBounce",
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const date = scoresByDate[index].date;
                onFilter("date", date);
            }
        },
    };

    const handleFilterChange = (filter) => {
        setTimeFilter(filter);
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
                    Score Trend Over Time
                </h3>
                <div className="flex items-center space-x-2">
                    <select
                        value={timeFilter}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className={`text-sm p-1 rounded border ${
                            mode === "dark"
                                ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                                : "bg-gray-200 text-[#231812] border-gray-300 hover:bg-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-[#f05d23] transition-colors`}
                    >
                        <option value="current">Current Year ({currentYear})</option>
                        <option value="last">Last Year ({currentYear - 1})</option>
                        <option value="all">All Time</option>
                    </select>
                    {timeFilter !== "all" && (
                        <button
                            onClick={() => handleFilterChange("all")}
                            className={`p-1 rounded-full ${
                                mode === "dark"
                                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                                    : "text-gray-600 hover:text-[#231812] hover:bg-gray-200"
                            } transition-colors`}
                            title="Show all time"
                        >
                            <Icon icon="mdi:ellipsis-vertical" width={20} height={20} />
                        </button>
                    )}
                </div>
            </div>
            <div className="h-72">
                <Line data={data} options={options} />
            </div>
        </div>
    );
}