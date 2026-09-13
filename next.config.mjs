/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Linting runs as its own step (`npm run lint` / a dedicated CI job), so keep
  // `next build` focused on compilation + type-checking and don't lint twice.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
