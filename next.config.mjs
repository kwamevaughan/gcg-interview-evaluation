/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    },
    output: 'export', // Enables static export mode
    trailingSlash: true, // Optional: ensures URLs have a trailing slash
};

export default nextConfig;
