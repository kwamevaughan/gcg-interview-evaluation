/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    },
    async rewrites() {
        return [
            {
                source: "/sitemap.xml",
                destination: "/api/sitemap",
            },
        ];
    },
    generateRobotsTxt: true,
};

export default nextConfig;