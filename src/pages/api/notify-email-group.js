import { supabase } from "@/lib/supabase";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { groupId, jobTitle, jobId, expiresOn } = req.body;

    try {
        const { data: groupData, error: groupError } = await supabase
            .from("email_groups")
            .select("name, emails")
            .eq("id", groupId)
            .single();
        if (groupError || !groupData) throw new Error("Email group not found");

        const { name, emails } = groupData;
        const emailList = emails.split(",");

        const { data: jobData, error: jobError } = await supabase
            .from("job_openings")
            .select("slug")
            .eq("id", jobId)
            .single();
        if (jobError || !jobData) throw new Error("Job not found");

        const { data: templateData, error: templateError } = await supabase
            .from("email_templates")
            .select("subject, body")
            .eq("name", "jobPostedNotification")
            .single();
        if (templateError || !templateData) {
            console.error("Template fetch error:", templateError);
            throw new Error("Job posting notification template not found");
        }

        const { subject, body } = templateData;
        const jobUrl = `${process.env.BASE_URL}/hr/jobs/${jobData.slug}`; // Use slug

        const finalSubject = subject.replace("{{jobTitle}}", jobTitle).replace("{{jobUrl}}", jobUrl);
        let finalBody = body
            .replace("{{jobTitle}}", jobTitle)
            .replace("{{jobUrl}}", jobUrl)
            .replace("{{expiresOn}}", expiresOn || "N/A");

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_SECURE === "true",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"HR Team" <${process.env.EMAIL_USER}>`,
            replyTo: "careers@growthpad.co.ke",
            to: emailList,
            subject: finalSubject,
            html: finalBody,
            text: `A new job "${jobTitle}" has been posted. Expires on: ${expiresOn || "N/A"}. View it here: ${jobUrl}. Regards, HR Team`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: `Notified ${name} successfully` });
    } catch (error) {
        console.error("Error notifying email group:", error);
        res.status(500).json({ error: "Failed to send notification" });
    }
}