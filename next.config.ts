import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { INVITE_PATH_PATTERN } from "./src/lib/slug";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  /**
   * Guest invite links stay unprefixed (`festio.eu/maria-birthday`) — a
   * hard requirement — but `[invite]` can't sit next to `[locale]` at the
   * app root (Next.js disallows two differently-named dynamic siblings), so
   * it lives at `app/invite/[invite]` and this rewrite makes that invisible.
   * An array of rewrites runs before dynamic routes, so `[locale]` never
   * sees a guest link; reserved slugs are left to the host app.
   */
  async rewrites() {
    return [
      {
        source: `/:invite(${INVITE_PATH_PATTERN})`,
        destination: "/invite/:invite",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
