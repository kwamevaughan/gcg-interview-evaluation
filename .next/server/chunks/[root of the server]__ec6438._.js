module.exports = {

"[externals]/next/dist/compiled/next-server/pages-api.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("next/dist/compiled/next-server/pages-api.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/@supabase/supabase-js [external] (@supabase/supabase-js, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("@supabase/supabase-js", () => require("@supabase/supabase-js"));

module.exports = mod;
}}),
"[project]/src/lib/supabaseServer.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// lib/supabaseServer.js
__turbopack_esm__({
    "supabaseServer": (()=>supabaseServer)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__cjs$29$__ = __turbopack_import__("[externals]/@supabase/supabase-js [external] (@supabase/supabase-js, cjs)");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://monmftrotnvyuaqtvuwl.supabase.co");
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Use service key for server-side
console.log("Supabase URL (server):", supabaseUrl);
console.log("Supabase Service Key (server):", supabaseServiceKey);
if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase server configuration missing: Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY are set in .env.local");
}
const supabaseServer = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__cjs$29$__["createClient"])(supabaseUrl, supabaseServiceKey);
}}),
"[project]/utils/dbUtils.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// src/utils/dbUtils.js
__turbopack_esm__({
    "upsertCandidate": (()=>upsertCandidate),
    "upsertResponse": (()=>upsertResponse)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseServer$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/lib/supabaseServer.js [api] (ecmascript)"); // Adjusted path
;
async function upsertCandidate({ fullName, email, phone, linkedin, opening }) {
    try {
        console.log("Checking for existing candidate with email:", email);
        const { data: existingCandidate, error: fetchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseServer$2e$js__$5b$api$5d$__$28$ecmascript$29$__["supabaseServer"].from("candidates").select("id").eq("email", email).single();
        let userId;
        if (fetchError && fetchError.code !== "PGRST116") {
            console.error("Fetch existing candidate error:", fetchError);
            return {
                error: {
                    status: 500,
                    message: "Error checking existing candidate",
                    details: fetchError.message
                }
            };
        }
        if (existingCandidate) {
            console.log("Updating existing candidate with email:", email);
            const { data: updatedCandidate, error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseServer$2e$js__$5b$api$5d$__$28$ecmascript$29$__["supabaseServer"].from("candidates").update({
                full_name: fullName,
                phone,
                linkedin,
                opening
            }).eq("email", email).select().single();
            if (updateError) throw updateError;
            userId = updatedCandidate.id;
        } else {
            console.log("Inserting new candidate with data:", {
                full_name: fullName,
                email,
                phone,
                linkedin,
                opening
            });
            const { data: newCandidate, error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseServer$2e$js__$5b$api$5d$__$28$ecmascript$29$__["supabaseServer"].from("candidates").insert([
                {
                    full_name: fullName,
                    email,
                    phone,
                    linkedin,
                    opening
                }
            ]).select().single();
            if (insertError) throw insertError;
            userId = newCandidate.id;
        }
        return {
            userId
        };
    } catch (error) {
        console.error("Database operation error:", error.message);
        return {
            error: {
                status: 500,
                message: "Database operation failed",
                details: error.message
            }
        };
    }
}
async function upsertResponse({ userId, answers, score, resumeUrl, coverLetterUrl, resumeFileId, coverLetterFileId }) {
    try {
        console.log("Attempting to upsert response with data:", {
            user_id: userId,
            answers: JSON.stringify(answers),
            score,
            resume_url: resumeUrl,
            cover_letter_url: coverLetterUrl,
            resume_file_id: resumeFileId,
            cover_letter_file_id: coverLetterFileId
        });
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseServer$2e$js__$5b$api$5d$__$28$ecmascript$29$__["supabaseServer"].from("responses").upsert([
            {
                user_id: userId,
                answers: JSON.stringify(answers),
                score,
                resume_url: resumeUrl,
                cover_letter_url: coverLetterUrl,
                resume_file_id: resumeFileId,
                cover_letter_file_id: coverLetterFileId
            }
        ], {
            onConflict: [
                "user_id"
            ],
            update: [
                "answers",
                "score",
                "resume_url",
                "cover_letter_url",
                "resume_file_id",
                "cover_letter_file_id"
            ]
        });
        if (error) {
            console.error("Response upsert error:", error);
            return {
                error: {
                    status: 403,
                    message: "Failed to upsert response",
                    details: error.message
                }
            };
        }
        return {};
    } catch (error) {
        console.error("Response upsert error:", error.message);
        return {
            error: {
                status: 500,
                message: "Response upsert failed",
                details: error.message
            }
        };
    }
}
}}),
"[externals]/googleapis [external] (googleapis, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("googleapis", () => require("googleapis"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("stream", () => require("stream"));

module.exports = mod;
}}),
"[project]/utils/driveUtils.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// src/utils/driveUtils.js
__turbopack_esm__({
    "deleteFileFromDrive": (()=>deleteFileFromDrive),
    "uploadFileToDrive": (()=>uploadFileToDrive)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$googleapis__$5b$external$5d$__$28$googleapis$2c$__cjs$29$__ = __turbopack_import__("[externals]/googleapis [external] (googleapis, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__ = __turbopack_import__("[externals]/stream [external] (stream, cjs)");
;
;
// Format date as "20th February 2024"
const formatDate = ()=>{
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString("default", {
        month: "long"
    });
    const year = date.getFullYear();
    const suffix = (day)=>{
        if (day > 3 && day < 21) return "th";
        switch(day % 10){
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    };
    return `${day}${suffix(day)} ${month} ${year}`;
};
async function uploadFileToDrive(fullName, opening, fileData, fileType, oldFileId) {
    try {
        const serviceAccountCreds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
        const auth = new __TURBOPACK__imported__module__$5b$externals$5d2f$googleapis__$5b$external$5d$__$28$googleapis$2c$__cjs$29$__["google"].auth.GoogleAuth({
            credentials: serviceAccountCreds,
            scopes: [
                "https://www.googleapis.com/auth/drive.file"
            ]
        });
        const drive = __TURBOPACK__imported__module__$5b$externals$5d2f$googleapis__$5b$external$5d$__$28$googleapis$2c$__cjs$29$__["google"].drive({
            version: "v3",
            auth
        });
        // Delete old file if it exists
        if (oldFileId) {
            await deleteFileFromDrive(oldFileId);
        }
        console.log(`Processing ${fileType} upload...`);
        const isPdf = fileData.startsWith("JVBERi0");
        const ext = isPdf ? "pdf" : "docx";
        const fileName = `${fullName} - ${opening} - ${formatDate()}.${ext}`;
        const buffer = Buffer.from(fileData, "base64");
        console.log(`${fileType} size (bytes):`, buffer.length);
        const bufferStream = new __TURBOPACK__imported__module__$5b$externals$5d2f$stream__$5b$external$5d$__$28$stream$2c$__cjs$29$__["Readable"]();
        bufferStream.push(buffer);
        bufferStream.push(null);
        const fileMetadata = {
            name: fileName,
            parents: [
                process.env.GOOGLE_DRIVE_FOLDER_ID
            ]
        };
        const media = {
            mimeType: isPdf ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            body: bufferStream
        };
        const driveResponse = await drive.files.create({
            requestBody: fileMetadata,
            media,
            fields: "id, webContentLink"
        });
        await drive.permissions.create({
            fileId: driveResponse.data.id,
            requestBody: {
                role: "reader",
                type: "anyone"
            }
        });
        const fileUrl = driveResponse.data.webContentLink;
        console.log(`${fileType} uploaded successfully:`, fileUrl);
        return {
            url: fileUrl,
            fileId: driveResponse.data.id
        };
    } catch (error) {
        console.error(`${fileType} upload error:`, error.message, error.stack || "No stack trace");
        return {
            url: null,
            fileId: null
        };
    }
}
async function deleteFileFromDrive(fileId) {
    try {
        const serviceAccountCreds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
        const auth = new __TURBOPACK__imported__module__$5b$externals$5d2f$googleapis__$5b$external$5d$__$28$googleapis$2c$__cjs$29$__["google"].auth.GoogleAuth({
            credentials: serviceAccountCreds,
            scopes: [
                "https://www.googleapis.com/auth/drive.file"
            ]
        });
        const drive = __TURBOPACK__imported__module__$5b$externals$5d2f$googleapis__$5b$external$5d$__$28$googleapis$2c$__cjs$29$__["google"].drive({
            version: "v3",
            auth
        });
        console.log(`Deleting old file with ID: ${fileId}`);
        await drive.files.delete({
            fileId
        });
        console.log(`Deleted file with ID: ${fileId}`);
    } catch (error) {
        console.error(`Error deleting file with ID ${fileId}:`, error.message);
    }
}
}}),
"[externals]/nodemailer [external] (nodemailer, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("nodemailer", () => require("nodemailer"));

module.exports = mod;
}}),
"[project]/utils/emailUtils.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// src/utils/emailUtils.js
__turbopack_esm__({
    "sendEmails": (()=>sendEmails)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$nodemailer__$5b$external$5d$__$28$nodemailer$2c$__cjs$29$__ = __turbopack_import__("[externals]/nodemailer [external] (nodemailer, cjs)");
;
async function sendEmails({ fullName, email, phone, linkedin, opening, score, resumeUrl, coverLetterUrl, answers, candidateTemplate, adminTemplate, questions }) {
    const transporter = __TURBOPACK__imported__module__$5b$externals$5d2f$nodemailer__$5b$external$5d$__$28$nodemailer$2c$__cjs$29$__["default"].createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    // Calculate percentage dynamically
    const percentage = Math.round(score.totalScore / score.maxPossibleScore * 100);
    // Format answers for admin email using passed questions
    const formattedAnswers = answers.map((answer, idx)=>{
        const question = questions[idx]?.text || `Question ${idx + 1}`;
        const answerText = Array.isArray(answer) ? answer.join(", ") : answer;
        return {
            question,
            answer: answerText
        };
    });
    // Send candidate email
    const candidateHtml = candidateTemplate.replace("{{fullName}}", fullName).replace("{{score}}", `${score.totalScore}/${score.maxPossibleScore} (${percentage}%)`);
    await transporter.sendMail({
        from: `"Growthpad Consulting Group" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Thank You for Submitting Your Application!",
        html: candidateHtml
    });
    // Send admin email
    const adminHtml = adminTemplate.replace("{{fullName}}", fullName).replace("{{email}}", email).replace("{{phone}}", phone || "N/A").replace("{{linkedin}}", linkedin ? `<a href="${linkedin}" style="color: #f05d23;">${linkedin}</a>` : "N/A").replace("{{opening}}", opening).replace("{{score}}", `${score.totalScore}/${score.maxPossibleScore} (${percentage}%)`).replace("{{resumeUrl}}", resumeUrl ? `<a href="${resumeUrl}" style="color: #f05d23;">Download</a>` : "Not provided").replace("{{coverLetterUrl}}", coverLetterUrl ? `<a href="${coverLetterUrl}" style="color: #f05d23;">Download</a>` : "Not provided").replace("{{answersTable}}", formattedAnswers.map((qa, index)=>`
                        <tr style="background-color: ${index % 2 === 0 ? "#f9f9f9" : "#fff"};">
                            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd;">${qa.question}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${qa.answer}</td>
                        </tr>
                    `).join(""));
    await transporter.sendMail({
        from: `"Growthpad Consulting Group" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Interview Submission from ${fullName} - ${opening} - Score (${score.totalScore}/${score.maxPossibleScore}) - ${percentage}%`,
        html: adminHtml
    });
    console.log("Emails sent successfully");
}
}}),
"[project]/utils/scoreUtils.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// src/utils/scoreUtils.js
__turbopack_esm__({
    "calculateScore": (()=>calculateScore)
});
function calculateScore(answers, questions = []) {
    let totalScore = 0;
    let maxPossibleScore = 0;
    answers.forEach((answerArray, idx)=>{
        const question = questions[idx];
        const answer = answerArray;
        if (question?.points) {
            if ("base" in question.points) {
                // Multi-select logic
                const max = question.points.max || 10; // Default max if not specified
                maxPossibleScore += max;
                if (answer.includes("None")) {
                    totalScore += 0;
                } else {
                    const count = answer.length;
                    const base = question.points.base || 5;
                    const extra = question.points.extra || 2;
                    totalScore += Math.min(base + (count - 1) * extra, max);
                }
            } else {
                // Single-select logic
                const maxOptionScore = Math.max(...Object.values(question.points).map(Number).filter((n)=>!isNaN(n))) || 10; // Default to 10 if no valid scores
                maxPossibleScore += maxOptionScore;
                const selectedAnswer = answer[0];
                if (selectedAnswer && selectedAnswer in question.points) {
                    totalScore += question.points[selectedAnswer];
                }
            }
        } else {
            console.warn(`No points defined for question ${idx + 1} (${questions[idx]?.text || "unknown"}) - skipping scoring`);
        }
    });
    return {
        totalScore: Math.min(totalScore, maxPossibleScore),
        maxPossibleScore
    };
}
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, m: module, e: exports, t: __turbopack_require_real__ } = __turbopack_context__;
{
const mod = __turbopack_external_require__("path", () => require("path"));

module.exports = mod;
}}),
"[project]/src/pages/api/submit.js [api] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// src/pages/api/submit.js
__turbopack_esm__({
    "config": (()=>config),
    "default": (()=>handler)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseServer$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/lib/supabaseServer.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$dbUtils$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/utils/dbUtils.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$driveUtils$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/utils/driveUtils.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$emailUtils$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/utils/emailUtils.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$scoreUtils$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/utils/scoreUtils.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_import__("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_import__("[externals]/path [external] (path, cjs)");
;
;
;
;
;
;
;
const config = {
    api: {
        bodyParser: {
            sizeLimit: "5mb"
        }
    }
};
async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }
    try {
        const { fullName, email, phone, linkedin, answers, resume, coverLetter, opening } = req.body;
        console.log("Received data:", {
            fullName,
            email,
            phone,
            linkedin,
            opening,
            answers,
            resume: resume ? "present" : "none",
            coverLetter: coverLetter ? "present" : "none"
        });
        if (!fullName || !email || !phone || !linkedin || !opening) {
            return res.status(400).json({
                error: "All fields (full name, email, phone, LinkedIn, and opening) are required"
            });
        }
        // Fetch questions for scoring and email
        const { data: questions, error: questionsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseServer$2e$js__$5b$api$5d$__$28$ecmascript$29$__["supabaseServer"].from("interview_questions").select("*").order("order", {
            ascending: true
        });
        if (questionsError) {
            console.error("Error fetching questions:", questionsError);
            return res.status(500).json({
                error: "Error fetching questions",
                details: questionsError.message
            });
        }
        const { userId, error: candidateError } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$dbUtils$2e$js__$5b$api$5d$__$28$ecmascript$29$__["upsertCandidate"])({
            fullName,
            email,
            phone,
            linkedin,
            opening
        });
        if (candidateError) {
            return res.status(candidateError.status).json({
                error: candidateError.message,
                details: candidateError.details
            });
        }
        const score = (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$scoreUtils$2e$js__$5b$api$5d$__$28$ecmascript$29$__["calculateScore"])(answers, questions); // Returns { totalScore, maxPossibleScore }
        const { data: existingResponse, error: fetchResponseError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseServer$2e$js__$5b$api$5d$__$28$ecmascript$29$__["supabaseServer"].from("responses").select("resume_file_id, cover_letter_file_id").eq("user_id", userId).single();
        if (fetchResponseError && fetchResponseError.code !== "PGRST116") {
            console.error("Fetch existing response error:", fetchResponseError);
            return res.status(500).json({
                error: "Error fetching existing response",
                details: fetchResponseError.message
            });
        }
        const oldResumeFileId = existingResponse?.resume_file_id;
        const oldCoverLetterFileId = existingResponse?.cover_letter_file_id;
        // Updated to pass fullName and opening
        const resumeResult = resume ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$driveUtils$2e$js__$5b$api$5d$__$28$ecmascript$29$__["uploadFileToDrive"])(fullName, opening, resume, "resume", oldResumeFileId) : {
            url: null,
            fileId: null
        };
        const coverLetterResult = coverLetter ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$driveUtils$2e$js__$5b$api$5d$__$28$ecmascript$29$__["uploadFileToDrive"])(fullName, opening, coverLetter, "cover-letter", oldCoverLetterFileId) : {
            url: null,
            fileId: null
        };
        const { error: responseError } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$dbUtils$2e$js__$5b$api$5d$__$28$ecmascript$29$__["upsertResponse"])({
            userId,
            answers,
            score: score.totalScore,
            resumeUrl: resumeResult.url,
            coverLetterUrl: coverLetterResult.url,
            resumeFileId: resumeResult.fileId,
            coverLetterFileId: coverLetterResult.fileId
        });
        if (responseError) {
            return res.status(responseError.status).json({
                error: responseError.message,
                details: responseError.details
            });
        }
        const candidateEmailTemplate = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "src/templates/candidateEmail.html"), "utf8");
        const adminEmailTemplate = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "src/templates/adminEmail.html"), "utf8");
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$utils$2f$emailUtils$2e$js__$5b$api$5d$__$28$ecmascript$29$__["sendEmails"])({
            fullName,
            email,
            phone,
            linkedin,
            opening,
            score,
            resumeUrl: resumeResult.url,
            coverLetterUrl: coverLetterResult.url,
            answers,
            candidateTemplate: candidateEmailTemplate,
            adminTemplate: adminEmailTemplate,
            questions
        });
        return res.status(200).json({
            message: "Submission successful",
            score: score.totalScore
        });
    } catch (error) {
        console.error("Submission error:", error.message);
        return res.status(500).json({
            error: "Internal server error",
            details: error.message
        });
    }
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

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__ec6438._.js.map