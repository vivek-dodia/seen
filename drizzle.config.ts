import type { Config } from "drizzle-kit"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.STORAGE_DATABASE_URL ||
      process.env.STORAGE_POSTGRES_URL ||
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.STORAGE_URL!,
  },
} satisfies Config
