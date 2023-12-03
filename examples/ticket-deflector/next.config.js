/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'markprompthelp.zendesk.com',
      },
    ],
  },
};

module.exports = nextConfig;
