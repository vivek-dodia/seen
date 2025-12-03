import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

function getConnectionString() {
  // Support multiple environment variable names for database connection
  // Try STORAGE_ prefix first (Vercel custom prefix)
  // Then try standard names
  return (
    process.env.STORAGE_DATABASE_URL ||
    process.env.STORAGE_POSTGRES_URL ||
    process.env.STORAGE_POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.STORAGE_URL
  )
}

function createDb() {
  const connectionString = getConnectionString()

  if (!connectionString) {
    throw new Error(
      "Database connection string not found. Please set one of: STORAGE_DATABASE_URL, DATABASE_URL, POSTGRES_URL, or STORAGE_URL in your environment variables."
    )
  }

  const sql = neon(connectionString)
  return drizzle(sql, { schema })
}

// Export a getter function instead of the db directly
// This ensures the connection is only created when actually used (at runtime)
let dbInstance: ReturnType<typeof createDb> | null = null

export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(target, prop) {
    if (!dbInstance) {
      dbInstance = createDb()
    }
    return (dbInstance as any)[prop]
  },
})
