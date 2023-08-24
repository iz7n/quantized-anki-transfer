import { relations } from "drizzle-orm";
import {
  blob,
  integer,
  numeric,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const cards = sqliteTable("cards", {
  id: integer("id").primaryKey().$defaultFn(Date.now),
  noteId: integer("nid").notNull(),
  deckId: integer("did").notNull(),
  ordinal: integer("ord").notNull(),
  updatedAt: integer("mod", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updateSequenceNumber: integer("usn")
    .notNull()
    .$defaultFn(() => -1),
  type: integer("type")
    .notNull()
    .$defaultFn(() => 0),
  queue: integer("queue")
    .notNull()
    .$defaultFn(() => 0),
  due: integer("due")
    .notNull()
    .$defaultFn(() => Math.floor(Math.random() * 10_000)),
  interval: integer("ivl")
    .notNull()
    .$defaultFn(() => 1),
  factor: integer("factor")
    .notNull()
    .$defaultFn(() => 2500),
  reviews: integer("reps")
    .notNull()
    .$defaultFn(() => 0),
  lapses: integer("lapses")
    .notNull()
    .$defaultFn(() => 0),
  left: integer("left")
    .notNull()
    .$defaultFn(() => 0),
  originalDue: integer("odue")
    .notNull()
    .$defaultFn(() => 0),
  originalDid: integer("odid")
    .notNull()
    .$defaultFn(() => 0),
  flags: integer("flags")
    .notNull()
    .$defaultFn(() => 0),
  data: text("data")
    .notNull()
    .$defaultFn(() => "{}"),
});
export const cardsRelations = relations(cards, ({ one }) => ({
  note: one(notes, {
    fields: [cards.noteId],
    references: [notes.id],
  }),
  deck: one(decks, {
    fields: [cards.deckId],
    references: [decks.id],
  }),
}));

export const col = sqliteTable("col", {
  id: integer("id").primaryKey(),
  createdAt: integer("crt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("mod", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  schemaUpdatedTime: integer("scm", { mode: "timestamp" }).notNull(),
  version: integer("ver").notNull(),
  dirty: integer("dty")
    .notNull()
    .$defaultFn(() => 0),
  updateSequenceNumber: integer("usn")
    .notNull()
    .$defaultFn(() => -1),
  lastSyncTime: integer("ls").notNull(),
  conf: text("conf")
    .notNull()
    .$defaultFn(() => ""),
  models: text("models")
    .notNull()
    .$defaultFn(() => ""),
  decks: text("decks")
    .notNull()
    .$defaultFn(() => ""),
  dconf: text("dconf")
    .notNull()
    .$defaultFn(() => ""),
  tags: text("tags")
    .notNull()
    .$defaultFn(() => ""),
});

export const graves = sqliteTable("graves", {
  originalId: integer("oid").notNull(),
  type: integer("type").notNull(),
  usn: integer("usn")
    .notNull()
    .$defaultFn(() => -1),
});

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey().$defaultFn(Date.now),
  guid: text("guid").notNull(),
  noteTypeId: integer("mid").notNull(),
  updatedAt: integer("mod", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updateSequenceNumber: integer("usn")
    .notNull()
    .$defaultFn(() => -1),
  tags: text("tags")
    .notNull()
    .$defaultFn(() => ""),
  fields: text("flds")
    .notNull()
    .$defaultFn(() => ""),
  sortField: integer("sfld").notNull(),
  checkSum: integer("csum").notNull(),
  flags: integer("flags")
    .notNull()
    .$defaultFn(() => 0),
  data: text("data")
    .notNull()
    .$defaultFn(() => ""),
});
export const notesRelations = relations(notes, ({ one }) => ({
  noteType: one(noteTypes, {
    fields: [notes.noteTypeId],
    references: [noteTypes.id],
    relationName: "noteType",
  }),
  cards: one(cards, {
    fields: [notes.id],
    references: [cards.noteId],
    relationName: "cards",
  }),
}));

export const reviewLog = sqliteTable("revlog", {
  id: integer("id").primaryKey(),
  cardId: integer("cid").notNull(),
  updateSequenceNumber: integer("usn")
    .notNull()
    .$defaultFn(() => -1),
  ease: integer("ease").notNull(),
  interval: integer("ivl").notNull(),
  lastInterval: integer("lastIvl").notNull(),
  factor: integer("factor").notNull(),
  ms: integer("time").notNull(),
  type: integer("type").notNull(),
});
export const reviewLogRelations = relations(reviewLog, ({ one }) => ({
  card: one(cards, {
    fields: [reviewLog.cardId],
    references: [cards.id],
  }),
}));

export const deckConfig = sqliteTable("deck_config", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  updatedAt: integer("mtime_secs", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updateSequenceNumber: integer("usn")
    .notNull()
    .$defaultFn(() => -1),
  config: blob("config").notNull(),
});

export const config = sqliteTable("config", {
  key: text("KEY").primaryKey(),
  updateSequenceNumber: integer("usn")
    .notNull()
    .$defaultFn(() => -1),
  updatedAt: integer("mtime_secs", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  value: blob("val").notNull(),
});

export const fields = sqliteTable("fields", {
  noteTypeId: integer("ntid").notNull(),
  ord: integer("ord").notNull(),
  name: text("name").notNull(),
  config: blob("config").notNull(),
});
export const fieldsRelations = relations(fields, ({ one }) => ({
  noteType: one(noteTypes, {
    fields: [fields.noteTypeId],
    references: [noteTypes.id],
    relationName: "noteType",
  }),
  template: one(templates, {
    fields: [fields.noteTypeId],
    references: [templates.noteTypeId],
    relationName: "template",
  }),
}));

export const templates = sqliteTable("templates", {
  noteTypeId: integer("ntid").notNull(),
  ord: integer("ord").notNull(),
  name: text("name").notNull(),
  updatedAt: integer("mtime_secs", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updateSequenceNumber: integer("usn")
    .notNull()
    .$defaultFn(() => -1),
  config: blob("config").notNull(),
});
export const templatesRelations = relations(templates, ({ one }) => ({
  noteType: one(noteTypes, {
    fields: [templates.noteTypeId],
    references: [noteTypes.id],
    relationName: "noteType",
  }),
  fields: one(fields, {
    fields: [templates.noteTypeId],
    references: [fields.noteTypeId],
    relationName: "fields",
  }),
}));

export const noteTypes = sqliteTable("notetypes", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  updatedAt: integer("mtime_secs", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updateSequenceNumber: integer("usn")
    .notNull()
    .$defaultFn(() => -1),
  config: blob("config").notNull(),
});
export const noteTypesRelations = relations(noteTypes, ({ many }) => ({
  fields: many(fields, {
    relationName: "fields",
  }),
  templates: many(templates, {
    relationName: "templates",
  }),
}));

export const decks = sqliteTable("decks", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  updatedAt: integer("mtime_secs", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updateSequenceNumber: integer("usn")
    .notNull()
    .$defaultFn(() => -1),
  common: blob("common").notNull(),
  kind: blob("kind").notNull(),
});

export const tags = sqliteTable("tags", {
  tag: text("tag").primaryKey(),
  updateSequenceNumber: integer("usn")
    .notNull()
    .$defaultFn(() => -1),
  collapsed: numeric("collapsed").notNull(),
  config: blob("config"),
});

export const insertSymbols = sqliteTable("ins_symbols", {
  key: numeric("key"),
  value: numeric("value"),
});
