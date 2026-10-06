import Image from "next/image";
import type { SectionGround } from "@/types/modular";
import { GROUND } from "./styles";

/**
 * A mood photo filling its positioned box, with a ground washed over it, its
 * hue only, so the photo takes the palette's colour. Its alt is empty: it
 * is mood, not content. Content drawn after it must be positioned to sit
 * above.
 */
export function WashedPhoto({
  src,
  sizes,
  ground,
  preload = false,
}: {
  src: string;
  sizes: string;
  ground: SectionGround;
  preload?: boolean;
}) {
  return (
    <>
      <Image
        src={src}
        alt=""
        fill
        preload={preload}
        sizes={sizes}
        className="object-cover"
      />
      <div
        className={`absolute inset-0 ${GROUND[ground]} opacity-30 mix-blend-color`}
      />
    </>
  );
}
