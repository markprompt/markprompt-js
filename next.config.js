const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});

const corsHeaders = [
  { key: 'Access-Control-Allow-Credentials', value: 'true' },
  { key: 'Access-Control-Allow-Origin', value: '*' },
  { key: 'Access-Control-Allow-Methods', value: '*' },
  { key: 'Access-Control-Allow-Headers', value: '*' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },
    ],
  },
  async headers() {
    return [
      { source: '/api/openai/completions/(.*)', headers: corsHeaders },
      { source: '/completions/(.*)', headers: corsHeaders },
    ];
  },
};

module.exports = withMDX(nextConfig);
