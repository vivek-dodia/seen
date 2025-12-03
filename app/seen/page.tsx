"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { getMediaList } from "@/lib/storage"
import type { MediaItem } from "@/lib/types"

type FilterType = "all" | "movie" | "series"

function MasonryGrid({ items }: { items: MediaItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState(3)

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth
      if (width < 480) setColumns(2)
      else if (width < 768) setColumns(2)
      else if (width < 1024) setColumns(3)
      else if (width < 1280) setColumns(4)
      else setColumns(4)
    }

    updateColumns()
    window.addEventListener("resize", updateColumns)
    return () => window.removeEventListener("resize", updateColumns)
  }, [])

  // Distribute items into columns
  const columnItems: MediaItem[][] = Array.from({ length: columns }, () => [])
  items.forEach((item, index) => {
    columnItems[index % columns].push(item)
  })

  return (
    <div ref={containerRef} className="flex gap-2" style={{ alignItems: "flex-start" }}>
      {columnItems.map((column, colIndex) => (
        <div key={colIndex} className="flex-1 flex flex-col gap-2">
          {column.map((item, itemIndex) => {
            // Vary aspect ratios for visual interest - movie posters are typically taller
            const aspectRatios = ["aspect-[2/3]", "aspect-[3/4]", "aspect-square", "aspect-[4/5]"]
            const aspectClass =
              item.type === "movie"
                ? aspectRatios[itemIndex % 2] // Movies: 2:3 or 3:4 (taller)
                : aspectRatios[(itemIndex % 2) + 2] // Shows: square or 4:5

            return (
              <div key={item.id} className={`relative group overflow-hidden bg-white/5 ${aspectClass}`}>
                {item.poster && item.poster !== "N/A" ? (
                  <Image
                    src={item.poster || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                    sizes="(max-width: 480px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-mono text-xs text-center px-3 opacity-60">{item.title}</span>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3">
                  <span className="font-mono text-sm text-center leading-tight line-clamp-2">{item.title}</span>
                  <span className="font-mono text-xs opacity-60 mt-1">{item.year}</span>
                  <span className="font-mono text-[10px] uppercase opacity-40 mt-1 tracking-wider">{item.type}</span>
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default function SeenPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>("all")

  useEffect(() => {
    const list = getMediaList()
    setMediaList(list)
    setIsLoading(false)
  }, [])

  const filteredList = mediaList.filter((item) => {
    if (filter === "all") return true
    return item.type === filter
  })

  const movieCount = mediaList.filter((i) => i.type === "movie").length
  const showCount = mediaList.filter((i) => i.type === "series").length

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-mono uppercase text-xs tracking-widest hover:opacity-70 transition-opacity">
            Back
          </Link>
          <h1 className="font-serif text-lg italic">Seen</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="fixed top-[57px] left-0 right-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-center gap-1">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 text-xs uppercase tracking-widest transition-all duration-300 border ${
              filter === "all"
                ? "bg-white text-black border-white"
                : "bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white"
            }`}
          >
            All ({mediaList.length})
          </button>
          <button
            onClick={() => setFilter("movie")}
            className={`px-4 py-1.5 text-xs uppercase tracking-widest transition-all duration-300 border ${
              filter === "movie"
                ? "bg-white text-black border-white"
                : "bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white"
            }`}
          >
            Movies ({movieCount})
          </button>
          <button
            onClick={() => setFilter("series")}
            className={`px-4 py-1.5 text-xs uppercase tracking-widest transition-all duration-300 border ${
              filter === "series"
                ? "bg-white text-black border-white"
                : "bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white"
            }`}
          >
            Shows ({showCount})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pt-28 pb-16 px-2 sm:px-4">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="font-mono text-sm opacity-60">Loading...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <p className="font-mono text-sm opacity-60">
                {mediaList.length === 0
                  ? "No movies or shows added yet"
                  : `No ${filter === "movie" ? "movies" : "shows"} in your list`}
              </p>
            </div>
          ) : (
            <MasonryGrid items={filteredList} />
          )}
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-center">
          <span className="font-mono text-[10px] uppercase tracking-widest opacity-40">
            {filteredList.length} {filter === "all" ? "Total" : filter === "movie" ? "Movies" : "Shows"}
          </span>
        </div>
      </footer>
    </main>
  )
}
