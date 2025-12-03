import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

async function checkDatabase() {
  console.log("🔍 Checking database for saved media items...\n")

  try {
    const sql = neon(process.env.DATABASE_URL)

    const items = await sql`SELECT * FROM media_items ORDER BY added_at DESC`

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
          console.log(`     IMDb: ${movie.imdb_id || "N/A"}`)
          console.log(`     Added: ${new Date(movie.added_at).toLocaleString()}`)
          console.log()
        })
      }

      if (shows.length > 0) {
        console.log(`📺 TV SHOWS (${shows.length}):`)
        shows.forEach((show, index) => {
          console.log(`  ${index + 1}. ${show.title} (${show.year})`)
          console.log(`     TVDB: ${show.tvdb_id || "N/A"}`)
          console.log(`     Added: ${new Date(show.added_at).toLocaleString()}`)
          console.log()
        })
      }

      console.log(`\n📊 Summary:`)
      console.log(`   Total: ${items.length}`)
      console.log(`   Movies: ${movies.length}`)
      console.log(`   TV Shows: ${shows.length}`)
    }

    console.log("\n✨ Database check complete!")
    console.log("\n💡 Tip: Open Drizzle Studio for a visual view:")
    console.log("   https://local.drizzle.studio")
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
