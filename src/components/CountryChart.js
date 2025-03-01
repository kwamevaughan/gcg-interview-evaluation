// src/components/CountryChart.js
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function CountryChart({ candidates, mode, onFilter }) {
    const [geoJsonData, setGeoJsonData] = useState(null);

    // Fetch GeoJSON data on mount
    useEffect(() => {
        fetch("https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson")
            .then((response) => response.json())
            .then((data) => setGeoJsonData(data))
            .catch((error) => console.error("Error fetching GeoJSON:", error));
    }, []);

    // Aggregate country counts from candidates
    const countryCounts = candidates.reduce((acc, c) => {
        const countryCode = c.country || "Unknown";
        acc[countryCode] = (acc[countryCode] || 0) + 1;
        return acc;
    }, {});

    // Style countries based on applicant count
    const getStyle = (feature) => {
        const countryCode = feature.properties.ISO_A2; // ISO 3166-1 alpha-2 code
        const count = countryCounts[countryCode] || 0;
        return {
            fillColor: count > 0 ? getColor(count) : "#D3D3D3", // Gray for no applicants
            weight: 1,
            opacity: 1,
            color: mode === "dark" ? "#fff" : "#231812",
            fillOpacity: count > 0 ? 0.7 : 0.2,
        };
    };

    // Color scale based on applicant count
    const getColor = (count) => {
        return count > 10 ? "#f05d23" :
            count > 5  ? "#FF6384" :
                count > 3  ? "#36A2EB" :
                    count > 1  ? "#4CAF50" :
                        "#FFCE56";
    };

    // Handle country click to filter
    const onEachFeature = (feature, layer) => {
        const countryCode = feature.properties.ISO_A2;
        const count = countryCounts[countryCode] || 0;
        layer.bindPopup(`${feature.properties.NAME}: ${count} applicants`);
        layer.on({
            click: () => onFilter("country", countryCode),
            mouseover: (e) => e.target.setStyle({ fillOpacity: 0.9 }),
            mouseout: (e) => e.target.setStyle({ fillOpacity: count > 0 ? 0.7 : 0.2 }),
        });
    };

    if (!geoJsonData) {
        return (
            <div className={`p-6 rounded-xl shadow-lg animate-scale-up ${mode === "dark" ? "bg-gray-800" : "bg-white"}`}>
                <h3 className={`text-lg font-semibold mb-4 ${mode === "dark" ? "text-white" : "text-[#231812]"}`}>
                    Applicants by Country
                </h3>
                <p>Loading map...</p>
            </div>
        );
    }

    return (
        <div className={`p-6 rounded-xl shadow-lg animate-scale-up ${mode === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`text-lg font-semibold mb-4 ${mode === "dark" ? "text-white" : "text-[#231812]"}`}>
                Applicants by Country
            </h3>
            <div className="h-64">
                <MapContainer
                    center={[20, 0]}
                    zoom={2}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={false}
                    className={mode === "dark" ? "dark-map" : ""}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <GeoJSON
                        data={geoJsonData}
                        style={getStyle}
                        onEachFeature={onEachFeature}
                    />
                </MapContainer>
            </div>
        </div>
    );
}