/** @type {import('next-sitemap').IConfig} */
import { supabase } from "./src/lib/supabase";

export const siteUrl = "https://careers.growthpad.co.ke";
export const generateRobotsTxt = true;
export const sitemapSize = 7000;
export const exclude = [
    "/hr/analytics",
    "/hr/applicants",
    "/hr/automations",
    "/hr/email-templates",
    "/hr/interview-questions",
    "/hr/overview",
    "/hr/recruiters",
    "/hr/settings",
    "/hr/verify",
    "/hr/login", // Login page
];
export async function additionalPaths(config) {
    // Fetch job slugs from Supabase for /hr/jobs/[slug]
    const { data: jobs, error } = await supabase
        .from("job_openings")
        .select("slug, updated_at");

    if (error) {
        console.error("Error fetching jobs for sitemap:", error);
        return [];
    }

    const jobPaths = jobs.map((job) => ({
        loc: `/hr/jobs/${job.slug}`,
        lastmod: new Date(job.updated_at).toISOString(),
        changefreq: "daily",
        priority: 0.7,
    }));

    return jobPaths;
}
export const robotsTxtOptions = {
    policies: [
        {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/hr/analytics",
                "/hr/applicants",
                "/hr/automations",
                "/hr/email-templates",
                "/hr/interview-questions",
                "/hr/overview",
                "/hr/recruiters",
                "/hr/settings",
                "/hr/verify",
                "/hr/login",
            ],
        },
    ],
};