import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, TimeScale, LinearScale, Tooltip, Legend } from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(LineElement, PointElement, TimeScale, LinearScale, Tooltip, Legend);

export default function ScoreTrend({ candidates, mode }) {
    const scoresByDate = candidates.map(c => ({
        x: new Date(c.submitted_at).getTime(),
        y: c.score,
    })).sort((a, b) => a.x - b.x);
    const data = {
        datasets: [{
            label: "Scores Over Time",
            data: scoresByDate,
            borderColor: "#f05d23",
            backgroundColor: "rgba(240, 93, 35, 0.2)",
            fill: true,
            tension: 0.4,
        }],
    };

    return (
        <div className={`p-6 rounded-xl shadow-lg animate-scale-up ${mode === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`text-lg font-semibold mb-4 ${mode === "dark" ? "text-white" : "text-[#231812]"}`}>
                Score Trend Over Time
            </h3>
            <div className="h-64">
                <Line
                    data={data}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                type: "time",
                                time: { unit: "day" },
                                ticks: { color: mode === "dark" ? "#fff" : "#231812" },
                            },
                            y: { ticks: { color: mode === "dark" ? "#fff" : "#231812" } },
                        },
                        plugins: {
                            legend: { labels: { color: mode === "dark" ? "#fff" : "#231812" } },
                            tooltip: { backgroundColor: "#f05d23" },
                        },
                    }}
                />
            </div>
        </div>
    );
}