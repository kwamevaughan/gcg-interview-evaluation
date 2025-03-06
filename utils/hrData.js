// src/utils/hrData.js
import { supabaseServer } from "@/lib/supabaseServer";

export async function fetchHRData() {
    try {
        const { data: candidatesData, error: candidatesError } = await supabaseServer
            .from("candidates")
            .select("id, full_name, email, phone, linkedin, opening");
        if (candidatesError) throw candidatesError;

        const { data: responsesData, error: responsesError } = await supabaseServer
            .from("responses")
            .select("user_id, answers, score, resume_url, cover_letter_url, status, country, device, submitted_at");
        if (responsesError) throw responsesError;

        const { data: questionsData, error: questionsError } = await supabaseServer
            .from("interview_questions")
            .select("*")
            .order("order", { ascending: true });
        if (questionsError) throw questionsError;

        const combinedData = candidatesData.map((candidate) => {
            const response = responsesData.find((r) => r.user_id === candidate.id) || {};
            let parsedAnswers = [];
            if (response.answers) {
                if (typeof response.answers === "string") {
                    try {
                        parsedAnswers = JSON.parse(response.answers);
                    } catch (e) {
                        parsedAnswers = response.answers.split(",").map((a) => a.trim());
                    }
                } else if (Array.isArray(response.answers)) {
                    parsedAnswers = response.answers;
                }
            }
            return {
                ...candidate,
                answers: Array.isArray(parsedAnswers) ? parsedAnswers : [],
                score: response.score || 0,
                resumeUrl: response.resume_url || null,
                coverLetterUrl: response.cover_letter_url || null,
                status: response.status || "Pending",
                country: response.country ? response.country.toUpperCase() : "Unknown",
                device: response.device || "Unknown",
                submitted_at: response.submitted_at || null,
                questions: questionsData,
            };
        });

        const jobOpenings = [...new Set(combinedData.map((c) => c.opening))];

        return {
            initialCandidates: combinedData,
            initialJobOpenings: jobOpenings,
            initialQuestions: questionsData,
        };
    } catch (error) {
        console.error("Error fetching HR data:", error);
        return {
            initialCandidates: [],
            initialJobOpenings: [],
            initialQuestions: [],
        };
    }
}