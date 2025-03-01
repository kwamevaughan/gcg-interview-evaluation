// src/pages/api/process-submission.js
import { supabaseServer } from "@/lib/supabaseServer";
import { uploadFileToDrive, deleteFileFromDrive } from "../../../utils/driveUtils";
import { sendEmails } from "../../../utils/emailUtils";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { userId, fullName, email, phone, linkedin, opening, answers, resume, coverLetter, score, questions } = req.body;
        console.log("Processing submission for:", { fullName, email, opening });

        const { data: existingResponse, error: fetchError } = await supabaseServer
            .from("responses")
            .select("resume_file_id, cover_letter_file_id")
            .eq("user_id", userId)
            .single();

        if (fetchError && fetchError.code !== "PGRST116") {
            console.error("Fetch existing response error:", fetchError);
            throw new Error("Failed to fetch existing response");
        }

        const oldResumeFileId = existingResponse?.resume_file_id;
        const oldCoverLetterFileId = existingResponse?.cover_letter_file_id;

        const resumeResult = resume
            ? await uploadFileToDrive(fullName, opening, resume, "resume", oldResumeFileId)
            : { url: null, fileId: null };
        const coverLetterResult = coverLetter
            ? await uploadFileToDrive(fullName, opening, coverLetter, "cover-letter", oldCoverLetterFileId)
            : { url: null, fileId: null };

        const { error: updateError } = await supabaseServer
            .from("responses")
            .update({
                resume_url: resumeResult.url,
                cover_letter_url: coverLetterResult.url,
                resume_file_id: resumeResult.fileId,
                cover_letter_file_id: coverLetterResult.fileId,
            })
            .eq("user_id", userId);

        if (updateError) {
            console.error("Update response error:", updateError);
            throw new Error("Failed to update response with Drive URLs");
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
            questions,
        });


        return res.status(200).json({ message: "Background processing completed" });
    } catch (error) {
        console.error("Background processing error:", error.message);
        return res.status(500).json({ error: "Background processing failed", details: error.message });
    }
}