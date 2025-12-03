import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// Support both DATABASE_URL (Vercel default) and STORAGE_URL (custom prefix)
const connectionString = process.env.DATABASE_URL || process.env.STORAGE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL or STORAGE_URL environment variable is not set")
}

const sql = neon(connectionString)
export const db = drizzle(sql, { schema })
