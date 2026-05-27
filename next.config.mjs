/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    webpack: (config, { isServer }) => {
        return config;
    },
};

export default nextConfig;
