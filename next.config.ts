import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  /**
   * Guest invite links stay unprefixed (`festio.eu/maria-birthday-1657`) —
   * a hard requirement — but `[invite]` can't sit next to `[locale]` at the
   * app root (Next.js disallows two differently-named dynamic siblings), so
   * it lives at `app/invite/[invite]` and this rewrite makes that invisible.
   * The slug shape mirrors `parseInviteParam` in `src/lib/invitation.ts`.
   */
  async rewrites() {
    return [
      {
        source: "/:invite(.+-\\d{4})",
        destination: "/invite/:invite",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
