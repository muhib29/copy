/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
  allowedDevOrigins: ["*.fly.dev"],
};

export default nextConfig;
