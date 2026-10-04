import { modularTemplates } from "@/templates";
import type {
  FontPair,
  ModularLibrary,
  ModularPalette,
  ModularPattern,
  SectionModule,
} from "@/types/modular";

/*
 * Everything modular is listed by file, at build time, with Turbopack's
 * glob: a new section is a new folder, a new palette, pair or pattern a new
 * file, and nothing registers it. Server only — the editor gets the result
 * as a prop. Variants load in the browser: `./variants`.
 */
const PALETTES = import.meta.glob("./palettes/*.ts", { eager: true });
const FONT_PAIRS = import.meta.glob("./font-pairs/*.ts", { eager: true });
const PATTERNS = import.meta.glob("./patterns/*.ts", { eager: true });
const SECTIONS = import.meta.glob("./sections/*/index.ts", { eager: true });

function byName<T extends { name: string }>(items: T[]): T[] {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}

/** The whole library: what every modular editor offers. */
export function loadLibrary(): ModularLibrary {
  return {
    palettes: byName(
      Object.values(PALETTES).map(
        (module) => (module as { palette: ModularPalette }).palette,
      ),
    ),
    fontPairs: byName(
      Object.values(FONT_PAIRS).map(
        (module) => (module as { fontPair: FontPair }).fontPair,
      ),
    ),
    patterns: byName(
      Object.values(PATTERNS).map(
        (module) => (module as { pattern: ModularPattern }).pattern,
      ),
    ),
    sections: Object.values(SECTIONS)
      .map((module) => (module as SectionModule).section)
      .sort((a, b) => a.order - b.order),
    templates: modularTemplates(),
  };
}
