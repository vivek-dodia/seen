import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { mediaItems } from "@/lib/db/schema"
import { eq, or, desc } from "drizzle-orm"

// GET all media items
export async function GET() {
  try {
    const items = await db.select().from(mediaItems).orderBy(desc(mediaItems.addedAt))
    return NextResponse.json(items)
  } catch (error) {
    console.error("Failed to fetch media items:", error)
    return NextResponse.json({ error: "Failed to fetch media items" }, { status: 500 })
  }
}

// POST new media item
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { imdbId, tvdbId, title, year, poster, type } = body

    // Check if item already exists
    const existing = await db
      .select()
      .from(mediaItems)
      .where(
        type === "movie" && imdbId
          ? eq(mediaItems.imdbId, imdbId)
          : type === "series" && tvdbId
            ? eq(mediaItems.tvdbId, tvdbId)
            : eq(mediaItems.title, title),
      )
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json({ error: "Item already exists" }, { status: 409 })
    }

    const newItem = await db
      .insert(mediaItems)
      .values({
        imdbId: imdbId || null,
        tvdbId: tvdbId || null,
        title,
        year,
        poster,
        type,
      })
      .returning()

    return NextResponse.json(newItem[0], { status: 201 })
  } catch (error) {
    console.error("Failed to add media item:", error)
    return NextResponse.json({ error: "Failed to add media item" }, { status: 500 })
  }
}

// DELETE media item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    await db.delete(mediaItems).where(eq(mediaItems.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete media item:", error)
    return NextResponse.json({ error: "Failed to delete media item" }, { status: 500 })
  }
}
