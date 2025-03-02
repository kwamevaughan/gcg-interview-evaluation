import { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import countriesGeoJson from "../data/countries.js";

// Debugging disabled
const DEBUG_MODE = false;

// Safe logging function (now effectively a no-op unless DEBUG_MODE is true)
const debugLog = (...args) => {
    if (DEBUG_MODE) {
        console.log(...args);
    }
};

// Map country codes to full names with error handling
const countryCodeToName = {};
try {
    if (countriesGeoJson && countriesGeoJson.features && Array.isArray(countriesGeoJson.features)) {
        countriesGeoJson.features.forEach(feature => {
            if (feature.properties && feature.properties.iso_a2) {
                countryCodeToName[feature.properties.iso_a2.toUpperCase()] = feature.properties.sovereignt;
            }
        });
    }
} catch (error) {
    // No logging
}

export default function CountryChart({ candidates, mode, onFilter }) {
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [mapError, setMapError] = useState(null);

    // Remove useEffect debug logging
    useEffect(() => {}, [candidates, mode]);

    // Aggregate country counts from candidates (uppercase codes)
    let countryCounts = {};
    try {
        if (candidates && Array.isArray(candidates)) {
            countryCounts = candidates.reduce((acc, c) => {
                if (c && typeof c === 'object') {
                    const countryCode = ((c.country || "") + "").toUpperCase() || "UNKNOWN";
                    acc[countryCode] = (acc[countryCode] || 0) + 1;
                }
                return acc;
            }, {});
        } else {
            setMapError("Invalid candidates data");
        }
    } catch (error) {
        setMapError("Error processing candidates");
    }

    // Get country code ensuring case consistency
    const getStandardizedCountryCode = (feature) => {
        try {
            if (!feature || !feature.properties) {
                return "UNKNOWN";
            }
            const possibleCodes = [
                feature.properties.iso_a2,
                feature.properties.ISO_A2,
                feature.properties.ISO_A2_EH,
                feature.properties.ISO_A2_PS
            ];
            const code = possibleCodes.find(c => c !== null && c !== undefined && c !== "") || "UNKNOWN";
            return code.toUpperCase();
        } catch (error) {
            return "UNKNOWN";
        }
    };

    // Get applicants for a country on hover
    const getApplicants = (countryCode) => {
        try {
            if (!countryCode) return "No applicants";
            const filteredCandidates = candidates.filter(
                (c) => c && c.country && c.country.toUpperCase() === countryCode
            );
            if (!filteredCandidates.length) return "No applicants";
            return filteredCandidates
                .map((c) => `${c.full_name || "Unknown"} (Score: ${c.score || "N/A"})`)
                .join("<br />");
        } catch (error) {
            return "Error listing applicants";
        }
    };

    // Style countries based on applicant count
    const getStyle = (feature) => {
        try {
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
        } catch (error) {
            return {
                fillColor: "#D3D3D3",
                weight: 1,
                opacity: 1,
                color: "#231812",
                fillOpacity: 0.3,
                dashArray: "3",
            };
        }
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
        try {
            const countryCode = getStandardizedCountryCode(feature);
            const countryName = feature.properties?.sovereignt || feature.properties?.name || "Unknown";

            layer.on({
                mouseover: (e) => {
                    try {
                        e.target.setStyle({ fillOpacity: 0.9, weight: 2 });
                        const hoverInfo = { code: countryCode, count: countryCounts[countryCode] || 0, name: countryName };
                        setHoveredCountry(hoverInfo);
                        e.target.bindTooltip(`${countryName}: ${countryCounts[countryCode] || 0}`, {
                            permanent: false,
                            direction: "auto",
                            className: "country-tooltip",
                        });
                    } catch (error) {
                        // No logging
                    }
                },
                mouseout: (e) => {
                    try {
                        e.target.setStyle(getStyle(feature));
                        setHoveredCountry(null);
                    } catch (error) {
                        // No logging
                    }
                },
                click: () => {
                    try {
                        if (countryCounts[countryCode] > 0 && onFilter) {
                            onFilter("country", countryCodeToName[countryCode] || countryCode);
                        }
                    } catch (error) {
                        // No logging
                    }
                },
            });
        } catch (error) {
            // No logging
        }
    };

    // Check if data is valid for rendering
    const canRenderMap = countriesGeoJson &&
        countriesGeoJson.features &&
        Array.isArray(countriesGeoJson.features) &&
        countriesGeoJson.features.length > 0;

    if (!canRenderMap) {
        return (
            <div className={`p-6 rounded-xl shadow-lg ${mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-[#231812]"}`}>
                <h3 className="text-lg font-semibold mb-4">Applicants by Country</h3>
                <p className="text-red-500">Error loading map data.</p>
            </div>
        );
    }

    return (
        <div className={`p-6 rounded-xl shadow-lg animate-scale-up ${mode === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`text-lg font-semibold mb-4 ${mode === "dark" ? "text-white" : "text-[#231812]"}`}>
                Applicants by Country
            </h3>

            {mapError && (
                <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
                    {mapError}
                </div>
            )}

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
                        key={JSON.stringify(candidates)}
                        data={countriesGeoJson}
                        style={getStyle}
                        onEachFeature={onEachFeature}
                    />
                </MapContainer>
                {hoveredCountry && (
                    <div className={`absolute top-4 left-4 p-4 rounded-lg shadow-lg z-[1000] max-h-[300px] overflow-y-auto ${mode === "dark" ? "bg-gray-900 text-white" : "bg-white text-[#231812]"}`}>
                        <h4 className="font-semibold">{hoveredCountry.name || "Unknown"}</h4>
                        <p>Applicants: {countryCounts[hoveredCountry.code] || 0}</p>
                        {countryCounts[hoveredCountry.code] > 0 && (
                            <div dangerouslySetInnerHTML={{ __html: getApplicants(hoveredCountry.code) }} />
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