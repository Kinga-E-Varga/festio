import type { StoredQuestion } from "@/db/schemas/event";
import type { ListName } from "@/types/guests";
import { momentFromNow, type SeedReply } from "./build";

/*
 * The engagement's guests, written by hand (from the old `src/mock/guests.ts`)
 * so the guest list shows every case: shared answers, a skipped question, a
 * mistyped name (Gheorghe Popp), a name not on the list, the same name in
 * two replies (Elena, Maria), plain declines and one name still waiting.
 */

export const questions: StoredQuestion[] = [
  {
    id: "age",
    suggested: true,
    required: true,
    archived: false,
    answered: true,
  },
  {
    id: "diet",
    suggested: true,
    required: true,
    archived: false,
    answered: true,
  },
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
    answered: true,
  },
  {
    id: "q-room",
    label: "Aveți nevoie de cazare?",
    scope: "reply",
    kind: "yesNo",
    required: false,
    archived: false,
    answered: true,
  },
  {
    id: "q-song",
    label: "Ce melodie vreți să auziți?",
    scope: "reply",
    kind: "text",
    required: false,
    archived: false,
    answered: true,
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
        answers: {
          age: "adult",
          diet: { needs: ["vegetarian"] },
          "q-main": "o-fish",
        },
      },
      {
        id: "r-andrei",
        name: "Andrei Popescu",
        answers: {
          age: "adult",
          diet: { needs: ["other"], other: "Fără ceapă" },
          "q-main": "o-beef",
        },
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
        answers: { age: "adult", diet: { needs: [] }, "q-main": "o-beef" },
      },
      {
        id: "r-ioana",
        name: "Ioana Dumitru",
        answers: {
          age: "adult",
          diet: { needs: ["glutenFree", "lactoseFree"] },
          "q-main": "o-fish",
        },
      },
      {
        id: "r-luca",
        name: "Luca Dumitru",
        answers: {
          age: "child",
          diet: { needs: ["nutAllergy"] },
          "q-main": "o-pasta",
        },
      },
      {
        id: "r-sofia",
        name: "Sofia Dumitru",
        answers: { age: "baby", diet: { needs: [] }, "q-main": null },
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
        answers: { age: "adult", diet: null, "q-main": null },
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
        answers: {
          age: "adult",
          diet: { needs: ["vegan"] },
          "q-main": "o-fish",
        },
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
        answers: { age: "adult", diet: { needs: [] }, "q-main": "o-pasta" },
      },
      {
        id: "r-cristina",
        name: "Cristina Popescu",
        answers: {
          age: "child",
          diet: { needs: ["vegetarian"] },
          "q-main": "o-pasta",
        },
      },
      {
        id: "r-radu",
        name: "Radu Constantin Alexandru Stan-Vlădescu Popovici",
        answers: {
          age: "adult",
          diet: { needs: ["other"], other: "Alergie la fructe de mare" },
          "q-main": "o-beef",
        },
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
