// src/utils/dbUtils.js
import { supabase } from "/lib/supabase";

export async function upsertCandidate({ fullName, email, phone, linkedin, opening }) {
    try {
        console.log("Checking for existing candidate with email:", email);
        const { data: existingCandidate, error: fetchError } = await supabase
            .from("candidates")
            .select("id")
            .eq("email", email)
            .single();

        let userId;
        if (fetchError && fetchError.code !== "PGRST116") {
            console.error("Fetch existing candidate error:", fetchError);
            return { error: { status: 500, message: "Error checking existing candidate", details: fetchError.message } };
        }

        if (existingCandidate) {
            console.log("Updating existing candidate with email:", email);
            const { data: updatedCandidate, error: updateError } = await supabase
                .from("candidates")
                .update({ full_name: fullName, phone, linkedin, opening }) // Include opening
                .eq("email", email)
                .select()
                .single();
            if (updateError) throw updateError;
            userId = updatedCandidate.id;
        } else {
            console.log("Inserting new candidate with data:", { full_name: fullName, email, phone, linkedin, opening });
            const { data: newCandidate, error: insertError } = await supabase
                .from("candidates")
                .insert([{ full_name: fullName, email, phone, linkedin, opening }]) // Include opening
                .select()
                .single();
            if (insertError) throw insertError;
            userId = newCandidate.id;
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