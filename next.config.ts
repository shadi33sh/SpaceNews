module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Covers all https domains
      },
      {
        protocol: 'http', // Explicitly add http for spaceflightnow.com
        hostname: 'spaceflightnow.com',
      },
    ],
  },
};
