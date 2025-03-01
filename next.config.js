// next.config.js
module.exports = {
    target: 'serverless',
    experimental: {
        outputStandalone: true,
    },
    // Optional: If you're using custom routing or other Cloudflare-specific features
    cloudflarePages: {
        pagesDirectory: '.next', // If needed to point to .next directory
    },
};
