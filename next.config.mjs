/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    output: 'standalone',
};

export default nextConfig;
