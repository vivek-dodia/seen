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
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth
      if (width < 480) setColumns(2)
      else if (width < 768) setColumns(3)
      else if (width < 1024) setColumns(4)
      else if (width < 1280) setColumns(5)
      else if (width < 1536) setColumns(6)
      else setColumns(7)
    }

    updateColumns()
    window.addEventListener("resize", updateColumns)
    return () => window.removeEventListener("resize", updateColumns)
  }, [])

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "50px" // Start loading items slightly before they enter viewport
      }
    )

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll(".masonry-item")
      elements.forEach((el) => observer.observe(el))
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [items])

  // Distribute items into columns
  const columnItems: MediaItem[][] = Array.from({ length: columns }, () => [])
  items.forEach((item, index) => {
    columnItems[index % columns].push(item)
  })

  return (
    <div ref={containerRef} className="flex gap-4" style={{ alignItems: "flex-start" }}>
      {columnItems.map((column, colIndex) => (
        <div key={colIndex} className="flex-1 flex flex-col gap-4">
          {column.map((item, itemIndex) => {
            const isVisible = visibleItems.has(item.id)

            return (
              <div
                id={item.id}
                key={item.id}
                className={`masonry-item relative group overflow-hidden transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                } hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1`}
                style={{ transitionDelay: `${itemIndex * 50}ms` }}
              >
                {item.poster && item.poster !== "N/A" ? (
                  <Image
                    src={item.poster || "/placeholder.svg"}
                    alt={item.title}
                    width={300}
                    height={450}
                    className="w-full h-auto transition-all duration-700 ease-out"
                    sizes="(max-width: 480px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-mono text-xs text-center px-3 opacity-60">{item.title}</span>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end p-4 pb-6">
                  <span className="font-serif text-base italic text-center leading-tight line-clamp-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {item.title}
                  </span>
                  <span className="font-mono text-xs opacity-80 mt-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {item.year}
                  </span>
                  <span className="font-mono text-[10px] uppercase opacity-60 mt-1 tracking-wider transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                    {item.type}
                  </span>
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
    document.title = "Seen"
  }, [])

  useEffect(() => {
    const loadMedia = async () => {
      const list = await getMediaList()
      setMediaList(list)
      setIsLoading(false)
    }
    loadMedia()
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-base italic hover:opacity-70 transition-all duration-300 hover:translate-x-[-4px]">
            ← Back
          </Link>
          <h1 className="font-serif text-2xl italic">Seen</h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="fixed top-[57px] left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/5 animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 text-base font-serif italic tracking-wide transition-all duration-300 border ${
              filter === "all"
                ? "bg-white text-black border-white"
                : "bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white hover:scale-105"
            }`}
          >
            All ({mediaList.length})
          </button>
          <button
            onClick={() => setFilter("movie")}
            className={`px-6 py-2 text-base font-serif italic tracking-wide transition-all duration-300 border ${
              filter === "movie"
                ? "bg-white text-black border-white"
                : "bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white hover:scale-105"
            }`}
          >
            Movies ({movieCount})
          </button>
          <button
            onClick={() => setFilter("series")}
            className={`px-6 py-2 text-base font-serif italic tracking-wide transition-all duration-300 border ${
              filter === "series"
                ? "bg-white text-black border-white"
                : "bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white hover:scale-105"
            }`}
          >
            Shows ({showCount})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pt-36 pb-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 animate-in fade-in duration-500">
              <p className="font-mono text-sm opacity-60 animate-pulse">Loading...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4 animate-in fade-in zoom-in-95 duration-500">
              <p className="font-serif text-base italic opacity-60">
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

      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-t border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-center">
          <span className="font-serif text-sm italic opacity-40">
            {filteredList.length} {filter === "all" ? "Total" : filter === "movie" ? "Movies" : "Shows"}
          </span>
        </div>
      </footer>
    </main>
  )
}
