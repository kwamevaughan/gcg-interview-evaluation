// src/components/DeviceChart.js
import { PolarArea } from "react-chartjs-2"; 
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; 

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, ChartDataLabels);

export default function DeviceChart({ candidates, mode, onFilter }) {
    // Aggregate device counts into 'Desktop' and 'Mobile'
    const deviceCategories = candidates.reduce((acc, c) => {
        const device = c.device || "Unknown";
        const category = /Windows|Ubuntu|Linux|Macintosh/i.test(device) ? "Desktop" : "Mobile";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

    // Brand-based color palette with gradients
    const labels = Object.keys(deviceCategories);
    const baseColors = [
        "#f05d23", // Main orange
        "#231812", // Secondary brown
    ];

    const data = {
        labels: labels,
        datasets: [
            {
                data: Object.values(deviceCategories),
                backgroundColor: labels.map((_, index) =>
                    `rgba(${parseInt(baseColors[index % baseColors.length].slice(1, 3), 16)}, ${parseInt(
                        baseColors[index % baseColors.length].slice(3, 5),
                        16
                    )}, ${parseInt(baseColors[index % baseColors.length].slice(5, 7), 16)}, 0.7)`
                ),
                hoverBackgroundColor: labels.map((_, index) => baseColors[index % baseColors.length]),
                borderWidth: 1,
                borderColor: mode === "dark" ? "#fff" : "#231812",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: mode === "dark" ? "#fff" : "#231812",
                    padding: 20,
                    font: { size: 14 },
                },
                onClick: (e, legendItem) => {
                    const category = data.labels[legendItem.index];
                    const filteredCandidates = candidates.filter(c => 
                        /Windows|Ubuntu|Linux|Macintosh/i.test(c.device || "Unknown") ? category === "Desktop" : category === "Mobile"
                    );
                    onFilter("category", filteredCandidates);
                },
            },
            tooltip: {
                backgroundColor: "rgba(240, 93, 35, 0.9)", 
                titleColor: "#fff",
                bodyColor: "#fff",
                borderColor: "#231812",
                borderWidth: 1,
                cornerRadius: 8,
            },
            datalabels: {
                color: "#fff",
                font: {
                    size: 14,
                    weight: "bold",
                },
                formatter: (value) => value,
                anchor: "center",
                align: "center",
                textShadowBlur: 4,
                textShadowColor: "#000",
            },
        },
        animation: {
            animateScale: true,
            animateRotate: true,
            duration: 2000,
            easing: "easeOutBounce",
        },
        scales: {
            r: {
                ticks: {
                    display: false,
                },
                grid: {
                    color: mode === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(35, 24, 18, 0.2)",
                },
            },
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const category = data.labels[index];
                const filteredCandidates = candidates.filter(c => 
                    /Windows|Ubuntu|Linux|Macintosh/i.test(c.device || "Unknown") ? category === "Desktop" : category === "Mobile"
                );
                onFilter("category", filteredCandidates);
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
                Device Usage
            </h3>
            <div className="h-72">
                <PolarArea data={data} options={options} />
            </div>
        </div>
    );
}