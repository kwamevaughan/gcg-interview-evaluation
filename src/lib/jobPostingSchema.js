export function generateJobPostingSchema(job, countries) {
    if (!job) return null;

    const countryCode = job.location?.country
        ? countries.find((c) => c.name === job.location.country)?.code || job.location.country
        : "KE";

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
            logo: "https://careers.growthpad.co.ke/favicon.png",
        },
        jobLocation: job.location
            ? {
                  "@type": "Place",
                  address: {
                      "@type": "PostalAddress",
                      streetAddress: job.location.streetAddress || "Mitsumi Business Park, 7th floor",
                      addressLocality: job.location.city || "Nairobi",
                      addressRegion: job.location.region || "Nairobi County",
                      postalCode: job.location.postalCode || "00100",
                      addressCountry: countryCode,
                  },
              }
            : {
                  "@type": "Place",
                  address: {
                      "@type": "PostalAddress",
                      streetAddress: "Mitsumi Business Park, 7th floor",
                      addressLocality: "Nairobi",
                      addressRegion: "Nairobi County",
                      postalCode: "00100",
                      addressCountry: "KE",
                  },
              },
        ...(job.remote ? { jobLocationType: "TELECOMMUTE" } : {}),
        directApply: true,
    };
}