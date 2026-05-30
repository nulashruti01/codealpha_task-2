const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3333/:path*',
      },
    ];
  },
};

export default nextConfig;
