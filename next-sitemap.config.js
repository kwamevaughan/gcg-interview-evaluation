/** @type {import('next-sitemap').IConfig} */
const { supabase } = require("./src/lib/supabase");

module.exports = {
  siteUrl: "https://careers.growthpad.co.ke", // Your production URL
  generateRobotsTxt: true, // Generates robots.txt with sitemap reference
  sitemapSize: 7000, // Max URLs per sitemap file (for large sites)
  // Exclude specific pages if needed (e.g., login pages)
  exclude: ["/hr/login"], // Example: exclude HR login page
  // Add dynamic routes
  async additionalPaths(config) {
    // Fetch job slugs from Supabase
    const { data: jobs, error } = await supabase
      .from("job_openings")
      .select("slug, updated_at");

    if (error) {
      console.error("Error fetching jobs for sitemap:", error);
      return [];
    }

    // Map jobs to sitemap entries
    const jobPaths = jobs.map((job) => ({
      loc: `/hr/jobs/${job.slug}`,
      lastmod: new Date(job.updated_at).toISOString(),
      changefreq: "daily",
      priority: 0.7,
    }));

    // Add other dynamic routes here if applicable (e.g., blog posts)
    // Example:
    /*
    const { data: blogPosts } = await supabase.from("blog_posts").select("slug, updated_at");
    const blogPaths = blogPosts?.map(post => ({
      loc: `/blog/${post.slug}`,
      lastmod: new Date(post.updated_at).toISOString(),
      changefreq: "weekly",
      priority: 0.6,
    })) || [];
    */

    // Return all dynamic paths
    return [...jobPaths /*, ...blogPaths */];
  },
  // Optional: Customize robots.txt
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/hr/login"], // Example: disallow HR login page
      },
    ],
  },
};