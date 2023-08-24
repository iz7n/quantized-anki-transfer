import {
  caseInsensitive,
  char,
  createRegExp,
  digit,
  oneOrMore,
} from "magic-regexp";
import { readFile } from "node:fs/promises";
import { $ } from "zx";

import db, { eq } from "./drizzle";
import { cards } from "./drizzle/schema";
import words from "./words.json";

const cardsPath = new URL("../downloads/data.json", import.meta.url);
const cardsJson = await readFile(cardsPath, "utf-8");
const data = JSON.parse(cardsJson) as {
  status: "Learning" | "Memorized";
  interval: number; // seconds
  due: string;
  index: number;
  timesSeen: number;
}[];

const decks = await db.query.decks.findMany({
  columns: {
    id: true,
    name: true,
  },
});
console.log("Which deck do you want to transfer to?");
const deckName = (
  await $`gum choose ${decks.map(deck => deck.name)}`
).toString();
const deck = decks.find(deck => deck.name === deckName);
if (!deck) {
  console.error("No deck found");
  process.exit(1);
}

const allCards = await db.query.cards.findMany({
  where: eq(cards.deckId, deck.id),
});
const cardIds = new Set(allCards.map(card => card.noteId));

let resultNotes = await db.query.notes.findMany();
resultNotes = resultNotes.filter(note => cardIds.has(note.id));

const SECONDS_IN_DAY = 60 * 60 * 24;

const collection = await db.query.col.findFirst({
  columns: {
    createdAt: true,
  },
});
if (!collection) {
  console.error("No collection found");
  process.exit(1);
}

for (const [index, card] of data.entries()) {
  const word = words[card.index];
  if (!word) {
    console.log(`No word found for card: ${card}`);
    continue;
  }

  const regex = createRegExp(
    oneOrMore(digit),
    "\x1F",
    word,
    "\x1F",
    oneOrMore(char).at.lineEnd(),
    [caseInsensitive]
  );
  const note = resultNotes.find(note => regex.test(note.fields));
  if (!note) {
    console.log(`No note found for card ${index}: ${word}`);
    continue;
  }

  const due = new Date(card.due);
  const diff = Math.floor(
    (due.getTime() - collection.createdAt.getTime()) / 1000 / SECONDS_IN_DAY
  );
  const type =
    card.status === "Learning" ? 1 : card.status === "Memorized" ? 2 : 0;
  await db
    .update(cards)
    .set({
      type,
      queue: type,
      due: diff,
      interval: card.interval / SECONDS_IN_DAY,
      reviews: card.timesSeen,
    })
    .where(eq(cards.noteId, note.id))
    .run();
}
console.log("Done");
