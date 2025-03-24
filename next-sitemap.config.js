/** @type {import('next-sitemap').IConfig} */
const { supabase } = require("./src/lib/supabase");

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
  async additionalPaths(config) {
    const { data: jobs, error } = await supabase
      .from("job_openings")
      .select("slug, updated_at, expires_on"); // Add expires_on

    if (error) {
      console.error("Error fetching jobs for sitemap:", error);
      return [];
    }

    const jobPaths = jobs
      .filter((job) => new Date(job.expires_on) >= new Date()) // Only active jobs
      .map((job) => ({
        loc: `/hr/jobs/${job.slug}`,
        lastmod: new Date(job.updated_at).toISOString(),
        changefreq: "daily",
        priority: 0.7,
      }));

    return jobPaths;
  },
  robotsTxtOptions: {
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
  },
};