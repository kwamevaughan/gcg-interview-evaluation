// src/pages/api/submit.js
import { supabaseServer } from "@/lib/supabaseServer";
import { upsertCandidate, upsertResponse } from "../../../utils/dbUtils";
import { calculateScore } from "../../../utils/scoreUtils";
import fetch from "node-fetch";

// Try ESM import first, fall back to require
let UAParser;
try {
    UAParser = (await import("ua-parser-js")).default; // ESM dynamic import
} catch (esmError) {
    console.error("ESM import of ua-parser-js failed:", esmError.message);
    try {
        UAParser = require("ua-parser-js"); // Fallback to CommonJS
    } catch (requireError) {
        console.error("Require of ua-parser-js failed:", requireError.message);
        UAParser = null;
    }
}

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
        let country = req.headers["cf-ipcountry"] || "Unknown";
        const userAgent = req.headers["user-agent"] || "Unknown";
        let device = "Unknown";

        // Parse device information
        if (UAParser) {
            try {
                const parser = new UAParser(userAgent);
                const result = parser.getResult();
                const deviceType = result.device.type;
                const deviceModel = result.device.model || result.os.name || "Unknown";
                if (deviceType) {
                    device = `${deviceType.charAt(0).toUpperCase() + deviceType.slice(1)} (${deviceModel})`;
                } else {
                    device = deviceModel;
                }
                console.log("User-Agent:", userAgent, "Parsed Result:", result, "Device:", device);
            } catch (uaError) {
                console.error("Error parsing user agent with UAParser:", uaError.message);
                device = "Unknown";
            }
        } else {
            console.warn("UAParser not available; falling back to 'Unknown'");
        }

        // Fetch country from IP if Cloudflare header is "Unknown"
        if (country === "Unknown") {
            try {
                const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown";
                console.log("Fetching country for IP:", ip);
                const geoResponse = await fetch(`http://ip-api.com/json/${ip}`);
                const geoData = await geoResponse.json();
                if (geoData.status === "success") {
                    country = geoData.country || "Unknown";
                } else {
                    console.warn("IP geolocation failed:", geoData.message);
                }
            } catch (geoError) {
                console.error("Error fetching country from IP:", geoError.message);
                country = "Unknown";
            }
        }

        const submittedAt = new Date().toISOString();

        console.log("Received data:", {
            fullName,
            email,
            phone,
            linkedin,
            opening,
            answers,
            resume: resume ? "present" : "none",
            coverLetter: coverLetter ? "present" : "none",
            country,
            device,
            submittedAt,
        });

        if (!fullName || !email || !phone || !linkedin || !opening) {
            return res.status(400).json({ error: "All fields (full name, email, phone, LinkedIn, and opening) are required" });
        }

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
            country,
            device,
            submittedAt,
        });
        if (responseError) {
            return res.status(responseError.status).json({ error: responseError.message, details: responseError.details });
        }

        const baseUrl = process.env.BASE_URL || `https://${req.headers.host || "localhost:3000"}`;
        const processUrl = `${baseUrl}/api/process-submission`;
        console.log("Triggering background process at URL:", processUrl);

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
                country,
                device,
                submittedAt,
            }),
            keepalive: true,
        })
            .then(response => {
                console.log("Background process response status:", response.status);
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Background process failed with status ${response.status}: ${text}`);
                    });
                }
            })
            .catch(error => console.error("Background processing request failed:", error.message));

        return res.status(200).json({ message: "Submission successful, processing in background", score: score.totalScore });
    } catch (error) {
        console.error("Submission error:", error.message);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
}