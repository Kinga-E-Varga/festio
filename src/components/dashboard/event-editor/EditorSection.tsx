/**
 * A group's title inside the editor's side panel: small sans capitals, a
 * step under the panel's serif title. The Design and Content tabs' groups.
 */
export function EditorHeading({
  title,
  id,
  className = "",
}: {
  title: string;
  /** For a group that names itself by it (`aria-labelledby`). */
  id?: string;
  className?: string;
}) {
  return (
    <h2 id={id} className={`mb-2.5 eyebrow text-neutral-700 ${className}`}>
      {title}
    </h2>
  );
}
