/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow loading images from external hosts used in development and API fixtures.
    // Using a wildcard hostname is permissive (use specific domains in production).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*", // Laravel backend
      },
      {
        source: "/sanctum/:path*",
        destination: "http://127.0.0.1:8000/sanctum/:path*",
      },
      {
        source: "/login",
        destination: "http://127.0.0.1:8000/login",
      },
    ];
  },
};

// Use ESM export for .mjs
export default nextConfig;
