// pages/api/sitemap.js
import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
    try {
        const { data: jobs, error } = await supabase
            .from("job_openings")
            .select("slug, updated_at, expires_on");

        if (error) throw error;

        const activeJobs = jobs.filter((job) => new Date(job.expires_on) >= new Date());

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://careers.growthpad.co.ke/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://careers.growthpad.co.ke/job-board</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    ${activeJobs
        .map(
            (job) => `
    <url>
        <loc>https://careers.growthpad.co.ke/jobs/${job.slug}</loc>
        <lastmod>${new Date(job.updated_at).toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
    </url>`
        )
        .join("")}
</urlset>`;

        res.setHeader("Content-Type", "application/xml");
        res.status(200).send(xml);
    } catch (error) {
        console.error("Error generating sitemap:", error);
        res.status(500).send("Error generating sitemap");
    }
}