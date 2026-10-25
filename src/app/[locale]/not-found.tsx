import { MissingPage } from "@/components/MissingPage";

/**
 * A host page's `notFound()`: an event that isn't the host's, a template or
 * print that doesn't exist. In the host's language; the browser draws it as
 * it recovers, so the HTML holds only its props.
 */
export default function HostNotFound() {
  return <MissingPage kind="page" />;
}
