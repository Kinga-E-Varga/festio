"use client";

import { useState } from "react";
import { CopyButton } from "@/components/dashboard/CopyButton";
import { VISIBILITY } from "@/components/dashboard/EventMeta";
import { Banner } from "@/components/dashboard/event-editor/Banner";
import { ChangeWarning } from "@/components/dashboard/event-editor/ChangeWarning";
import { EditorSection } from "@/components/dashboard/event-editor/EditorSection";
import { Field } from "@/components/dashboard/event-editor/Field";
import {
  ERROR,
  FIELD_GRID,
  LABEL,
  MINI,
} from "@/components/dashboard/event-editor/styles";
import type { EventForm } from "@/components/dashboard/event-editor/useEventForm";
import { Icon } from "@/components/icons";
import type { DashboardEvent, Visibility } from "@/types/dashboard";

const ORDER: Visibility[] = ["hidden", "public", "protected"];

function PasswordBox({ form }: { form: EventForm }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="px-3.5 pb-3.5">
      {/* One field with its two actions sitting inside it, as the link box has. */}
      <div className="flex min-h-[38px] items-center gap-1.5 border border-mustard-400 bg-neutral-50 pr-[9px]">
        <input
          type={revealed ? "text" : "password"}
          maxLength={24}
          placeholder="Password"
          aria-label="Invitation password"
          disabled={form.locked}
          value={form.values.password}
          onChange={(control) => form.set.password(control.target.value)}
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-[9px] text-[13.5px] text-neutral-900 focus:outline-2 focus:-outline-offset-2 focus:outline-mustard-600 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={() => setRevealed((shown) => !shown)}
          aria-label={revealed ? "Hide password" : "Show password"}
          className={MINI}
        >
          <Icon name={revealed ? "eyeOff" : "eye"} className="size-[15px]" />
        </button>
        <CopyButton
          value={form.values.password}
          label="Copy invitation password"
        />
      </div>
      {form.derived.passwordError ? (
        <p className={`mt-[7px] ${ERROR}`}>{form.derived.passwordError}</p>
      ) : null}
    </div>
  );
}

interface SectionProps {
  event: DashboardEvent;
  form: EventForm;
}

export function LinkSection({ event, form }: SectionProps) {
  const { values, set, derived, locked } = form;

  return (
    <EditorSection title="Link and who can open it">
      {/* The address and the finished link sit side by side while there is room. */}
      <div className={FIELD_GRID}>
        <Field
          htmlFor="event-slug"
          label="Invitation address"
          error={derived.slugError}
          hint="The four digits are Festio's — they keep the link unguessable. If you have already shared the link, changing it will break every copy your guests are holding."
        >
          <div className="flex items-stretch border border-mustard-300 bg-mustard-50">
            <span className="grid place-items-center bg-mustard-200 px-3 text-[13.5px] whitespace-nowrap text-neutral-800">
              festio.eu/
            </span>
            <input
              id="event-slug"
              type="text"
              maxLength={32}
              disabled={locked}
              value={values.slug}
              onChange={(control) => set.slug(control.target.value)}
              className="min-w-0 flex-1 border-0 bg-transparent px-3 py-[9px] text-[13.5px] text-neutral-900 focus:outline-2 focus:-outline-offset-2 focus:outline-forest-500 disabled:cursor-not-allowed"
            />
            <span className="grid place-items-center bg-mustard-200 px-3 text-[13.5px] whitespace-nowrap text-neutral-800">
              -{event.digits}
            </span>
          </div>
        </Field>

        <Field label="The link your guests open">
          <span className="flex min-h-[38px] items-center gap-[9px] border border-mustard-300 bg-neutral-50 px-3 py-[9px] text-[13.5px] text-neutral-900">
            <Icon name="link" className="size-3.5 shrink-0 text-forest-500" />
            <span className="flex-1 truncate">{derived.link}</span>
            <CopyButton
              value={`https://${derived.link}`}
              label="Copy invitation link"
            />
          </span>
        </Field>
      </div>

      <ChangeWarning
        title="Changing the address"
        warning={form.warnings.address}
      >
        The old link stops working the moment you save. Every copy your{" "}
        <b>
          {event.rsvp.replied}{" "}
          {event.rsvp.replied === 1 ? "guest is" : "guests are"} holding
        </b>{" "}
        leads nowhere, and passing on the new one is yours to do.
      </ChangeWarning>

      <p className={`mt-[22px] mb-2.5 ${LABEL}`}>Visibility</p>

      <fieldset className="grid grid-cols-1 gap-3 @min-[940px]:grid-cols-3">
        <legend className="sr-only">Who can open the invitation</legend>
        {ORDER.map((id) => {
          const option = VISIBILITY[id];
          const selected = values.visibility === id;
          return (
            <div
              key={id}
              className={`flex min-w-0 flex-col border transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-mustard-600 ${
                selected
                  ? "border-mustard-500 bg-mustard-200"
                  : "border-mustard-300 bg-neutral-50 hover:bg-mustard-100"
              }`}
            >
              <label className="flex cursor-pointer flex-col gap-1.5 p-3.5">
                <span className="flex items-center gap-2 font-semibold text-neutral-900">
                  <span
                    aria-hidden="true"
                    className={`grid size-[13px] shrink-0 place-items-center rounded-full border-[1.5px] ${
                      selected ? "border-mustard-500" : "border-neutral-500"
                    }`}
                  >
                    {selected ? (
                      <span className="size-1.5 rounded-full bg-mustard-500" />
                    ) : null}
                  </span>
                  {option.label}
                </span>
                <input
                  type="radio"
                  name="visibility"
                  value={id}
                  checked={selected}
                  disabled={locked}
                  onChange={() => set.visibility(id)}
                  className="sr-only"
                />
                <span className="text-xs leading-[1.45] text-neutral-700">
                  {option.blurb}
                </span>
              </label>

              {/* The password belongs to the card it unlocks. */}
              {id === "protected" && selected ? (
                <PasswordBox form={form} />
              ) : null}
            </div>
          );
        })}
      </fieldset>

      <ChangeWarning
        title="Changing the password"
        warning={form.warnings.password}
      >
        The old password stops working the moment you save. Guests will not be
        able to see the invitation until you give them the new one.
      </ChangeWarning>

      <Banner tone="info" icon="shield" title="Search engines never see this page">
        Every invitation is served with a noindex header, whichever visibility
        you pick.
      </Banner>
    </EditorSection>
  );
}
