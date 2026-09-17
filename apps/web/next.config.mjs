/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*",
      },
      {
        source: "/git/:path*",
        destination: "http://localhost:4000/git/:path*",
      },
    ];
  },
};

export default nextConfig;
