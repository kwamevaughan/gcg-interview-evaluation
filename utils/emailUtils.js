// src/utils/emailUtils.js
import nodemailer from "nodemailer";
import { questions } from "@/data/questions";

export async function sendEmails({
                                     fullName,
                                     email,
                                     phone,
                                     linkedin,
                                     opening,
                                     score,
                                     resumeUrl,
                                     coverLetterUrl,
                                     answers,
                                     candidateTemplate,
                                     adminTemplate,
                                 }) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Calculate percentage
    const percentage = Math.round((score / 190) * 100);

    // Format answers for admin email
    const formattedAnswers = Object.keys(answers).map((key) => {
        const questionIndex = parseInt(key, 10);
        const question = questions[questionIndex]?.text || `Question ${parseInt(key) + 1}`;
        const answer = Array.isArray(answers[key]) ? answers[key].join(", ") : answers[key];
        return { question, answer };
    });

    // Send candidate email
    const candidateHtml = candidateTemplate
        .replace("{{fullName}}", fullName)
        .replace("{{score}}", `${score}/190 (${percentage}%)`); // Include percentage

    await transporter.sendMail({
        from: `"Growthpad Consulting Group" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Thank You for Submitting Your Application!", // Updated subject
        html: candidateHtml,
    });

    // Send admin email
    const adminHtml = adminTemplate
        .replace("{{fullName}}", fullName)
        .replace("{{email}}", email)
        .replace("{{phone}}", phone || "N/A")
        .replace("{{linkedin}}", linkedin ? `<a href="${linkedin}" style="color: #f05d23;">${linkedin}</a>` : "N/A")
        .replace("{{opening}}", opening)
        .replace("{{score}}", score)
        .replace(
            "{{resumeUrl}}",
            resumeUrl ? `<a href="${resumeUrl}" style="color: #f05d23;">Download</a>` : "Not provided"
        )
        .replace(
            "{{coverLetterUrl}}",
            coverLetterUrl ? `<a href="${coverLetterUrl}" style="color: #f05d23;">Download</a>` : "Not provided"
        )
        .replace(
            "{{answersTable}}",
            formattedAnswers
                .map(
                    (qa, index) => `
                        <tr style="background-color: ${index % 2 === 0 ? "#f9f9f9" : "#fff"};">
                            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd;">${qa.question}</td>
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${qa.answer}</td>
                        </tr>
                    `
                )
                .join("")
        );

    await transporter.sendMail({
        from: `"Growthpad Consulting Group" <${process.env.EMAIL_USER}>`,
        to: "analytics.growthpad@gmail.com",
        subject: `New Interview Submission from ${fullName} - ${opening} - Score (${score}/190) - Percentage - ${percentage}%`, // Updated subject
        html: adminHtml,
    });

    console.log("Emails sent successfully");
}