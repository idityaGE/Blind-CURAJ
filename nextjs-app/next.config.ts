import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**", // Allow all paths from this domain
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // Allow all paths from this domain
      },
    ],
  },
};

export default nextConfig;
