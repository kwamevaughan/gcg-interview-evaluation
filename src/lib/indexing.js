const { google } = require("googleapis");
const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ["https://www.googleapis.com/auth/indexing"],
});
const indexing = google.indexing("v3");

export async function notifyGoogle(url) {
    const authClient = await auth.getClient();
    try {
        await indexing.urlNotifications.publish({
            auth: authClient,
            requestBody: {
                url: url,
                type: "URL_UPDATED",
            },
        });
        console.log(`Notified Google for ${url}`);
    } catch (error) {
        console.error("Indexing API error:", error);
    }
}