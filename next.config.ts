import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The live site (github.com/Anadi9/anta) shipped two SEO pages built
      // around generic "custom website development" positioning, which
      // conflicts with what ANTA actually sells. They're being dropped, not
      // ported — but they may be indexed and linked, so redirect rather
      // than 404 and throw away whatever search equity they hold.
      // permanent: true → 308, which passes ranking signal through to /.
      { source: "/services/web-development", destination: "/", permanent: true },
      { source: "/services/custom-websites", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
