// src/utils/emailUtils.js
import nodemailer from "nodemailer";

export async function sendEmails({
                                     fullName,
                                     email,
                                     phone,
                                     linkedin,
                                     opening,
                                     score, // Now an object { totalScore, maxPossibleScore }
                                     resumeUrl,
                                     coverLetterUrl,
                                     answers,
                                     candidateTemplate,
                                     adminTemplate,
                                     questions,
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

    // Calculate percentage dynamically
    const percentage = Math.round((score.totalScore / score.maxPossibleScore) * 100);

    // Format answers for admin email using passed questions
    const formattedAnswers = answers.map((answer, idx) => {
        const question = questions[idx]?.text || `Question ${idx + 1}`;
        const answerText = Array.isArray(answer) ? answer.join(", ") : answer;
        return { question, answer: answerText };
    });

    // Send candidate email
    const candidateHtml = candidateTemplate
        .replace("{{fullName}}", fullName)
        .replace("{{score}}", `${score.totalScore}/${score.maxPossibleScore} (${percentage}%)`);

    await transporter.sendMail({
        from: `"Growthpad Consulting Group" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Thank You for Submitting Your Application!",
        html: candidateHtml,
    });

    // Send admin email
    const adminHtml = adminTemplate
        .replace("{{fullName}}", fullName)
        .replace("{{email}}", email)
        .replace("{{phone}}", phone || "N/A")
        .replace("{{linkedin}}", linkedin ? `<a href="${linkedin}" style="color: #f05d23;">${linkedin}</a>` : "N/A")
        .replace("{{opening}}", opening)
        .replace("{{score}}", `${score.totalScore}/${score.maxPossibleScore} (${percentage}%)`)
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
        to: "careers@growthpad.co.ke",
        subject: `New Interview Submission from ${fullName} - ${opening} - Score (${score.totalScore}/${score.maxPossibleScore}) - ${percentage}%`,
        html: adminHtml,
    });

    console.log("Emails sent successfully");
}