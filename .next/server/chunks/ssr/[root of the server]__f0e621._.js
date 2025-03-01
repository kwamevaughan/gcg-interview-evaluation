module.exports = {

"[project]/src/components/JobDescriptionModal.js [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, a: __turbopack_async_module__, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
// src/components/JobDescriptionModal.js
__turbopack_esm__({
    "default": (()=>JobDescriptionModal)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_import__("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_import__("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$iconify$2f$react__$5b$external$5d$__$2840$iconify$2f$react$2c$__esm_import$29$__ = __turbopack_import__("[externals]/@iconify/react [external] (@iconify/react, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/lib/supabase.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$iconify$2f$react__$5b$external$5d$__$2840$iconify$2f$react$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f40$iconify$2f$react__$5b$external$5d$__$2840$iconify$2f$react$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
;
function JobDescriptionModal({ isOpen, onClose, onProceed, selectedOpening }) {
    const [jobDetails, setJobDetails] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [timeLeft, setTimeLeft] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    // Move isExpired above useEffect to avoid reference error
    const isExpired = (expiresOn)=>new Date(expiresOn) < new Date();
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (selectedOpening) {
            const fetchJobDetails = async ()=>{
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("job_openings").select("title, description, file_url, file_id, expires_on").eq("title", selectedOpening).single();
                if (error) console.error("Error fetching job details:", error);
                else setJobDetails(data);
            };
            fetchJobDetails();
        }
    }, [
        selectedOpening
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (jobDetails && !isExpired(jobDetails.expires_on)) {
            const updateTimer = ()=>{
                const now = new Date();
                const expires = new Date(jobDetails.expires_on);
                const diff = expires - now;
                if (diff <= 0) {
                    setTimeLeft(null);
                } else {
                    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30)); // Approximate month length
                    const days = Math.floor(diff % (1000 * 60 * 60 * 24 * 30) / (1000 * 60 * 60 * 24));
                    const hours = Math.floor(diff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
                    const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));
                    const seconds = Math.floor(diff % (1000 * 60) / 1000);
                    setTimeLeft({
                        months,
                        days,
                        hours,
                        minutes,
                        seconds
                    });
                }
            };
            updateTimer();
            const timer = setInterval(updateTimer, 1000);
            return ()=>clearInterval(timer);
        }
    }, [
        jobDetails
    ]);
    if (!isOpen || !selectedOpening || !jobDetails) return null;
    const { title, description, file_url, file_id, expires_on } = jobDetails;
    const googleFileId = file_id || file_url && file_url.match(/file\/d\/(.+?)\//)?.[1];
    const previewUrl = googleFileId ? `https://drive.google.com/file/d/${googleFileId}/preview` : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-xl max-w-3xl w-full mx-4 shadow-2xl transform transition-all duration-300 animate-fade-in flex flex-col max-h-[90vh]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-gradient-to-r from-[#f05d23] to-[#d94f1e] rounded-t-xl p-4 flex items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$iconify$2f$react__$5b$external$5d$__$2840$iconify$2f$react$2c$__esm_import$29$__["Icon"], {
                            icon: "mdi:briefcase",
                            className: "w-8 h-8 text-white mr-3"
                        }, void 0, false, {
                            fileName: "[project]/src/components/JobDescriptionModal.js",
                            lineNumber: 65,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-white",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/components/JobDescriptionModal.js",
                            lineNumber: 66,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/JobDescriptionModal.js",
                    lineNumber: 64,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex-1 p-6 overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center bg-gray-100 p-3 rounded-lg shadow-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$iconify$2f$react__$5b$external$5d$__$2840$iconify$2f$react$2c$__esm_import$29$__["Icon"], {
                                            icon: isExpired(expires_on) ? "mdi:alert-circle" : "mdi:check-circle",
                                            className: `w-6 h-6 mr-2 ${isExpired(expires_on) ? "text-red-500" : "text-green-500"}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/JobDescriptionModal.js",
                                            lineNumber: 74,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-[#231812]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                    children: "Status:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                                    lineNumber: 79,
                                                    columnNumber: 33
                                                }, this),
                                                " ",
                                                isExpired(expires_on) ? "Expired" : "Active"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/JobDescriptionModal.js",
                                            lineNumber: 78,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                    lineNumber: 73,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center bg-gray-100 p-3 rounded-lg shadow-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$iconify$2f$react__$5b$external$5d$__$2840$iconify$2f$react$2c$__esm_import$29$__["Icon"], {
                                            icon: "mdi:calendar-clock",
                                            className: "w-6 h-6 text-[#f05d23] mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/JobDescriptionModal.js",
                                            lineNumber: 83,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-[#231812]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                    children: "Expires On:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                                    lineNumber: 85,
                                                    columnNumber: 33
                                                }, this),
                                                " ",
                                                new Date(expires_on).toLocaleDateString()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/JobDescriptionModal.js",
                                            lineNumber: 84,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                    lineNumber: 82,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/JobDescriptionModal.js",
                            lineNumber: 72,
                            columnNumber: 21
                        }, this),
                        !isExpired(expires_on) && timeLeft && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "justify-center mb-6 bg-[#fff8f0] p-4 rounded-lg shadow-sm flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$iconify$2f$react__$5b$external$5d$__$2840$iconify$2f$react$2c$__esm_import$29$__["Icon"], {
                                    icon: "mdi:timer",
                                    className: "w-6 h-6 text-[#f05d23]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                    lineNumber: 93,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center text-[#231812]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                            className: "mr-2",
                                            children: "Time Left:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/JobDescriptionModal.js",
                                            lineNumber: 95,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2 text-lg",
                                            children: [
                                                timeLeft.months > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        timeLeft.months,
                                                        " month",
                                                        timeLeft.months > 1 ? 's' : ''
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                                    lineNumber: 97,
                                                    columnNumber: 61
                                                }, this),
                                                timeLeft.days > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        timeLeft.days,
                                                        " day",
                                                        timeLeft.days > 1 ? 's' : ''
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                                    lineNumber: 98,
                                                    columnNumber: 59
                                                }, this),
                                                timeLeft.hours > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        timeLeft.hours,
                                                        "h"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                                    lineNumber: 99,
                                                    columnNumber: 60
                                                }, this),
                                                timeLeft.minutes > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        timeLeft.minutes,
                                                        "m"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                                    lineNumber: 100,
                                                    columnNumber: 62
                                                }, this),
                                                timeLeft.seconds > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        timeLeft.seconds,
                                                        "s"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                                    lineNumber: 101,
                                                    columnNumber: 62
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/JobDescriptionModal.js",
                                            lineNumber: 96,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                    lineNumber: 94,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/JobDescriptionModal.js",
                            lineNumber: 92,
                            columnNumber: 25
                        }, this),
                        description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mb-6 bg-gray-50 p-4 rounded-lg shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$iconify$2f$react__$5b$external$5d$__$2840$iconify$2f$react$2c$__esm_import$29$__["Icon"], {
                                            icon: "mdi:text-box",
                                            className: "w-6 h-6 text-[#f05d23] mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/JobDescriptionModal.js",
                                            lineNumber: 112,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                            className: "text-[#231812]",
                                            children: "Description:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/JobDescriptionModal.js",
                                            lineNumber: 113,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                    lineNumber: 111,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-[#231812]",
                                    dangerouslySetInnerHTML: {
                                        __html: description
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                    lineNumber: 115,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/JobDescriptionModal.js",
                            lineNumber: 110,
                            columnNumber: 25
                        }, this),
                        file_url && previewUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$iconify$2f$react__$5b$external$5d$__$2840$iconify$2f$react$2c$__esm_import$29$__["Icon"], {
                                            icon: "mdi:document",
                                            className: "w-6 h-6 text-[#f05d23] mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/JobDescriptionModal.js",
                                            lineNumber: 123,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                            className: "text-[#231812]",
                                            children: "Job Description:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/JobDescriptionModal.js",
                                            lineNumber: 124,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                    lineNumber: 122,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("iframe", {
                                    src: previewUrl,
                                    width: "100%",
                                    height: "600px",
                                    className: "border-2 border-gray-200 rounded-lg shadow-inner",
                                    title: "Job Description Document",
                                    allow: "autoplay"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/JobDescriptionModal.js",
                                    lineNumber: 126,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/JobDescriptionModal.js",
                            lineNumber: 121,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/JobDescriptionModal.js",
                    lineNumber: 70,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "sticky bottom-0 bg-white p-4 border-t border-gray-200 rounded-b-xl shadow-md",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex justify-end gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "px-6 py-2 bg-gray-200 text-[#231812] rounded-full hover:bg-gray-300 transition duration-200 flex items-center gap-2 shadow-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$iconify$2f$react__$5b$external$5d$__$2840$iconify$2f$react$2c$__esm_import$29$__["Icon"], {
                                        icon: "mdi:close",
                                        width: 20,
                                        height: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/JobDescriptionModal.js",
                                        lineNumber: 145,
                                        columnNumber: 29
                                    }, this),
                                    "Cancel"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/JobDescriptionModal.js",
                                lineNumber: 141,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: onProceed,
                                className: "px-6 py-2 bg-[#f05d23] text-white rounded-full hover:bg-[#d94f1e] transition duration-200 flex items-center gap-2 shadow-md",
                                children: [
                                    "Proceed",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$iconify$2f$react__$5b$external$5d$__$2840$iconify$2f$react$2c$__esm_import$29$__["Icon"], {
                                        icon: "mdi:arrow-right",
                                        width: 20,
                                        height: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/JobDescriptionModal.js",
                                        lineNumber: 153,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/JobDescriptionModal.js",
                                lineNumber: 148,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/JobDescriptionModal.js",
                        lineNumber: 140,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/JobDescriptionModal.js",
                    lineNumber: 139,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/JobDescriptionModal.js",
            lineNumber: 62,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/JobDescriptionModal.js",
        lineNumber: 61,
        columnNumber: 9
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/@iconify/react [external] (@iconify/react, esm_import)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, a: __turbopack_async_module__, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_external_import__("@iconify/react");

__turbopack_export_namespace__(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__f0e621._.js.map