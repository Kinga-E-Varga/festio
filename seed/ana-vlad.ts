import type { Question } from "@/db/schemas/event";
import type { ListName } from "@/types/guests";
import { momentFromNow, type SeedReply } from "./build";

/*
 * The engagement's guests, written by hand (from the old `src/mock/guests.ts`)
 * so the guest list shows every case: shared answers, a skipped question, a
 * mistyped name (Gheorghe Popp), a name not on the list, the same name in
 * two replies (Elena, Maria), plain declines and one name still waiting.
 */

export const questions: Question[] = [
  {
    id: "q-main",
    label: "Fel principal",
    scope: "person",
    kind: "choice",
    options: [
      { id: "o-fish", label: "Pește" },
      { id: "o-beef", label: "Vită" },
      { id: "o-pasta", label: "Paste" },
    ],
    required: false,
    archived: false,
  },
  {
    id: "q-room",
    label: "Aveți nevoie de cazare?",
    scope: "reply",
    kind: "yesNo",
    required: false,
    archived: false,
  },
  {
    id: "q-song",
    label: "Ce melodie vreți să auziți?",
    scope: "reply",
    kind: "text",
    required: false,
    archived: false,
  },
];

export const guestList: ListName[] = [
  { id: "n-maria", name: "Maria Popescu", sent: true },
  { id: "n-andrei", name: "Andrei Popescu", sent: true },
  { id: "n-elena", name: "Elena Ionescu", sent: true },
  { id: "n-mihai", name: "Mihai Dumitru", sent: true },
  { id: "n-ioana", name: "Ioana Dumitru", sent: true },
  { id: "n-gheorghe", name: "Gheorghe Pop", sent: false },
  {
    id: "n-radu",
    name: "Radu Constantin Alexandru Stan-Vlădescu Popovici",
    sent: true,
  },
  { id: "n-irina", name: "Irina Stan", sent: true },
  { id: "n-sorin", name: "Sorin Marin", sent: true },
];

export const replies: SeedReply[] = [
  {
    id: "s1",
    sentAt: momentFromNow(-20),
    status: "going",
    message: "Abia așteptăm!",
    answers: { "q-room": false, "q-song": "Perfect – Ed Sheeran" },
    createdBy: "guest",
    people: [
      {
        id: "r-maria",
        name: "Maria Popescu",
        ageGroup: "adult",
        diet: ["vegetarian"],
        answers: { "q-main": "o-fish" },
      },
      {
        id: "r-andrei",
        name: "Andrei Popescu",
        ageGroup: "adult",
        diet: ["other"],
        dietOther: "Fără ceapă",
        answers: { "q-main": "o-beef" },
      },
    ],
  },
  {
    id: "s2",
    sentAt: momentFromNow(-18),
    status: "not_going",
    message: "Sunt plecată, vă pup!",
    createdBy: "guest",
    people: [{ id: "r-elena", name: "Elena Ionescu" }],
  },
  {
    id: "s3",
    sentAt: momentFromNow(-16),
    status: "going",
    message: null,
    answers: { "q-room": true, "q-song": null },
    createdBy: "guest",
    people: [
      {
        id: "r-mihai",
        name: "Mihai Dumitru",
        ageGroup: "adult",
        diet: [],
        answers: { "q-main": "o-beef" },
      },
      {
        id: "r-ioana",
        name: "Ioana Dumitru",
        ageGroup: "adult",
        diet: ["glutenFree", "lactoseFree"],
        answers: { "q-main": "o-fish" },
      },
      {
        id: "r-luca",
        name: "Luca Dumitru",
        ageGroup: "child",
        diet: ["nutAllergy"],
        answers: { "q-main": "o-pasta" },
      },
      {
        id: "r-sofia",
        name: "Sofia Dumitru",
        ageGroup: "baby",
        diet: [],
        answers: { "q-main": null },
      },
    ],
  },
  {
    id: "s4",
    sentAt: momentFromNow(-13),
    status: "going",
    message: null,
    answers: { "q-room": null, "q-song": null },
    createdBy: "guest",
    people: [
      {
        id: "r-gheorghe",
        name: "Gheorghe Popp",
        ageGroup: "adult",
        diet: null,
        answers: { "q-main": null },
      },
    ],
  },
  {
    id: "s5",
    sentAt: momentFromNow(-7),
    status: "going",
    message: "Venim amândouă!",
    answers: { "q-room": true, "q-song": "Dancing Queen – ABBA" },
    createdBy: "guest",
    people: [
      {
        id: "r-elena-2",
        name: "Elena Ionescu",
        ageGroup: "adult",
        diet: ["vegan"],
        answers: { "q-main": "o-fish" },
      },
    ],
  },
  {
    id: "s6",
    sentAt: momentFromNow(-4),
    status: "going",
    message: "Ne vedem acolo!",
    answers: { "q-room": false, "q-song": "Mamma Mia – ABBA" },
    createdBy: "guest",
    people: [
      {
        id: "r-maria-2",
        name: "Maria Popescu",
        ageGroup: "adult",
        diet: [],
        answers: { "q-main": "o-pasta" },
      },
      {
        id: "r-cristina",
        name: "Cristina Popescu",
        ageGroup: "child",
        diet: ["vegetarian"],
        answers: { "q-main": "o-pasta" },
      },
      {
        id: "r-radu",
        name: "Radu Constantin Alexandru Stan-Vlădescu Popovici",
        ageGroup: "adult",
        diet: ["other"],
        dietOther: "Alergie la fructe de mare",
        answers: { "q-main": "o-beef" },
      },
    ],
  },
  {
    id: "s7",
    sentAt: momentFromNow(-2),
    status: "not_going",
    message: "Din păcate avem nuntă în aceeași zi.",
    createdBy: "guest",
    people: [{ id: "r-sorin", name: "Sorin Marin" }],
  },
];
