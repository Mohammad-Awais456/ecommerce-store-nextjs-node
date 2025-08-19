module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5555/api/:path*' // Proxy to Backend
      }
    ];
  }
}
