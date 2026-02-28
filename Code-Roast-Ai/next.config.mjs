/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensures API routes time out gracefully on Vercel
  experimental: {
    serverComponentsExternalPackages: ["openai"],
  },
};

export default nextConfig;
