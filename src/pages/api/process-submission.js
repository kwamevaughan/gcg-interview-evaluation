import { supabaseServer } from "@/lib/supabaseServer";
import { uploadFileToDrive } from "../../../utils/driveUtils";
import { sendEmails } from "../../../utils/emailUtils";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { userId, fullName, email, phone, linkedin, opening, answers, resume, coverLetter, score, questions, country, device, submittedAt } = req.body;
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
                country,
                device,
                submitted_at: submittedAt
            })
            .eq("user_id", userId);

        if (updateError) {
            console.error("Update response error:", updateError);
            throw new Error("Failed to update response with Drive URLs");
        }

        // Fetch templates from database
        const { data: templates, error: templateError } = await supabaseServer
            .from("email_templates")
            .select("name, subject, body")
            .in("name", ["candidateEmail", "adminEmail"]);

        if (templateError) throw templateError;

        const candidateTemplate = templates.find(t => t.name === "candidateEmail")?.body || "";
        const adminTemplate = templates.find(t => t.name === "adminEmail")?.body || "";
        const candidateSubject = templates.find(t => t.name === "candidateEmail")?.subject || "Application Received";
        const adminSubject = templates.find(t => t.name === "adminEmail")?.subject || "New Submission Received";

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
            candidateTemplate,
            adminTemplate,
            candidateSubject,
            adminSubject,
            questions,
        });

        return res.status(200).json({ message: "Background processing completed" });
    } catch (error) {
        console.error("Background processing error:", error.message);
        return res.status(500).json({ error: "Background processing failed", details: error.message });
    }
}