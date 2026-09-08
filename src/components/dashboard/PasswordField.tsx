"use client";

import { useState } from "react";
import { CopyButton } from "@/components/dashboard/CopyButton";
import { Icon } from "@/components/icons";

export function PasswordField({ password }: { password: string }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex items-center gap-[9px] border border-mustard-300 bg-mustard-50 px-3 py-2 text-[13px] text-neutral-900">
      <Icon name="lock" className="size-3.5 shrink-0 text-neutral-700" />
      <span className="flex-1 truncate font-mono tracking-wider">
        {revealed ? password : "•".repeat(password.length)}
      </span>
      <button
        type="button"
        onClick={() => setRevealed((shown) => !shown)}
        aria-label={revealed ? "Hide guest password" : "Show guest password"}
        className="text-neutral-700 transition-colors hover:text-forest-500"
      >
        <Icon name={revealed ? "eyeOff" : "eye"} className="size-[15px]" />
      </button>
      <CopyButton value={password} label="Copy guest password" />
    </div>
  );
}
