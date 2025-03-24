/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: "https://careers.growthpad.co.ke",
    generateRobotsTxt: true,
    sitemapSize: 7000,
    exclude: [
        "/hr/jobs",
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
    outDir: "public", // Ensure output goes to public folder
    sitemapBaseFileName: "sitemap-static", // Rename default sitemap to sitemap-static.xml
    generateIndexSitemap: true, // Generate sitemap.xml as index
    robotsTxtOptions: {
        policies: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/hr/jobs",
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
        additionalSitemaps: ["https://careers.growthpad.co.ke/sitemap-jobs.xml"], // Point to renamed dynamic sitemap
    },
};