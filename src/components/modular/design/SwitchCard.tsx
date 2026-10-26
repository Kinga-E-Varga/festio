import { Switch } from "@/components/invitation/PanelSwitch";
import { SectionBar } from "./SectionBar";
import { SECTION_CARD as CARD } from "./styles";

/**
 * An on/off setting on a card like a Design section's: its switch in the
 * mark slot, then its name. The print panel's background.
 */
export function SwitchCard({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (on: boolean) => void;
}) {
  return (
    <div className={CARD}>
      <SectionBar
        mark={
          <Switch
            size="panel"
            tone="light"
            id={id}
            label={label}
            checked={checked}
            onChange={onChange}
          />
        }
        name={label}
      />
    </div>
  );
}
