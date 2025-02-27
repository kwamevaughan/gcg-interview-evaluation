// src/utils/dbUtils.js
import { supabase } from "/lib/supabase";

export async function upsertCandidate({ fullName, email, phone, linkedin }) {
    try {
        console.log("Checking for existing candidate with email:", email);
        const { data: existingCandidate, error: fetchError } = await supabase
            .from("candidates")
            .select("id")
            .eq("email", email)
            .single();

        if (fetchError && fetchError.code !== "PGRST116") {
            console.error("Fetch existing candidate error:", fetchError);
            return { error: { status: 500, message: "Error checking existing candidate", details: fetchError.message } };
        }

        let userId;

        if (existingCandidate) {
            console.log("Updating existing candidate with email:", email);
            const { data: updatedCandidate, error: updateError } = await supabase
                .from("candidates")
                .update({ full_name: fullName, phone, linkedin })
                .eq("email", email)
                .select()
                .single();

            if (updateError) {
                console.error("Update candidate error:", updateError);
                return { error: { status: 403, message: "Failed to update candidate", details: updateError.message } };
            }
            userId = updatedCandidate.id;
            console.log("Updated candidate ID:", userId);
        } else {
            console.log("Attempting to insert into candidates with data:", { full_name: fullName, email, phone, linkedin });
            const { data: newCandidate, error: insertError } = await supabase
                .from("candidates")
                .insert([{ full_name: fullName, email, phone, linkedin }])
                .select()
                .single();

            if (insertError) {
                console.error("Insert candidate error:", insertError);
                return { error: { status: 403, message: "Failed to insert candidate", details: insertError.message } };
            }
            userId = newCandidate.id;
            console.log("Inserted candidate ID:", userId);
        }

        return { userId };
    } catch (error) {
        console.error("Database operation error:", error.message);
        return { error: { status: 500, message: "Database operation failed", details: error.message } };
    }
}

export async function upsertResponse({ userId, answers, score, resumeUrl, coverLetterUrl, resumeFileId, coverLetterFileId }) {
    try {
        console.log("Attempting to upsert response with data:", {
            user_id: userId,
            answers: JSON.stringify(answers),
            score,
            resume_url: resumeUrl,
            cover_letter_url: coverLetterUrl,
            resume_file_id: resumeFileId,
            cover_letter_file_id: coverLetterFileId,
        });
        const { error } = await supabase
            .from("responses")
            .upsert(
                [
                    {
                        user_id: userId,
                        answers: JSON.stringify(answers),
                        score,
                        resume_url: resumeUrl,
                        cover_letter_url: coverLetterUrl,
                        resume_file_id: resumeFileId,
                        cover_letter_file_id: coverLetterFileId,
                    },
                ],
                { onConflict: ["user_id"], update: ["answers", "score", "resume_url", "cover_letter_url", "resume_file_id", "cover_letter_file_id"] }
            );

        if (error) {
            console.error("Response upsert error:", error);
            return { error: { status: 403, message: "Failed to upsert response", details: error.message } };
        }
        return {};
    } catch (error) {
        console.error("Response upsert error:", error.message);
        return { error: { status: 500, message: "Response upsert failed", details: error.message } };
    }
}