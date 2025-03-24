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
    // Remove additionalPaths since sitemap is dynamic
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
        additionalSitemaps: ["https://careers.growthpad.co.ke/api/sitemap"], // Point to dynamic sitemap
    },
};