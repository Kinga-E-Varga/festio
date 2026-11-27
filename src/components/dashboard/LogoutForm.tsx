"use client";

import { signOut as signOutBrowser } from "firebase/auth";
import type { ReactNode } from "react";
import { signOut } from "@/actions/auth";
import { clientAuth } from "@/lib/firebase-client";
import { forgetHostUid } from "@/lib/firebase-live";
import { forgetSavedLists } from "@/lib/saved-lists";

/**
 * Log out's form: ends the session and leaves for the landing page. The
 * landing page comes without a page load, so the guest lists the tab kept are
 * forgotten first, and the browser's own Firebase sign-in ends too.
 */
export function LogoutForm({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  function onSubmit() {
    forgetSavedLists();
    forgetHostUid();
    void signOutBrowser(clientAuth());
  }

  return (
    <form action={signOut} onSubmit={onSubmit} className={className}>
      {children}
    </form>
  );
}
