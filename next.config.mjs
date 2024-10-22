/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "profile.intra.42.fr",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
