"use client";

import { useTranslations } from "next-intl";
import { COUNTDOWN_DONE, type CountdownDone } from "@/modular/countdown";
import { SectionHeading } from "@/modular/SectionHeading";

/**
 * What a countdown shows once there is nothing left to count: a fixed
 * eyebrow in the heading's place, then one line in the numbers' face
 * (`className`). Shared by the countdown's variants.
 */
export function Done({
  done,
  className,
}: {
  done: CountdownDone;
  className: string;
}) {
  const t = useTranslations("Sections");
  return (
    <>
      <SectionHeading values={{ eyebrow: t(COUNTDOWN_DONE[done].eyebrow) }} />
      <p className={`${className} text-center text-balance`}>
        {t(COUNTDOWN_DONE[done].line)}
      </p>
    </>
  );
}
