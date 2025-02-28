// src/pages/api/submit.js
import { supabaseServer } from "@/lib/supabaseServer";
import { upsertCandidate, upsertResponse } from "../../../utils/dbUtils";
import { uploadFileToDrive, deleteFileFromDrive } from "../../../utils/driveUtils";
import { sendEmails } from "../../../utils/emailUtils";
import { calculateScore } from "../../../utils/scoreUtils";
import fs from "fs";
import path from "path";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "5mb",
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
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
            coverLetter: coverLetter ? "present" : "none",
        });

        if (!fullName || !email || !phone || !linkedin || !opening) {
            return res.status(400).json({ error: "All fields (full name, email, phone, LinkedIn, and opening) are required" });
        }

        // Fetch questions for scoring and email
        const { data: questions, error: questionsError } = await supabaseServer
            .from("interview_questions")
            .select("*")
            .order("order", { ascending: true });
        if (questionsError) {
            console.error("Error fetching questions:", questionsError);
            return res.status(500).json({ error: "Error fetching questions", details: questionsError.message });
        }

        const { userId, error: candidateError } = await upsertCandidate({ fullName, email, phone, linkedin, opening });
        if (candidateError) {
            return res.status(candidateError.status).json({ error: candidateError.message, details: candidateError.details });
        }

        const score = calculateScore(answers, questions);

        const { data: existingResponse, error: fetchResponseError } = await supabaseServer
            .from("responses")
            .select("resume_file_id, cover_letter_file_id")
            .eq("user_id", userId)
            .single();

        if (fetchResponseError && fetchResponseError.code !== "PGRST116") {
            console.error("Fetch existing response error:", fetchResponseError);
            return res.status(500).json({ error: "Error fetching existing response", details: fetchResponseError.message });
        }

        const oldResumeFileId = existingResponse?.resume_file_id;
        const oldCoverLetterFileId = existingResponse?.cover_letter_file_id;

        const resumeResult = resume ? await uploadFileToDrive(userId, resume, "resume", oldResumeFileId) : { url: null, fileId: null };
        const coverLetterResult = coverLetter
            ? await uploadFileToDrive(userId, coverLetter, "cover-letter", oldCoverLetterFileId)
            : { url: null, fileId: null };

        const { error: responseError } = await upsertResponse({
            userId,
            answers,
            score,
            resumeUrl: resumeResult.url,
            coverLetterUrl: coverLetterResult.url,
            resumeFileId: resumeResult.fileId,
            coverLetterFileId: coverLetterResult.fileId,
        });
        if (responseError) {
            return res.status(responseError.status).json({ error: responseError.message, details: responseError.details });
        }

        const candidateEmailTemplate = fs.readFileSync(path.join(process.cwd(), "src/templates/candidateEmail.html"), "utf8");
        const adminEmailTemplate = fs.readFileSync(path.join(process.cwd(), "src/templates/adminEmail.html"), "utf8");

        await sendEmails({
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
            questions, // Pass the fetched questions to sendEmails
        });

        return res.status(200).json({ message: "Submission successful", score });
    } catch (error) {
        console.error("Submission error:", error.message);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
}