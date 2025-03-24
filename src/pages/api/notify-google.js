// pages/api/notify-google.js
import { notifyGoogle } from "@/lib/indexing";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    try {
        await notifyGoogle(url);
        res.status(200).json({ message: "Google notified successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to notify Google", details: error.message });
    }
}