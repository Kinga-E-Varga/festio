import { useTranslations } from "next-intl";
import { ATTENTION_TAG } from "@/components/dashboard/styles";
import type { AttentionTag as Tag } from "@/types/guests";

/** Each tag's words. */
const TAG_KEY = {
  unknown: "unknownTag",
  duplicate: "duplicateTag",
} as const satisfies Record<Tag, string>;

/** Unknown or Duplicate: the guest list's rows and the latest replies. */
export function AttentionTag({
  tag,
  className = "",
}: {
  tag: Tag;
  className?: string;
}) {
  const t = useTranslations("GuestList");
  return (
    <span className={`${ATTENTION_TAG} ${className}`}>{t(TAG_KEY[tag])}</span>
  );
}
