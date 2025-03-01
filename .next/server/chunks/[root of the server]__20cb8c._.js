module.exports = {

"[externals]/next/dist/compiled/next-server/pages-api.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("next/dist/compiled/next-server/pages-api.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/nodemailer [external] (nodemailer, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("nodemailer", () => require("nodemailer"));

module.exports = mod;
}}),
"[project]/src/pages/api/submit.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// src/pages/api/submit.js
__turbopack_esm__({
    "default": (()=>handler)
});
(()=>{
    const e = new Error("Cannot find module '@/lib/supabase'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$externals$5d2f$nodemailer__$5b$external$5d$__$28$nodemailer$2c$__cjs$29$__ = __turbopack_import__("[externals]/nodemailer [external] (nodemailer, cjs)");
;
;
async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }
    const { fullName, email, phone, linkedin, answers, resume, coverLetter } = req.body;
    try {
        // Step 1: Insert user into 'users' table
        const { data: userData, error: userError } = await supabase.from("users").insert([
            {
                full_name: fullName,
                email,
                phone,
                linkedin
            }
        ]).select().single();
        if (userError) throw userError;
        const userId = userData.id;
        // Step 2: Calculate score
        const score = calculateScore(answers);
        // Step 3: Upload files to Supabase Storage
        let resumeUrl = null;
        let coverLetterUrl = null;
        if (resume) {
            const resumeFileName = `${userId}/resume-${Date.now()}.${resume.type === "application/pdf" ? "pdf" : "docx"}`;
            const { error: resumeError } = await supabase.storage.from("resumes").upload(resumeFileName, Buffer.from(resume.data, "base64"), {
                contentType: resume.type
            });
            if (resumeError) throw resumeError;
            resumeUrl = `${"TURBOPACK compile-time value", "https://monmftrotnvyuaqtvuwl.supabase.co"}/storage/v1/object/public/resumes/${resumeFileName}`;
        }
        if (coverLetter) {
            const coverLetterFileName = `${userId}/cover-letter-${Date.now()}.${coverLetter.type === "application/pdf" ? "pdf" : "docx"}`;
            const { error: coverLetterError } = await supabase.storage.from("cover-letters").upload(coverLetterFileName, Buffer.from(coverLetter.data, "base64"), {
                contentType: coverLetter.type
            });
            if (coverLetterError) throw coverLetterError;
            coverLetterUrl = `${"TURBOPACK compile-time value", "https://monmftrotnvyuaqtvuwl.supabase.co"}/storage/v1/object/public/cover-letters/${coverLetterFileName}`;
        }
        // Step 4: Insert response into 'responses' table
        const { error: responseError } = await supabase.from("responses").insert([
            {
                user_id: userId,
                answers: JSON.stringify(answers),
                score,
                resume_url: resumeUrl,
                cover_letter_url: coverLetterUrl
            }
        ]);
        if (responseError) throw responseError;
        // Step 5: Send emails
        const transporter = __TURBOPACK__imported__module__$5b$externals$5d2f$nodemailer__$5b$external$5d$__$28$nodemailer$2c$__cjs$29$__["default"].createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_SECURE === "true",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        // Email to user
        await transporter.sendMail({
            from: `"Growthpad Consulting Group" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Thank You for Completing Your Interview!",
            html: `
        <h2>Hello ${fullName},</h2>
        <p>Thank you for completing the Growthpad Consulting Group interview process!</p>
        <p>Your submission has been received, and your score is <strong>${score}/190</strong>.</p>
        <p>We will review your application and get back to you soon.</p>
        <p>Best regards,<br/>The Growthpad Team</p>
      `
        });
        // Email to analytics team
        await transporter.sendMail({
            from: `"Growthpad Consulting Group" <${process.env.EMAIL_USER}>`,
            to: "analytics.growthpad@gmail.com",
            subject: `New Interview Submission from ${fullName}`,
            html: `
        <h2>New Submission Received</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>LinkedIn:</strong> ${linkedin || "N/A"}</p>
        <p><strong>Score:</strong> ${score}/190</p>
        <p><strong>Resume:</strong> ${resumeUrl || "Not provided"}</p>
        <p><strong>Cover Letter:</strong> ${coverLetterUrl || "Not provided"}</p>
        <p><strong>Answers:</strong> ${JSON.stringify(answers)}</p>
      `
        });
        return res.status(200).json({
            message: "Submission successful",
            score
        });
    } catch (error) {
        console.error("Submission error:", error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}
// Scoring logic (unchanged from previous version)
function calculateScore(answers) {
    let totalScore = 0;
    const q1Answers = answers[0] || [];
    if (q1Answers.includes("None")) totalScore += 0;
    else {
        const languageCount = q1Answers.length;
        totalScore += Math.min(5 + (languageCount - 1) * 2, 10);
    }
    const q2Answer = answers[1]?.[0];
    totalScore += q2Answer === "A" ? 10 : q2Answer === "B" ? 7 : q2Answer === "C" ? 4 : q2Answer === "D" ? 2 : 0;
    totalScore += answers[2]?.[0] === "Yes" ? 10 : 0;
    const q4Answer = answers[3]?.[0];
    totalScore += q4Answer === "First class" ? 10 : q4Answer === "Second class upper division" ? 7 : q4Answer === "Second class lower division" ? 4 : q4Answer === "Third class" ? 2 : 0;
    const q5Answer = answers[4]?.[0];
    totalScore += q5Answer === "Both" ? 10 : q5Answer ? 5 : 0;
    const q6Answer = answers[5]?.[0];
    totalScore += q6Answer === "Proficient" ? 10 : q6Answer === "Intermediate" ? 7 : q6Answer === "Beginner" ? 3 : 0;
    const q7Answer = answers[6]?.[0];
    totalScore += q7Answer === "5+" ? 10 : q7Answer === "4" ? 8 : q7Answer === "3" ? 6 : q7Answer === "2" ? 4 : q7Answer === "1" ? 2 : 0;
    const q8Answer = answers[7]?.[0];
    totalScore += q8Answer === "Listen to the customer’s feedback and tell them that you can understand why they are upset and that it must be very inconvenient for them." ? 10 : q8Answer === "Apologize to the customer and ask them to hold while you contact the project manager to establish where she is." ? 7 : q8Answer === "Apologize to the customer and say you will arrange for a re-scheduled appointment." ? 4 : 2;
    const q9Answer = answers[8]?.[0];
    totalScore += q9Answer === "Take some time to read the information provided with the product e.g., product briefs, catalog etc." ? 10 : q9Answer === "Contact your supervisor and ask for a meeting to walk you through the products/services." ? 7 : q9Answer === "Ask a colleague who has already read about the product to give you a brief summary of the information you need." ? 4 : 2;
    const q10Answer = answers[9]?.[0];
    totalScore += q10Answer === "“I am sorry to hear that. What is it about the service that disappointed you today?”" ? 10 : q10Answer === "“I understand your frustration; this is an unexpectedly busy hour. We are doing our best.”" ? 7 : q10Answer === "“I am really sorry you feel that way. Would you like to get the manager so that you can talk to him?”" ? 4 : 2;
    const q11Answer = answers[10]?.[0];
    totalScore += q11Answer === "Set a goal to increase productivity by 5% next month and provide an incentive." ? 10 : q11Answer === "Speak openly to the team leaders - tell them that they perform well but can do better and ask them to improve." ? 7 : q11Answer === "Give a motivational speech in which you focus on how competent the team leaders are." ? 4 : 2;
    const q12Answer = answers[11]?.[0];
    totalScore += q12Answer === "10+ years" ? 10 : q12Answer === "5-10 years" ? 8 : q12Answer === "3-5 years" ? 6 : q12Answer === "2-3 years" ? 4 : 2;
    const q13Answer = answers[12]?.[0];
    totalScore += q13Answer === "6+" ? 10 : q13Answer === "5" ? 8 : q13Answer === "4" ? 6 : q13Answer === "3" ? 4 : q13Answer === "2" ? 2 : 0;
    const q14Answer = answers[13]?.[0];
    totalScore += q14Answer === "Communicate with stakeholders to clarify priorities and delegate tasks." ? 10 : q14Answer === "Work overtime to complete all tasks." ? 7 : q14Answer === "Request deadline extensions." ? 4 : 2;
    const q15Answer = answers[14]?.[0];
    totalScore += q15Answer === "Listen to their concerns, present data, and seek alignment." ? 10 : q15Answer === "Escalate the issue to senior management." ? 7 : q15Answer === "Avoid confrontation to maintain harmony." ? 4 : 2;
    totalScore += answers[15]?.[0] === "Yes" ? 10 : 0;
    totalScore += answers[16]?.[0] === "Yes" ? 10 : 0;
    const q18Answer = answers[17]?.[0];
    totalScore += q18Answer === "6+ years" ? 10 : q18Answer === "3-5 years" ? 7 : q18Answer === "2-3 years" ? 5 : q18Answer === "1-2 years" ? 3 : 0;
    const q19Answer = answers[18]?.[0];
    totalScore += q19Answer === "Assess the situation, gather input from stakeholders, and then act." ? 10 : q19Answer === "Immediately take charge and implement a solution." ? 7 : q19Answer === "Delegate the issue to a team member." ? 4 : 2;
    return Math.min(totalScore, 190);
}
}}),
"[project]/node_modules/next/dist/esm/server/route-modules/pages-api/module.compiled.js [api] (ecmascript)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    if ("TURBOPACK compile-time truthy", 1) {
        module.exports = __turbopack_require__("[externals]/next/dist/compiled/next-server/pages-api.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api.runtime.dev.js, cjs)");
    } else {
        "TURBOPACK unreachable";
    }
} //# sourceMappingURL=module.compiled.js.map
}}),
"[project]/node_modules/next/dist/esm/server/route-kind.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "RouteKind": (()=>RouteKind)
});
var RouteKind = /*#__PURE__*/ function(RouteKind) {
    /**
   * `PAGES` represents all the React pages that are under `pages/`.
   */ RouteKind["PAGES"] = "PAGES";
    /**
   * `PAGES_API` represents all the API routes under `pages/api/`.
   */ RouteKind["PAGES_API"] = "PAGES_API";
    /**
   * `APP_PAGE` represents all the React pages that are under `app/` with the
   * filename of `page.{j,t}s{,x}`.
   */ RouteKind["APP_PAGE"] = "APP_PAGE";
    /**
   * `APP_ROUTE` represents all the API routes and metadata routes that are under `app/` with the
   * filename of `route.{j,t}s{,x}`.
   */ RouteKind["APP_ROUTE"] = "APP_ROUTE";
    /**
   * `IMAGE` represents all the images that are generated by `next/image`.
   */ RouteKind["IMAGE"] = "IMAGE";
    return RouteKind;
}({}); //# sourceMappingURL=route-kind.js.map
}}),
"[project]/node_modules/next/dist/esm/build/templates/helpers.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
/**
 * Hoists a name from a module or promised module.
 *
 * @param module the module to hoist the name from
 * @param name the name to hoist
 * @returns the value on the module (or promised module)
 */ __turbopack_esm__({
    "hoist": (()=>hoist)
});
function hoist(module, name) {
    // If the name is available in the module, return it.
    if (name in module) {
        return module[name];
    }
    // If a property called `then` exists, assume it's a promise and
    // return a promise that resolves to the name.
    if ('then' in module && typeof module.then === 'function') {
        return module.then((mod)=>hoist(mod, name));
    }
    // If we're trying to hoise the default export, and the module is a function,
    // return the module itself.
    if (typeof module === 'function' && name === 'default') {
        return module;
    }
    // Otherwise, return undefined.
    return undefined;
} //# sourceMappingURL=helpers.js.map
}}),
"[project]/node_modules/next/dist/esm/build/templates/pages-api.js { INNER_PAGE => \"[project]/src/pages/api/submit.js [api] (ecmascript)\" } [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "config": (()=>config),
    "default": (()=>__TURBOPACK__default__export__),
    "routeModule": (()=>routeModule)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2d$api$2f$module$2e$compiled$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/server/route-modules/pages-api/module.compiled.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/server/route-kind.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/build/templates/helpers.js [api] (ecmascript)");
// Import the userland code.
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$submit$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/pages/api/submit.js [api] (ecmascript)");
;
;
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$submit$2e$js__$5b$api$5d$__$28$ecmascript$29$__, 'default');
const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$api$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$submit$2e$js__$5b$api$5d$__$28$ecmascript$29$__, 'config');
const routeModule = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2d$api$2f$module$2e$compiled$2e$js__$5b$api$5d$__$28$ecmascript$29$__["PagesAPIRouteModule"]({
    definition: {
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$api$5d$__$28$ecmascript$29$__["RouteKind"].PAGES_API,
        page: "/api/submit",
        pathname: "/api/submit",
        // The following aren't used in production.
        bundlePath: '',
        filename: ''
    },
    userland: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$api$2f$submit$2e$js__$5b$api$5d$__$28$ecmascript$29$__
}); //# sourceMappingURL=pages-api.js.map
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__20cb8c._.js.map