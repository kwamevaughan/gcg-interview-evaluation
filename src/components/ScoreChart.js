import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function ScoreChart({ candidates, mode, onFilter }) {
    const scoreDistribution = candidates.reduce((acc, c) => {
        const bin = Math.floor(c.score / 20) * 20;
        acc[bin] = (acc[bin] || 0) + 1;
        return acc;
    }, {});
    const data = {
        labels: Object.keys(scoreDistribution).map(k => `${k}-${parseInt(k) + 20}`),
        datasets: [{
            label: "Candidates",
            data: Object.values(scoreDistribution),
            backgroundColor: "#f05d23",
            borderColor: "#d94f1e",
            borderWidth: 1,
        }],
    };

    return (
        <div className={`p-6 rounded-xl shadow-lg animate-scale-up ${mode === "dark" ? "bg-gray-800" : "bg-white"}`}>
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
                            tooltip: { backgroundColor: "#f05d23" },
                        },
                        onClick: (_, elements) => {
                            if (elements.length > 0) {
                                const index = elements[0].index;
                                const range = data.labels[index];
                                onFilter(range);
                            }
                        },
                    }}
                />
            </div>
        </div>
    );
}