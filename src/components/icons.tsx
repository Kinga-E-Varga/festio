import type { ReactNode } from "react";
import type { IconName } from "@/types/dashboard";

interface IconProps {
  name: IconName;
  className?: string;
}

const PATHS: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M3.25 10.5 12 3.5l8.75 7" />
      <path d="M5.5 9.75V20.5h13V9.75" />
    </>
  ),
  envelope: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.75 6.75 8.25 6 8.25-6" />
    </>
  ),
  guests: (
    <>
      <circle cx="9.5" cy="8.5" r="3.25" />
      <path d="M3.75 20a5.75 5.75 0 0 1 11.5 0" />
      <path d="M16.25 5.75a3.25 3.25 0 0 1 0 6.5" />
      <path d="M17.5 15.25A5.75 5.75 0 0 1 20.25 20" />
    </>
  ),
  seating: (
    <>
      <path d="M12 3.5l1.7 4.8 4.8 1.7-4.8 1.7L12 16.5l-1.7-4.8L5.5 10l4.8-1.7z" />
      <path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
    </>
  ),
  templates: (
    <>
      <rect x="3.25" y="4.25" width="17.5" height="15.5" rx="2" />
      <path d="M3.25 9.25h17.5" />
      <path d="M9.5 9.25v10.5" />
    </>
  ),
  printer: (
    <>
      <path d="M7.5 8V3.75h9V8" />
      <path d="M6 8h12a2 2 0 0 1 2 2v5.5H4V10a2 2 0 0 1 2-2z" />
      <rect x="7.5" y="13.75" width="9" height="6.5" rx="1" />
    </>
  ),
  billing: (
    <>
      <rect x="2.75" y="5.5" width="18.5" height="13" rx="2" />
      <path d="M2.75 10h18.5" />
      <path d="M6.25 14.25h3.5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.25 19 5.6v5.65c0 4.3-2.85 7.5-7 9.5-4.15-2-7-5.2-7-9.5V5.6z" />
      <path d="m9.25 11.75 2 2 3.5-3.75" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.25" />
      <path d="M12 3.25v2.5M12 18.25v2.5M4.75 12h2.5M16.75 12h2.5M6.9 6.9l1.75 1.75M15.35 15.35l1.75 1.75M17.1 6.9l-1.75 1.75M8.65 15.35 6.9 17.1" />
    </>
  ),
  cart: (
    <>
      <path d="M2.75 4h2.4l2.4 10.75h10.2l1.9-7.5H6.1" />
      <circle cx="9.25" cy="19" r="1.5" />
      <circle cx="17.5" cy="19" r="1.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M4.75 20.5a7.25 7.25 0 0 1 14.5 0" />
    </>
  ),
  bell: (
    <>
      <path d="M18 15.75V10.5a6 6 0 1 0-12 0v5.25L4.5 18.25h15z" />
      <path d="M9.75 18.25a2.25 2.25 0 0 0 4.5 0" />
    </>
  ),
  pencil: (
    <>
      <path d="m4.5 19.5.7-3.7L15.6 5.4a1.9 1.9 0 0 1 2.7 0l.3.3a1.9 1.9 0 0 1 0 2.7L8.2 18.8z" />
      <path d="m14.5 6.5 3 3" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
      <circle cx="12" cy="12" r="2.75" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M6.4 6.9C4 8.5 2.5 12 2.5 12s3.5 6 9.5 6c1.6 0 3-.4 4.2-1" />
      <path d="M9.6 5.3A9.6 9.6 0 0 1 12 5c6 0 9.5 6 9.5 6a17 17 0 0 1-2.9 3.5" />
      <path d="m4 4 16 16" />
    </>
  ),
  list: (
    <>
      <path d="M4 7.5h16M4 12h16M4 16.5h11" />
    </>
  ),
  link: (
    <>
      <path d="M10.25 13.75a3.5 3.5 0 0 0 4.95 0l2.4-2.4a3.5 3.5 0 0 0-4.95-4.95l-1 1" />
      <path d="M13.75 10.25a3.5 3.5 0 0 0-4.95 0l-2.4 2.4a3.5 3.5 0 0 0 4.95 4.95l1-1" />
    </>
  ),
  lock: (
    <>
      <rect x="4.75" y="10.5" width="14.5" height="9.5" rx="2" />
      <path d="M8.25 10.5V8a3.75 3.75 0 0 1 7.5 0v2.5" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M15.5 6.25V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h.25" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4.25 21 19.5H3z" />
      <path d="M12 9.5v4.25M12 16.5v.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M3.75 12h16.5" />
      <path d="M12 3.75c2.1 2.3 3.25 5.2 3.25 8.25S14.1 18 12 20.25c-2.1-2.25-3.25-5.15-3.25-8.25S9.9 6.05 12 3.75z" />
    </>
  ),
  arrowUpRight: (
    <>
      <path d="M7 17 17 7" />
      <path d="M9.25 7H17v7.75" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="M19.25 12H4.75" />
      <path d="M10.5 6.25 4.75 12l5.75 5.75" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4.75 12h14.5" />
      <path d="M13.5 6.25 19.25 12l-5.75 5.75" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.25" y="4.75" width="17.5" height="15.5" rx="2" />
      <path d="M3.25 9.5h17.5" />
      <path d="M8 2.75v4M16 2.75v4" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3.25 3.25 7.5 12 11.75 20.75 7.5z" />
      <path d="m3.25 12 8.75 4.25L20.75 12" />
      <path d="m3.25 16.5 8.75 4.25 8.75-4.25" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5.25v13.5M5.25 12h13.5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 11v5.5M12 7.75v.5" />
    </>
  ),
  ban: (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <path d="m6.25 6.25 11.5 11.5" />
    </>
  ),
  trash: (
    <>
      <path d="M4.25 7.25h15.5" />
      <path d="M9.5 7.25V4.75h5v2.5" />
      <path d="m6.75 7.25 1 12.5h8.5l1-12.5" />
    </>
  ),
  check: (
    <>
      <path d="m5.25 12.5 4.5 4.5 9-10" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.25" />
      <path d="m15.75 15.75 4 4" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12M18 6 6 18" />
    </>
  ),
};

export function Icon({ name, className = "size-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
