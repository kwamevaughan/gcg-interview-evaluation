// src/pages/api/submit.js
import { supabaseServer } from "@/lib/supabaseServer";
import { upsertCandidate, upsertResponse } from "../../../utils/dbUtils";
import { calculateScore } from "../../../utils/scoreUtils";
import fetch from "node-fetch";

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

        // Fetch questions for scoring
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

        const { error: responseError } = await upsertResponse({
            userId,
            answers,
            score: score.totalScore,
            resumeUrl: null,
            coverLetterUrl: null,
            resumeFileId: null,
            coverLetterFileId: null,
        });
        if (responseError) {
            return res.status(responseError.status).json({ error: responseError.message, details: responseError.details });
        }

        // Fire-and-forget request to process Drive uploads and emails
        const processUrl = `${req.headers.origin || "http://localhost:3000"}/api/process-submission`;
        fetch(processUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId,
                fullName,
                email,
                phone,
                linkedin,
                opening,
                answers,
                resume,
                coverLetter,
                score,
                questions,
            }),
            keepalive: true,
        }).catch(error => console.error("Background processing request failed:", error));

        return res.status(200).json({ message: "Submission successful, processing in background", score: score.totalScore });
    } catch (error) {
        console.error("Submission error:", error.message);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
}