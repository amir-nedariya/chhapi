/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['react-router-dom'] = path.resolve(__dirname, 'src/polyfills/react-router-dom.jsx');
    return config;
  }
};

export default nextConfig;
