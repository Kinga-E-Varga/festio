import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { NO_ROUTE } from "./src/lib/domain";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  /*
   * One 404 page for the whole app (`app/global-not-found.tsx`): with two
   * root layouts, a `notFound()` never reaches a `not-found.tsx` beside them.
   */
  experimental: { globalNotFound: true },
  /** The page tests build a second copy into `.next-test`, so it never meets `npm run dev`'s. */
  distDir: process.env.FESTIO_DIST_DIR ?? ".next",
  /* That copy skips the type check: `npm run build` already does it, and the tests need only the app. */
  typescript: { ignoreBuildErrors: Boolean(process.env.FESTIO_DIST_DIR) },
  /**
   * Dev only: lets a phone on the same Wi-Fi load the dev server by the PC's
   * local address (home networks use 192.168.x.x or 10.x.x.x), and the
   * invitations load theirs at `<slug>.localhost:3000`.
   */
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.localhost"],
  /**
   * A file name that isn't in `public/` (`/missing.png`): the proxy skips
   * file names, so it would land on `[locale]` as a language and get Next's
   * own 404. After the files, before the routes, it goes to the 404 page.
   */
  async rewrites() {
    /* A plain list runs after the files and before the routes. */
    return [{ source: "/:file((?!_next/).*\\.[^/]*)", destination: NO_ROUTE }];
  },
};

export default withNextIntl(nextConfig);
