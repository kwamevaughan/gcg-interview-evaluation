import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import countriesGeoJson from "../data/countries.js";

// Map country codes to full names
const countryCodeToName = countriesGeoJson.features.reduce((acc, feature) => {
    acc[feature.properties.iso_a2.toUpperCase()] = feature.properties.sovereignt;
    return acc;
}, {});

export default function CountryChart({ candidates, mode, onFilter }) {
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [debugInfo, setDebugInfo] = useState(null);

    // Aggregate country counts from candidates (uppercase codes)
    const countryCounts = candidates.reduce((acc, c) => {
        const countryCode = (c.country || "Unknown").toUpperCase();
        acc[countryCode] = (acc[countryCode] || 0) + 1;
        return acc;
    }, {});

    // Debug to check all feature properties
    useEffect(() => {
        // Inspect a sample feature from GeoJSON to understand its structure
        if (countriesGeoJson && countriesGeoJson.features && countriesGeoJson.features.length > 0) {
            const sampleFeature = countriesGeoJson.features.find(f =>
                f.properties.iso_a2?.toUpperCase() === 'GH' ||
                f.properties.ISO_A2?.toUpperCase() === 'GH'
            );
        }
    }, []);

    console.log("Country Counts:", countryCounts); // Debug log

    // Get country code ensuring case consistency
    const getStandardizedCountryCode = (feature) => {
        // Try different possible property names for country code
        const possibleCodes = [
            feature.properties.iso_a2,
            feature.properties.ISO_A2,
            feature.properties.ISO_A2_EH,
            feature.properties.ISO_A2_PS
        ];

        // Find first non-null code and convert to uppercase
        const code = possibleCodes.find(c => c !== null && c !== undefined && c !== "");
        return code ? code.toUpperCase() : "UNKNOWN";
    };

    // Get applicants for a country on hover
    const getApplicants = (countryCode) => {
        const applicants = candidates
            .filter((c) => (c.country || "Unknown").toUpperCase() === countryCode)
            .map((c) => `${c.full_name} (Score: ${c.score})`)
            .join("<br />") || "No applicants";
        return applicants;
    };

    // Style countries based on applicant count
    const getStyle = (feature) => {
        const countryCode = getStandardizedCountryCode(feature);
        const count = countryCounts[countryCode] || 0;

        return {
            fillColor: count > 0 ? getColor(count) : mode === "dark" ? "#444" : "#D3D3D3",
            weight: 1.5,
            opacity: 1,
            color: mode === "dark" ? "#fff" : "#231812",
            fillOpacity: count > 0 ? 0.8 : 0.3,
            dashArray: count > 0 ? "" : "3",
        };
    };

    // Color scale based on applicant count
    const getColor = (count) => {
        return count > 20 ? "#b91c1c" :
            count > 10 ? "#f05d23" :
                count > 5  ? "#FF6384" :
                    count > 3  ? "#36A2EB" :
                        count > 1  ? "#4CAF50" :
                            "#FFCE56";
    };

    // Handle country interactions
    const onEachFeature = (feature, layer) => {
        const countryCode = getStandardizedCountryCode(feature);
        const countryName = feature.properties.sovereignt || feature.properties.name || "Unknown";
        const count = countryCounts[countryCode] || 0;

        // For debugging - log when Ghana is processed
        if (countryCode === 'GH') {
            console.log("Processing Ghana:", {
                featureCode: countryCode,
                countFromData: countryCounts[countryCode],
                countVariable: count
            });
        }

        layer.on({
            mouseover: (e) => {
                e.target.setStyle({ fillOpacity: 0.9, weight: 2 });
                const hoverInfo = { code: countryCode, count, name: countryName };
                console.log("Hovering over:", hoverInfo);
                setHoveredCountry(hoverInfo);

                // Set debug info for Ghana specifically
                if (countryCode === 'GH') {
                    setDebugInfo({
                        geoJsonCode: getStandardizedCountryCode(feature),
                        candidateCountries: Object.keys(countryCounts),
                        hasMatch: countryCounts[countryCode] !== undefined,
                        count: countryCounts[countryCode] || 0
                    });
                }
            },
            mouseout: (e) => {
                e.target.setStyle(getStyle(feature));
                setHoveredCountry(null);
                setDebugInfo(null);
            },
            click: () => {
                if (count > 0) {
                    onFilter("country", countryCodeToName[countryCode] || countryCode);
                } else {
                    console.log(`No applicants for ${countryName} (${countryCode})`);

                    // Debug for country codes that don't match
                    console.log("Available country codes in data:", Object.keys(countryCounts));
                    console.log("This might be a country code mismatch. Check if the GeoJSON uses a different code format.");
                }
            },
        });

        layer.bindTooltip(`${countryName}: ${count}`, {
            permanent: false,
            direction: "auto",
            className: "country-tooltip",
        });
    };

    return (
        <div className={`p-6 rounded-xl shadow-lg animate-scale-up ${mode === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`text-lg font-semibold mb-4 ${mode === "dark" ? "text-white" : "text-[#231812]"}`}>
                Applicants by Country
            </h3>
            <div className="relative h-[400px] w-full">
                <MapContainer
                    center={[20, 0]}
                    zoom={2}
                    style={{ height: "100%", width: "100%", borderRadius: "8px" }}
                    scrollWheelZoom={false}
                    className={mode === "dark" ? "dark-map" : ""}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> & <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    <GeoJSON
                        data={countriesGeoJson}
                        style={getStyle}
                        onEachFeature={onEachFeature}
                    />
                </MapContainer>
                {hoveredCountry && (
                    <div
                        className={`absolute top-4 left-4 p-4 rounded-lg shadow-lg z-[1000] max-h-[300px] overflow-y-auto ${
                            mode === "dark" ? "bg-gray-900 text-white" : "bg-white text-[#231812]"
                        }`}
                    >
                        <h4 className="font-semibold">{hoveredCountry.name || "Unknown"}</h4>
                        <p>Applicants: {hoveredCountry.count}</p>
                        {hoveredCountry.count > 0 && (
                            <div
                                dangerouslySetInnerHTML={{ __html: getApplicants(hoveredCountry.code) }}
                            />
                        )}
                        {debugInfo && hoveredCountry.code === 'GH' && (
                            <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900 text-xs">
                                <p>Debug: {JSON.stringify(debugInfo)}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="mt-4 flex justify-center gap-4">
                <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: "#FFCE56" }}></span> 1-3
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: "#4CAF50" }}></span> 4-5
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: "#36A2EB" }}></span> 6-10
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: "#f05d23" }}></span> 11-20
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: "#b91c1c" }}></span> 20+
                </span>
            </div>
        </div>
    );
}