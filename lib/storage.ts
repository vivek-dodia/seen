import type { MediaItem } from "./types"

const STORAGE_KEY = "seen-media-list"

export function getMediaList(): MediaItem[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function saveMediaList(items: MediaItem[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function addMediaItem(item: MediaItem): void {
  const list = getMediaList()
  const exists = list.some(
    (i) =>
      (i.type === "movie" && item.type === "movie" && i.imdbId === item.imdbId) ||
      (i.type === "series" && item.type === "series" && i.tvdbId === item.tvdbId),
  )
  if (!exists) {
    list.push(item)
    saveMediaList(list)
  }
}

export function removeMediaItem(id: string): void {
  const list = getMediaList()
  const filtered = list.filter((item) => item.id !== id)
  saveMediaList(filtered)
}
