/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Add this setting to reduce chunk sizes
    webpack: (config) => {
        config.optimization.splitChunks = {
            chunks: 'all',
            maxSize: 20000000,
        };
        return config;
    }
};

module.exports = nextConfig;