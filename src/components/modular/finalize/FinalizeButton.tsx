import dynamic from "next/dynamic";
import type { FinalizeProps } from "@/components/modular/finalize/Finalize";

/*
 * Imported only behind the dev check: a production build drops the import,
 * so the Finalize dialog never reaches the pages.
 */
const Finalize =
  process.env.NODE_ENV === "development"
    ? dynamic(() =>
        import("@/components/modular/finalize/Finalize").then(
          (m) => m.Finalize,
        ),
      )
    : null;

/** Dev only: the template preview's Finalize corner button; nothing in production. */
export function FinalizeButton(props: FinalizeProps) {
  return Finalize ? <Finalize {...props} /> : null;
}
