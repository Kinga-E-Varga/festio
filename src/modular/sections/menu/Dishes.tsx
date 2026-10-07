import { ITEM_TITLE } from "@/modular/styles";

/**
 * A course's dishes, one per line with room between them, empty lines left
 * out; shared by Printed card and Framed card.
 */
export function Dishes({ title }: { title: string }) {
  return (
    <h3 className={`${ITEM_TITLE} flex flex-col gap-2`}>
      {title
        .split("\n")
        .filter((dish) => dish.trim())
        .map((dish, index) => (
          <span key={index}>{dish}</span>
        ))}
    </h3>
  );
}
