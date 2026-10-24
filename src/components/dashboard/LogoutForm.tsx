"use client";

import type { ReactNode } from "react";
import { signOut } from "@/actions/auth";
import { forgetSavedLists } from "@/lib/saved-lists";

/**
 * Log out's form: ends the session and leaves for the landing page. The
 * landing page comes without a page load, so the guest lists the tab kept are
 * forgotten first.
 */
export function LogoutForm({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <form action={signOut} onSubmit={forgetSavedLists} className={className}>
      {children}
    </form>
  );
}
