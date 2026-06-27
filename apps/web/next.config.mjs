/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/horoscope/jathagam2',
        destination: '/horoscope/jathagam',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
