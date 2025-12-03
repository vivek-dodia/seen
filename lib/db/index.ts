import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// Support multiple environment variable names for database connection
// Vercel uses POSTGRES_URL, we prefer DATABASE_URL, also support STORAGE_URL
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.STORAGE_URL

if (!connectionString) {
  throw new Error(
    "Database connection string not found. Please set one of: DATABASE_URL, POSTGRES_URL, or STORAGE_URL"
  )
}

const sql = neon(connectionString)
export const db = drizzle(sql, { schema })
