export function generateJobPostingSchema(job) {
    if (!job) return null;

    return {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.title,
        description: job.description || "View the full job description on our careers page.",
        datePosted: new Date(job.created_at).toISOString().split("T")[0],
        validThrough: new Date(job.expires_on.split("/").reverse().join("-")).toISOString().split("T")[0],
        employmentType: job.employment_type || "FULL_TIME",
        hiringOrganization: {
            "@type": "Organization",
            name: "Growthpad Consulting Group",
            sameAs: "https://growthpad.co.ke",
            logo: "https://growthpad.co.ke/wp-content/uploads/2024/10/GCG-final-logo-proposals_v6-6.png", // Updated logo URL
        },
        jobLocation: job.location
            ? {
                  "@type": "Place",
                  address: {
                      "@type": "PostalAddress",
                      addressLocality: job.location.city,
                      addressRegion: job.location.region,
                      addressCountry: job.location.country,
                  },
              }
            : {
                  "@type": "Place",
                  address: {
                      "@type": "PostalAddress",
                      addressLocality: "Nairobi",
                      addressRegion: "Nairobi County",
                      addressCountry: "KE",
                  },
              },
        ...(job.remote ? { jobLocationType: "TELECOMMUTE" } : {}),
        directApply: true,
    };
}