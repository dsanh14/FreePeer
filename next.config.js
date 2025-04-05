require('dotenv').config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  },
  // Add webpack configuration to handle environment variables
  webpack: (config) => {
    config.plugins = config.plugins || [];
    return config;
  },
}

module.exports = nextConfig 