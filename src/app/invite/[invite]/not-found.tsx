import { MissingPage } from "@/components/MissingPage";

/**
 * The page's `notFound()`: an unknown link or a Hidden event. The browser
 * draws it as it recovers, so the HTML holds only its props.
 */
export default function InviteNotFound() {
  return <MissingPage kind="invite" />;
}
