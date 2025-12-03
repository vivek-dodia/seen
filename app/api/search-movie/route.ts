import { type NextRequest, NextResponse } from "next/server"

const OMDB_API_KEY = process.env.OMDB_API_KEY || "d29e8464"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")
  const imdbId = searchParams.get("i")

  if (!query && !imdbId) {
    return NextResponse.json({ error: "Query or IMDb ID required" }, { status: 400 })
  }

  try {
    let url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}`

    if (imdbId) {
      url += `&i=${imdbId}`
    } else if (query) {
      url += `&s=${encodeURIComponent(query)}&type=movie`
    }

    const response = await fetch(url)
    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch movie data" }, { status: 500 })
  }
}
