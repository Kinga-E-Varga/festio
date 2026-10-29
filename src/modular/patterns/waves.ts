import type { ModularPattern } from "@/types/modular";

/**
 * `--m-pattern` wavy stripes: 36px bands, every other one the pattern colour,
 * their edges waving. On one 48 × 144px tile, eight half-ellipse layers each
 * bulge a band into the next, stepped 12px across and 36px down: four in the
 * pattern colour and four in the surface (`--m-surface`: patterns sit only on
 * it), over the plain stripes.
 */
export const pattern: ModularPattern = {
  id: "waves",
  name: "Waves",
  className:
    "bg-[image:radial-gradient(37.5%_12.5%_at_62.5%_100%,transparent_32%,var(--m-surface)_34%_99%,transparent_101%),radial-gradient(37.5%_12.5%_at_62.5%_0,transparent_32%,var(--m-surface)_34%_99%,transparent_101%),radial-gradient(37.5%_12.5%_at_62.5%_100%,transparent_32%,var(--m-pattern)_34%_99%,transparent_101%),radial-gradient(37.5%_12.5%_at_62.5%_0,transparent_32%,var(--m-pattern)_34%_99%,transparent_101%),radial-gradient(37.5%_12.5%_at_62.5%_100%,transparent_32%,var(--m-surface)_34%_99%,transparent_101%),radial-gradient(37.5%_12.5%_at_62.5%_0,transparent_32%,var(--m-surface)_34%_99%,transparent_101%),radial-gradient(37.5%_12.5%_at_62.5%_100%,transparent_32%,var(--m-pattern)_34%_99%,transparent_101%),radial-gradient(37.5%_12.5%_at_62.5%_0,transparent_32%,var(--m-pattern)_34%_99%,transparent_101%),repeating-linear-gradient(transparent_0_25%,var(--m-pattern)_0_50%)] bg-[length:48px_144px] bg-[position:0_0,0_36px,12px_36px,12px_72px,24px_72px,24px_108px,36px_108px,36px_0,0_0]",
};
