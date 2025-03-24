/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: "https://careers.growthpad.co.ke",
    generateRobotsTxt: true,
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
    },
};

export default config;