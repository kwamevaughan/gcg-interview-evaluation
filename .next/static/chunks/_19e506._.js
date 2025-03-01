(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/_19e506._.js", {

"[project]/lib/supabase.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// lib/supabase.js
__turbopack_esm__({
    "supabase": (()=>supabase)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/@supabase/supabase-js/dist/module/index.js [client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://monmftrotnvyuaqtvuwl.supabase.co");
const supabaseKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vbm1mdHJvdG52eXVhcXR2dXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODg1OTcsImV4cCI6MjA1NjE2NDU5N30.R_sz1NaM2tEigssP53FU-z07-xNHUB1cHqMvlDhY6i4"); // Use anon key for client-side
console.log("Supabase URL (client):", supabaseUrl);
console.log("Supabase Anon Key (client):", supabaseKey);
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
}
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseKey);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/JobDescriptionModal.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// src/components/JobDescriptionModal.js
__turbopack_esm__({
    "default": (()=>JobDescriptionModal)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@iconify/react/dist/iconify.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/supabase.js [client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature();
;
;
;
function JobDescriptionModal({ isOpen, onClose, onProceed, selectedOpening }) {
    _s();
    const [jobDetails, setJobDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [timeLeft, setTimeLeft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Move isExpired above useEffect to avoid reference error
    const isExpired = (expiresOn)=>new Date(expiresOn) < new Date();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "JobDescriptionModal.useEffect": ()=>{
            if (selectedOpening) {
                const fetchJobDetails = {
                    "JobDescriptionModal.useEffect.fetchJobDetails": async ()=>{
                        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("job_openings").select("title, description, file_url, file_id, expires_on").eq("title", selectedOpening).single();
                        if (error) console.error("Error fetching job details:", error);
                        else setJobDetails(data);
                    }
                }["JobDescriptionModal.useEffect.fetchJobDetails"];
                fetchJobDetails();
            }
        }
    }["JobDescriptionModal.useEffect"], [
        selectedOpening
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "JobDescriptionModal.useEffect": ()=>{
            if (jobDetails && !isExpired(jobDetails.expires_on)) {
                const updateTimer = {
                    "JobDescriptionModal.useEffect.updateTimer": ()=>{
                        const now = new Date();
                        const expires = new Date(jobDetails.expires_on);
                        const diff = expires - now;
                        if (diff <= 0) {
                            setTimeLeft(null);
                        } else {
                            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                            const hours = Math.floor(diff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
                            const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));
                            const seconds = Math.floor(diff % (1000 * 60) / 1000);
                            setTimeLeft({
                                days,
                                hours,
                                minutes,
                                seconds
                            });
                        }
                    }
                }["JobDescriptionModal.useEffect.updateTimer"];
                updateTimer();
                const timer = setInterval(updateTimer, 1000);
                return ({
                    "JobDescriptionModal.useEffect": ()=>clearInterval(timer)
                })["JobDescriptionModal.useEffect"];
            }
        }
    }["JobDescriptionModal.useEffect"], [
        jobDetails
    ]);
    if (!isOpen || !selectedOpening || !jobDetails) return null;
    const { title, description, file_url, file_id, expires_on } = jobDetails;
    const googleFileId = file_id || file_url && file_url.match(/file\/d\/(.+?)\//)?.[1];
    const previewUrl = googleFileId ? `https://drive.google.com/file/d/${googleFileId}/preview` : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-xl max-w-3xl w-full mx-4 shadow-2xl transform transition-all duration-300 animate-fade-in flex flex-col max-h-[90vh]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gradient-to-r from-[#f05d23] to-[#d94f1e] rounded-t-xl p-4 flex items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                            icon: "mdi:briefcase",
                            className: "w-8 h-8 text-white mr-3"
                        }, void 0, false, {
                            fileName: "[project]/src/components/JobDescriptionModal.js",
                            lineNumber: 62,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-white",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/components/JobDescriptionModal.js",
                            lineNumber: 63,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/JobDescriptionModal.js",
                    lineNumber: 61,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 p-6 overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center bg-gray-100 p-3 rounded-lg shadow-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            icon: isExpired(expires_on) ? "mdi:alert-circle" : "mdi:check-circle",
                                            className: `w-6 h-6 mr-2 ${isExpired(expires_on) ? "text-red-500" : "text-green-500"}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/JobDescriptionModal.js",
                                            lineNumber: 71,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[#231812]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Status:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                                    lineNumber: 76,
                                                    columnNumber: 33
                                                }, this),
                                                " ",
                                                isExpired(expires_on) ? "Expired" : "Active"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/JobDescriptionModal.js",
                                            lineNumber: 75,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                    lineNumber: 70,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center bg-gray-100 p-3 rounded-lg shadow-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            icon: "mdi:calendar-clock",
                                            className: "w-6 h-6 text-[#f05d23] mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/JobDescriptionModal.js",
                                            lineNumber: 80,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[#231812]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    children: "Expires On:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                                    lineNumber: 82,
                                                    columnNumber: 33
                                                }, this),
                                                " ",
                                                new Date(expires_on).toLocaleDateString()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/JobDescriptionModal.js",
                                            lineNumber: 81,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                    lineNumber: 79,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/JobDescriptionModal.js",
                            lineNumber: 69,
                            columnNumber: 21
                        }, this),
                        !isExpired(expires_on) && timeLeft && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "justify-center mb-6 bg-[#fff8f0] p-4 rounded-lg shadow-sm flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                    icon: "mdi:timer",
                                    className: "w-6 h-6 text-[#f05d23]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                    lineNumber: 90,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center text-[#231812]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "mr-2",
                                            children: "Time Left:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/JobDescriptionModal.js",
                                            lineNumber: 92,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2 text-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        timeLeft.days,
                                                        "d"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                                    lineNumber: 94,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        timeLeft.hours,
                                                        "h"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                                    lineNumber: 95,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        timeLeft.minutes,
                                                        "m"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                                    lineNumber: 96,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        timeLeft.seconds,
                                                        "s"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                                    lineNumber: 97,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/JobDescriptionModal.js",
                                            lineNumber: 93,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                    lineNumber: 91,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/JobDescriptionModal.js",
                            lineNumber: 89,
                            columnNumber: 25
                        }, this),
                        description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6 bg-gray-50 p-4 rounded-lg shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            icon: "mdi:text-box",
                                            className: "w-6 h-6 text-[#f05d23] mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/JobDescriptionModal.js",
                                            lineNumber: 108,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "text-[#231812]",
                                            children: "Description:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/JobDescriptionModal.js",
                                            lineNumber: 109,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                    lineNumber: 107,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[#231812]",
                                    dangerouslySetInnerHTML: {
                                        __html: description
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                    lineNumber: 111,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/JobDescriptionModal.js",
                            lineNumber: 106,
                            columnNumber: 25
                        }, this),
                        file_url && previewUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                            icon: "mdi:document",
                                            className: "w-6 h-6 text-[#f05d23] mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/JobDescriptionModal.js",
                                            lineNumber: 119,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "text-[#231812]",
                                            children: "Job Description:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/JobDescriptionModal.js",
                                            lineNumber: 120,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                    lineNumber: 118,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                                    src: previewUrl,
                                    width: "100%",
                                    height: "600px",
                                    className: "border-2 border-gray-200 rounded-lg shadow-inner",
                                    title: "Job Description Document",
                                    allow: "autoplay"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                    lineNumber: 122,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/JobDescriptionModal.js",
                            lineNumber: 117,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/JobDescriptionModal.js",
                    lineNumber: 67,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "sticky bottom-0 bg-white p-4 border-t border-gray-200 rounded-b-xl shadow-md",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-end gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "px-6 py-2 bg-gray-200 text-[#231812] rounded-full hover:bg-gray-300 transition duration-200 flex items-center gap-2 shadow-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                        icon: "mdi:close",
                                        width: 20,
                                        height: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/JobDescriptionModal.js",
                                        lineNumber: 141,
                                        columnNumber: 29
                                    }, this),
                                    "Cancel"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/JobDescriptionModal.js",
                                lineNumber: 137,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onProceed,
                                className: "px-6 py-2 bg-[#f05d23] text-white rounded-full hover:bg-[#d94f1e] transition duration-200 flex items-center gap-2 shadow-md",
                                children: [
                                    "Proceed",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Icon"], {
                                        icon: "mdi:arrow-right",
                                        width: 20,
                                        height: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/JobDescriptionModal.js",
                                        lineNumber: 149,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/JobDescriptionModal.js",
                                lineNumber: 144,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/JobDescriptionModal.js",
                        lineNumber: 136,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/JobDescriptionModal.js",
                    lineNumber: 135,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/JobDescriptionModal.js",
            lineNumber: 59,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/JobDescriptionModal.js",
        lineNumber: 58,
        columnNumber: 9
    }, this);
}
_s(JobDescriptionModal, "+hJZFjGtG3ZQJLVu0EWwTrDiBOM=");
_c = JobDescriptionModal;
var _c;
__turbopack_refresh__.register(_c, "JobDescriptionModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=_19e506._.js.map