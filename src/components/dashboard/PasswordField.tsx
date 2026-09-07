"use client";

import { useState } from "react";
import { CopyButton } from "@/components/dashboard/CopyButton";
import { Icon } from "@/components/icons";

export function PasswordField({ password }: { password: string }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-linen-200 bg-cream-100 px-2.5 py-1.5">
      <Icon name="lock" className="size-3.5 shrink-0 text-stone-500" />
      <span className="font-mono text-xs tracking-wider">
        {revealed ? password : "•".repeat(password.length)}
      </span>
      <button
        type="button"
        onClick={() => setRevealed((shown) => !shown)}
        aria-label={revealed ? "Hide guest password" : "Show guest password"}
        className="grid size-6 place-items-center rounded transition-colors hover:bg-cream-200"
      >
        <Icon
          name={revealed ? "eyeOff" : "eye"}
          className="size-3.5 text-stone-500"
        />
      </button>
      <CopyButton value={password} label="Copy guest password" />
    </div>
  );
}
