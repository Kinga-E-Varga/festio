import Script from "next/script";

/**
 * Dev-only: hover an element and press Ctrl+C to copy its component and
 * source location for a coding agent. Rendered in both root layouts;
 * `beforeInteractive` scripts must sit in a root layout.
 */
export function ReactGrab() {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <Script
      src="//unpkg.com/react-grab/dist/index.global.js"
      crossOrigin="anonymous"
      strategy="beforeInteractive"
    />
  );
}
