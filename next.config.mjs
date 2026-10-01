/** @type {import('next').NextConfig} */

/**
 * Where the backend lives, for the same-origin proxy below. In development it
 * defaults to the local backend; elsewhere, unset means the browser talks to
 * the API directly at NEXT_PUBLIC_API_URL.
 */
const apiProxyTarget = (
  process.env.API_PROXY_TARGET ??
  (process.env.NODE_ENV === "development" ? "http://localhost:4000" : "")
).replace(/\/+$/, "");

const nextConfig = {
  reactStrictMode: true,
  // Linting runs as its own step (`npm run lint` / a dedicated CI job), so keep
  // `next build` focused on compilation + type-checking and don't lint twice.
  eslint: { ignoreDuringBuilds: true },

  /**
   * Same-origin API. With API_PROXY_TARGET set, `/api/*` on this app is
   * forwarded to the backend, so the browser only ever talks to its own
   * address: the session cookie is first-party and works in every browser,
   * even with the web app on vercel.app and the API on onrender.com. Routes
   * this app defines itself (app/api/*) still win over the rewrite.
   */
  async rewrites() {
    if (!apiProxyTarget) return [];
    return [
      { source: "/api/:path*", destination: `${apiProxyTarget}/api/:path*` },
    ];
  },
};

export default nextConfig;
