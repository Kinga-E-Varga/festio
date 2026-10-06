import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { DressCodeSwatches, hasSwatches } from "@/modular/cards/DressCodeCard";
import { GiftAccount, hasAccount } from "@/modular/cards/GiftsCard";
import { list, text } from "@/modular/content";
import { noteItems } from "@/modular/notes";
import { IconHeading } from "@/modular/IconHeading";
import {
  BODY_SM,
  GROUND,
  INNER_EYEBROW,
  ITEM_TITLE,
  MUTED,
  PAD,
  SPLIT,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

/**
 * A compass on its soft disc over the heading — no eyebrow — beside the
 * notes as rows between hairlines, like the Simple schedule: each its
 * label, title and text, with no icon, and for Dress code and
 * Gifts their colours or account under them. No cards.
 */
export function Variant({ values, related, ground }: VariantProps) {
  const t = useTranslations("Sections");
  const items = noteItems(list(values, "items"), values);
  const dress = related["dress-code"] ?? {};
  const gifts = related.gifts ?? {};

  return (
    <div className={`${SPLIT} items-start ${GROUND[ground]} ${PAD}`}>
      <IconHeading icon="compass" values={values} />
      {items.length > 0 ? (
        <ul className="border-t-1 border-[var(--m-line)]">
          {items.map((item, index) => {
            if (item.kind === "dress-code") {
              return (
                <Row
                  key={index}
                  label={t("dressCode")}
                  title={text(dress, "title")}
                  body={text(dress, "body")}
                >
                  {hasSwatches(dress) ? (
                    <DressCodeSwatches values={dress} />
                  ) : null}
                </Row>
              );
            }
            if (item.kind === "gifts") {
              return (
                <Row
                  key={index}
                  label={t("gifts")}
                  title={text(gifts, "title")}
                  body={text(gifts, "body")}
                >
                  {hasAccount(gifts) ? <GiftAccount values={gifts} /> : null}
                </Row>
              );
            }
            return (
              <Row
                key={index}
                label={item.label}
                title={item.title ?? ""}
                body={item.text ?? ""}
              />
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

/** One note: its label, title, text and anything under them. */
function Row({
  label,
  title,
  body,
  children,
}: {
  label?: string;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <li className="border-b-1 border-[var(--m-line)] py-6">
      <div className="flex min-w-0 flex-col items-start gap-1.5">
        {label ? (
          <p
            className={`${INNER_EYEBROW} mb-1 text-[color:var(--m-secondary)]`}
          >
            {label}
          </p>
        ) : null}
        {title ? <h3 className={ITEM_TITLE}>{title}</h3> : null}
        {body ? (
          <p className={`${BODY_SM} ${MUTED} whitespace-pre-line`}>{body}</p>
        ) : null}
        {children ? (
          <div className="mt-3 flex flex-col items-start gap-3">{children}</div>
        ) : null}
      </div>
    </li>
  );
}
