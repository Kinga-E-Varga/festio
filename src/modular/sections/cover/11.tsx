import Image from "next/image";
import { imageSrc, longDate, text } from "@/modular/content";
import { EYEBROW, PHOTO_DARK, COVER_DATE } from "@/modular/styles";
import { CoverNames } from "@/modular/CoverNames";
import type { VariantProps } from "@/types/modular";

/*
 * The photo's height below the frosted bar (`pt-bar`, as the cover is drawn
 * from the page's top) in two: the words' box the top 65% (`WORDS`), the
 * photo alone the 35% below (`REST`). Both grow from nothing in those
 * shares, so the split holds whatever the photo's height; when the words
 * need more, their box takes their height and the rest is left below.
 */
const REST = "flex-[7_1_0]";

/*
 * The words, bunched in the middle of their box, centred, a size container
 * so the names and the date step with its width. Positioned, so drawn over
 * the photo.
 */
const WORDS = `@container relative flex min-h-fit w-full flex-[13_1_0] flex-col items-center justify-center px-6 py-6 text-center ${PHOTO_DARK}`;

/*
 * The photo's box, the words in it, so they always sit on the photo: the
 * whole cover, until the page is wider than 1600px;
 * past that capped and centred both ways, the page's own ground round it:
 * 3 : 2, 1600px wide and two thirds of that tall (about 1067px), shorter if the cover is. The height
 * caps only past that width too, so a tall upright tablet still gets the
 * whole cover. The photo is cropped to the box as ever. While the photo is
 * missing the accent stands in, as on the other photo covers. The words
 * start below the frosted bar (`pt-bar`), as the cover is drawn from the
 * page's top.
 */
const STAGE =
  "relative flex w-full grow max-w-[1600px] @min-[1601px]/page:max-h-[calc(1600px*2/3)] flex-col overflow-hidden bg-(--m-accent) pt-bar @5xl:pt-bar-lg";

/* The fine line between the date and the details line. */
const DIVIDER = "my-5 h-px w-16 bg-current opacity-50";

/**
 * A photo cover: the host's photo filling the whole cover (capped
 * on a very big screen, `STAGE`), and centred in its top 65% the
 * names and their second line, the event's date, a
 * divider and the host's free line, all in one dark colour (`PHOTO_DARK`),
 * for a photo light where they sit.
 */
export function Variant({ values, basics, language }: VariantProps) {
  const photo = imageSrc(text(values, "photo"));
  const details = text(values, "details");
  const date = longDate(basics.date, language);

  return (
    /*
     * The whole screen: the page's width (`wide`) and the hero's height from
     * under the frosted bar (`underHeader`), never shorter than a phone's
     * 440px; the photo's box centred in it (`STAGE`). `data-cover` for the
     * envelope's strip.
     */
    <div
      data-cover
      className="relative flex min-h-110 grow flex-col items-center justify-center"
    >
      <div className={STAGE}>
        {/* The photo as it is, not washed: the words rely on it being light there. */}
        {photo ? (
          <Image
            src={photo}
            alt=""
            fill
            preload
            sizes="(min-width: 1600px) 1600px, 100vw"
            className="object-cover"
          />
        ) : null}
        <div className={WORDS}>
          {/* The names and their second line, one heading in one size and face. */}
          <CoverNames values={values} look="photoDark" />
          {date ? <p className={`${COVER_DATE} mt-3`}>{date}</p> : null}
          {details ? (
            <>
              <span className={DIVIDER} aria-hidden="true" />
              <p className={`${EYEBROW} whitespace-pre-line`}>{details}</p>
            </>
          ) : null}
        </div>
        <div className={REST} />
      </div>
    </div>
  );
}
