import type { ReactNode } from "react";
import { inviteTheme } from "@/lib/invitation";
import type { InvitationTemplate } from "@/types/invitation";

/**
 * A guest page that stands in for the invitation (the password, a cancelled
 * event): one box on the invitation's own ground, in its palette and fonts.
 * Nothing of the invitation's text is drawn.
 */
export function InviteNotice({
  template,
  children,
}: {
  template: InvitationTemplate;
  children: ReactNode;
}) {
  const theme = inviteTheme(template);
  return (
    <main
      style={theme.style}
      className={`${theme.className} flex min-h-dvh items-center justify-center p-4`}
    >
      <div className="flex w-full max-w-[420px] flex-col gap-6 bg-[var(--c1)] px-6 py-10 shadow-sm invite:px-10">
        {children}
      </div>
    </main>
  );
}
