/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', // add port if necessary
        pathname: '/**', // adjust the path if needed
      },
    ],
  },
};

export default nextConfig;