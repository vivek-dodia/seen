import { db } from "../lib/db"
import { mediaItems } from "../lib/db/schema"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

async function checkDatabase() {
  console.log("🔍 Checking database for saved media items...\n")

  try {
    const items = await db.select().from(mediaItems)

    if (items.length === 0) {
      console.log("📭 Database is empty. No movies or shows have been added yet.")
      console.log("\nTo add items:")
      console.log("1. Go to http://localhost:3001/admin")
      console.log("2. Login with password: seen2024")
      console.log("3. Search and add movies or shows")
    } else {
      console.log(`✅ Found ${items.length} items in the database:\n`)

      const movies = items.filter((item) => item.type === "movie")
      const shows = items.filter((item) => item.type === "series")

      if (movies.length > 0) {
        console.log(`🎬 MOVIES (${movies.length}):`)
        movies.forEach((movie, index) => {
          console.log(`  ${index + 1}. ${movie.title} (${movie.year})`)
          console.log(`     IMDb: ${movie.imdbId || "N/A"}`)
          console.log(`     Added: ${new Date(movie.addedAt).toLocaleString()}`)
          console.log()
        })
      }

      if (shows.length > 0) {
        console.log(`📺 TV SHOWS (${shows.length}):`)
        shows.forEach((show, index) => {
          console.log(`  ${index + 1}. ${show.title} (${show.year})`)
          console.log(`     TVDB: ${show.tvdbId || "N/A"}`)
          console.log(`     Added: ${new Date(show.addedAt).toLocaleString()}`)
          console.log()
        })
      }
    }

    console.log("\n✨ Database check complete!")
  } catch (error) {
    console.error("❌ Error checking database:", error)
    console.error("\nMake sure:")
    console.error("1. DATABASE_URL is set in .env.local")
    console.error("2. Database schema has been pushed (pnpm db:push)")
    console.error("3. Database is accessible")
  }

  process.exit(0)
}

checkDatabase()
