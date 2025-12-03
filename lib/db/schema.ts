import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const mediaItems = pgTable("media_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  imdbId: text("imdb_id"),
  tvdbId: text("tvdb_id"),
  title: text("title").notNull(),
  year: text("year").notNull(),
  poster: text("poster").notNull(),
  type: text("type").notNull(), // "movie" or "series"
  addedAt: timestamp("added_at").defaultNow().notNull(),
})
