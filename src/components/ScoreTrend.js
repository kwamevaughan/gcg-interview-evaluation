import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    TimeScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chartjs-adapter-date-fns";
import "chartjs-plugin-zoom";
import { Icon } from "@iconify/react";

ChartJS.register(
    LineElement,
    PointElement,
    TimeScale,
    LinearScale,
    Tooltip,
    Legend,
    ChartDataLabels,
    "zoom"
);

export default function ScoreTrend({ candidates, mode, onFilter }) {
    const [timeFilter, setTimeFilter] = useState("current");
    const [showLabels, setShowLabels] = useState(false);
    const currentYear = new Date().getFullYear();

    // Aggregate scores by day
    const scoresByDateRaw = candidates
        .map((c) => ({
            x: new Date(c.submitted_at).getTime(),
            y: c.score,
            date: new Date(c.submitted_at).toISOString().split("T")[0],
        }))
        .filter((entry) => {
            const year = new Date(entry.x).getFullYear();
            if (timeFilter === "current") return year === currentYear && !isNaN(entry.x);
            if (timeFilter === "last") return year === currentYear - 1 && !isNaN(entry.x);
            return !isNaN(entry.x);
        });

    const aggregateByDay = scoresByDateRaw.reduce((acc, curr) => {
        const date = curr.date;
        if (!acc[date]) acc[date] = { sum: 0, count: 0, x: curr.x };
        acc[date].sum += curr.y;
        acc[date].count += 1;
        return acc;
    }, {});

    const scoresByDate = Object.entries(aggregateByDay)
        .map(([date, { sum, count, x }]) => ({
            x,
            y: sum / count,
            date,
        }))
        .sort((a, b) => a.x - b.x);

    // Log to verify aggregation
    console.log("Aggregated scoresByDate:", scoresByDate);

    const createGradient = (ctx, chartArea) => {
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, "rgba(240, 93, 35, 0)");
        gradient.addColorStop(1, "rgba(240, 93, 35, 0.8)"); // More opaque for visibility
        return gradient;
    };

    const data = {
        datasets: [
            {
                label: "Daily Average Scores",
                data: scoresByDate,
                borderColor: "#f05d23",
                backgroundColor: (context) => {
                    const { ctx, chartArea } = context.chart;
                    if (!chartArea) return null;
                    return createGradient(ctx, chartArea);
                },
                pointBackgroundColor: "#f05d23",
                pointBorderColor: mode === "dark" ? "#fff" : "#231812",
                pointHoverBackgroundColor: "#d94f1e",
                fill: true,
                tension: 0.4,
                borderWidth: 4, // Thicker line
                pointRadius: scoresByDate.length > 30 ? 3 : 6, // Adjusted threshold
                pointHoverRadius: scoresByDate.length > 30 ? 6 : 10,
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
                    maxTicksLimit: 8, // Fewer ticks for clarity
                },
                grid: {
                    color: mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(35, 24, 18, 0.2)",
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: mode === "dark" ? "#fff" : "#231812",
                    stepSize: 20,
                },
                grid: {
                    color: mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(35, 24, 18, 0.2)",
                },
            },
        },
        plugins: {
            legend: { display: true, position: "top" }, // Show legend for clarity
            tooltip: {
                backgroundColor: "rgba(240, 93, 35, 0.9)",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: "#231812",
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: { label: (context) => `Avg Score: ${context.raw.y.toFixed(1)}` },
            },
            datalabels: {
                display: showLabels,
                color: mode === "dark" ? "#fff" : "#231812",
                font: { size: 14, weight: "bold" }, // Larger labels
                formatter: (value) => value.y.toFixed(1),
                anchor: "end",
                align: "top",
                offset: 8,
                textShadowBlur: 4,
                textShadowColor: mode === "dark" ? "#000" : "#ccc",
            },
            zoom: {
                pan: { enabled: true, mode: "x" },
                zoom: {
                    wheel: { enabled: true },
                    pinch: { enabled: true },
                    mode: "x",
                },
            },
        },
        animation: {
            duration: 1500, // Faster animation
            easing: "easeOutQuad",
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
            className={`border-t-4 border-[#f05d23] p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-500 ${
                mode === "dark" ? "bg-gray-800" : "bg-white"
            }`}
        >
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h3
                    className={`text-xl font-semibold ${
                        mode === "dark" ? "text-white" : "text-[#231812]"
                    }`}
                >
                    Daily Score Trend
                </h3>
                <div className="flex items-center space-x-3">
                    <select
                        value={timeFilter}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className={`text-sm p-2 rounded border ${
                            mode === "dark"
                                ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                                : "bg-gray-200 text-[#231812] border-gray-300 hover:bg-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-[#f05d23] transition-colors`}
                    >
                        <option value="current">Current Year ({currentYear})</option>
                        <option value="last">Last Year ({currentYear - 1})</option>
                        <option value="all">All Time</option>
                    </select>
                    <button
                        onClick={() => setShowLabels(!showLabels)}
                        className={`p-2 rounded-full ${
                            mode === "dark"
                                ? "text-gray-300 hover:text-white hover:bg-gray-700"
                                : "text-gray-600 hover:text-[#231812] hover:bg-gray-200"
                        } transition-colors`}
                        title={showLabels ? "Hide Labels" : "Show Labels"}
                    >
                        <Icon
                            icon={showLabels ? "mdi:label-off" : "mdi:label"}
                            width={24}
                            height={24}
                        />
                    </button>
                    {timeFilter !== "all" && (
                        <button
                            onClick={() => handleFilterChange("all")}
                            className={`p-2 rounded-full ${
                                mode === "dark"
                                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                                    : "text-gray-600 hover:text-[#231812] hover:bg-gray-200"
                            } transition-colors`}
                            title="Show all time"
                        >
                            <Icon icon="mdi:ellipsis-vertical" width={24} height={24} />
                        </button>
                    )}
                </div>
            </div>
            <div className="h-80"> {/* Increased height */}
                <Line data={data} options={options} />
            </div>
            <p
                className={`text-sm mt-2 ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
            >
                Tip: Scroll to zoom, drag to pan
            </p>
        </div>
    );
}