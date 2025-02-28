// src/pages/api/upload-job-file.js
import { google } from "googleapis";
import { Readable } from "stream";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { fileData, fileType } = req.body;

    try {
        const serviceAccountCreds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
        const auth = new google.auth.GoogleAuth({
            credentials: serviceAccountCreds,
            scopes: ["https://www.googleapis.com/auth/drive.file"],
        });
        const drive = google.drive({ version: "v3", auth });

        const isPdf = fileType === "pdf";
        const ext = isPdf ? "pdf" : "docx";
        const fileName = `job-opening-${Date.now()}.${ext}`;
        const buffer = Buffer.from(fileData, "base64");

        const bufferStream = new Readable();
        bufferStream.push(buffer);
        bufferStream.push(null);

        const fileMetadata = {
            name: fileName,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_NEW], // Updated to new folder ID
        };

        const media = {
            mimeType: isPdf
                ? "application/pdf"
                : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            body: bufferStream,
        };

        const driveResponse = await drive.files.create({
            requestBody: fileMetadata,
            media,
            fields: "id, webContentLink",
        });

        await drive.permissions.create({
            fileId: driveResponse.data.id,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });

        const fileUrl = driveResponse.data.webContentLink;
        res.status(200).json({ url: fileUrl, fileId: driveResponse.data.id });
    } catch (error) {
        console.error("Upload error:", error.message, error.stack || "No stack trace");
        res.status(500).json({ error: "Failed to upload file" });
    }
}