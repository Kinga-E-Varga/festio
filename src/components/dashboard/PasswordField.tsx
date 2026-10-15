"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { CopyButton } from "@/components/dashboard/CopyButton";
import {
  SHARE_LABEL,
  SHARE_LINE,
  SHARE_VALUE,
} from "@/components/dashboard/ShareFields";
import { Icon } from "@/components/icons";

export function PasswordField({ password }: { password: string }) {
  const t = useTranslations("Event");
  const [revealed, setRevealed] = useState(false);

  return (
    <p className={SHARE_LINE}>
      <span className={SHARE_LABEL}>{t("passwordLabel")}:</span>
      <span className={SHARE_VALUE}>
        <span className="min-w-0 truncate">
          {revealed ? password : "•".repeat(password.length)}
        </span>
        <button
          type="button"
          onClick={() => setRevealed((shown) => !shown)}
          aria-label={revealed ? t("hidePassword") : t("showPassword")}
          className="text-neutral-600 transition-colors hover:text-primary-800"
        >
          <Icon name={revealed ? "eyeOff" : "eye"} className="size-4" />
        </button>
        <CopyButton
          value={password}
          label={t("copyPassword")}
          tone="text-neutral-600 hover:text-primary-800"
          copiedLabel={t("passwordCopied")}
        />
      </span>
    </p>
  );
}
