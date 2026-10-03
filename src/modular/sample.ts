import type { InvitationBasics } from "@/types/modular";

/** No event yet: every modular template previews these. */
export const SAMPLE_BASICS: InvitationBasics = {
  hosts: ["Mara", "Luca"],
  date: "2027-09-18",
  venue: "Villa Lena",
  address: "Strada Comunale di Toiano\n56036 Palaia PI, Italy",
};

/** Stands in for every photo field until uploads exist. */
export const SAMPLE_PHOTO = "/modular/samples/tuscany.png";
