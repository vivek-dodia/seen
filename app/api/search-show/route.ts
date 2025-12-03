import { type NextRequest, NextResponse } from "next/server"

const TVDB_API_KEY = process.env.TVDB_API_KEY || "e8822417-fae8-4b05-80f8-7a4672a9ce79"

let cachedToken: string | null = null
let tokenExpiry = 0

async function getTVDBToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken
  }

  const response = await fetch("https://api4.thetvdb.com/v4/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ apikey: TVDB_API_KEY }),
  })

  const data = await response.json()

  if (data.status === "success" && data.data?.token) {
    cachedToken = data.data.token
    tokenExpiry = Date.now() + 23 * 60 * 60 * 1000 // 23 hours
    return cachedToken
  }

  throw new Error("Failed to authenticate with TVDB")
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query required" }, { status: 400 })
  }

  try {
    const token = await getTVDBToken()

    const response = await fetch(`https://api4.thetvdb.com/v4/search?query=${encodeURIComponent(query)}&type=series`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch show data" }, { status: 500 })
  }
}
