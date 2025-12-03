import type { MediaItem } from "./types"

const STORAGE_KEY = "seen-media-list"

// Check if we should use localStorage fallback (for initial migration)
function shouldUseLocalStorage(): boolean {
  if (typeof window === "undefined") return false
  // Check if we have localStorage data but haven't synced yet
  const hasLocalData = localStorage.getItem(STORAGE_KEY) !== null
  const hasSynced = localStorage.getItem("synced-to-db") === "true"
  return hasLocalData && !hasSynced
}

export async function getMediaList(): Promise<MediaItem[]> {
  if (typeof window === "undefined") return []

  try {
    const response = await fetch("/api/media")
    if (!response.ok) throw new Error("Failed to fetch")
    return await response.json()
  } catch (error) {
    console.error("Failed to fetch from API, falling back to localStorage:", error)
    // Fallback to localStorage
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }
}

export async function addMediaItem(item: Omit<MediaItem, "id" | "addedAt">): Promise<MediaItem | null> {
  if (typeof window === "undefined") return null

  try {
    const response = await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error("Item already exists")
      }
      throw new Error("Failed to add item")
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to add item:", error)
    return null
  }
}

export async function removeMediaItem(id: string): Promise<boolean> {
  if (typeof window === "undefined") return false

  try {
    const response = await fetch(`/api/media?id=${id}`, {
      method: "DELETE",
    })

    if (!response.ok) throw new Error("Failed to delete")

    return true
  } catch (error) {
    console.error("Failed to delete item:", error)
    return false
  }
}

// Helper function to sync localStorage data to database (run once)
export async function syncLocalStorageToDatabase(): Promise<void> {
  if (typeof window === "undefined") return

  const localData = localStorage.getItem(STORAGE_KEY)
  if (!localData) return

  const hasSynced = localStorage.getItem("synced-to-db") === "true"
  if (hasSynced) return

  try {
    const items: MediaItem[] = JSON.parse(localData)

    for (const item of items) {
      await addMediaItem({
        imdbId: item.type === "movie" ? item.imdbId : undefined,
        tvdbId: item.type === "series" ? item.tvdbId : undefined,
        title: item.title,
        year: item.year,
        poster: item.poster,
        type: item.type,
      } as Omit<MediaItem, "id" | "addedAt">)
    }

    localStorage.setItem("synced-to-db", "true")
    console.log("Successfully synced localStorage to database")
  } catch (error) {
    console.error("Failed to sync localStorage to database:", error)
  }
}
