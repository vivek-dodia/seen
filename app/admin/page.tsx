"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getMediaList, addMediaItem, removeMediaItem } from "@/lib/storage"
import type { MediaItem, OMDBSearchResponse, OMDBResponse, TVDBSearchResponse } from "@/lib/types"

const ADMIN_PASSWORD = "seen2024"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [activeTab, setActiveTab] = useState<"movies" | "shows">("movies")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const auth = sessionStorage.getItem("admin-auth")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      setMediaList(getMediaList())
    }
  }, [isAuthenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem("admin-auth", "true")
      setPasswordError("")
    } else {
      setPasswordError("Incorrect password")
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchResults([])

    try {
      if (activeTab === "movies") {
        const response = await fetch(`/api/search-movie?q=${encodeURIComponent(searchQuery)}`)
        const data: OMDBSearchResponse = await response.json()

        if (data.Response === "True" && data.Search) {
          setSearchResults(
            data.Search.map((item: OMDBResponse) => ({
              id: item.imdbID,
              title: item.Title,
              year: item.Year,
              poster: item.Poster,
              type: "movie",
            })),
          )
        }
      } else {
        const response = await fetch(`/api/search-show?q=${encodeURIComponent(searchQuery)}`)
        const data: TVDBSearchResponse = await response.json()

        if (data.status === "success" && data.data) {
          setSearchResults(
            data.data.slice(0, 10).map((item) => ({
              id: item.objectID,
              title: item.name,
              year: item.year || "",
              poster: item.image_url || "",
              type: "series",
            })),
          )
        }
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleAdd = (result: any) => {
    const newItem: MediaItem = {
      id: `${result.type}-${result.id}-${Date.now()}`,
      ...(result.type === "movie" ? { imdbId: result.id } : { tvdbId: result.id }),
      title: result.title,
      year: result.year,
      poster: result.poster,
      type: result.type,
      addedAt: new Date().toISOString(),
    } as MediaItem

    addMediaItem(newItem)
    setMediaList(getMediaList())
  }

  const handleRemove = (id: string) => {
    removeMediaItem(id)
    setMediaList(getMediaList())
  }

  const isAlreadyAdded = (result: any) => {
    return mediaList.some(
      (item) =>
        (item.type === "movie" && result.type === "movie" && item.imdbId === result.id) ||
        (item.type === "series" && result.type === "series" && item.tvdbId === result.id),
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-full max-w-sm px-6">
          <Link
            href="/"
            className="block mb-8 font-mono uppercase text-xs tracking-widest text-center hover:opacity-70 transition-opacity"
          >
            Back
          </Link>

          <h1 className="font-serif text-2xl italic text-center mb-8">Admin</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent border border-white/20 px-4 py-3 font-mono text-sm focus:outline-none focus:border-white/40 transition-colors"
            />
            {passwordError && <p className="font-mono text-xs text-red-400">{passwordError}</p>}
            <button
              type="submit"
              className="w-full bg-white/10 border border-white/20 px-4 py-3 font-mono uppercase text-xs tracking-widest hover:bg-white/20 transition-all"
            >
              Login
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/seen"
            className="font-mono uppercase text-xs tracking-widest hover:opacity-70 transition-opacity"
          >
            View List
          </Link>
          <h1 className="font-serif text-lg italic">Admin</h1>
          <button
            onClick={() => {
              sessionStorage.removeItem("admin-auth")
              setIsAuthenticated(false)
            }}
            className="font-mono uppercase text-xs tracking-widest hover:opacity-70 transition-opacity"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="pt-20 pb-10 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => {
                setActiveTab("movies")
                setSearchResults([])
                setSearchQuery("")
              }}
              className={`font-mono uppercase text-xs tracking-widest px-4 py-2 border transition-all ${
                activeTab === "movies" ? "bg-white/10 border-white/40" : "border-white/10 hover:border-white/20"
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => {
                setActiveTab("shows")
                setSearchResults([])
                setSearchQuery("")
              }}
              className={`font-mono uppercase text-xs tracking-widest px-4 py-2 border transition-all ${
                activeTab === "shows" ? "bg-white/10 border-white/40" : "border-white/10 hover:border-white/20"
              }`}
            >
              Shows
            </button>
          </div>

          {/* Search */}
          <div className="flex gap-2 mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={`Search ${activeTab}...`}
              className="flex-1 bg-transparent border border-white/20 px-4 py-3 font-mono text-sm focus:outline-none focus:border-white/40 transition-colors"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-white/10 border border-white/20 px-6 py-3 font-mono uppercase text-xs tracking-widest hover:bg-white/20 transition-all disabled:opacity-50"
            >
              {isSearching ? "..." : "Search"}
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mb-8">
              <h2 className="font-mono uppercase text-xs tracking-widest opacity-60 mb-4">Search Results</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {searchResults.map((result) => (
                  <div key={result.id} className="aspect-[2/3] relative group overflow-hidden bg-white/5">
                    {result.poster && result.poster !== "N/A" ? (
                      <Image
                        src={result.poster || "/placeholder.svg"}
                        alt={result.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-mono text-xs text-center px-2 opacity-60">{result.title}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-2">
                      <span className="font-mono text-xs text-center leading-tight mb-1 line-clamp-2">
                        {result.title}
                      </span>
                      <span className="font-mono text-[10px] opacity-60 mb-3">{result.year}</span>
                      {isAlreadyAdded(result) ? (
                        <span className="font-mono text-[10px] uppercase opacity-40">Added</span>
                      ) : (
                        <button
                          onClick={() => handleAdd(result)}
                          className="px-3 py-1 bg-white/10 border border-white/20 font-mono uppercase text-[10px] tracking-widest hover:bg-white/20 transition-all"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current List */}
          <div>
            <h2 className="font-mono uppercase text-xs tracking-widest opacity-60 mb-4">
              Your List ({mediaList.length})
            </h2>
            {mediaList.length === 0 ? (
              <p className="font-mono text-sm opacity-40">No items added yet. Search to add movies or shows.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {mediaList.map((item) => (
                  <div key={item.id} className="aspect-square relative group overflow-hidden bg-white/5">
                    {item.poster && item.poster !== "N/A" ? (
                      <Image
                        src={item.poster || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 16vw, 12.5vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-mono text-[8px] text-center px-1 opacity-60">{item.title}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-1">
                      <span className="font-mono text-[8px] text-center leading-tight line-clamp-2">{item.title}</span>
                      <span className="font-mono text-[7px] opacity-60 mt-0.5">{item.year}</span>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="mt-1 px-2 py-0.5 bg-red-500/20 border border-red-500/40 font-mono uppercase text-[7px] tracking-widest hover:bg-red-500/30 transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
