export interface Movie {
  id: string
  imdbId: string
  title: string
  year: string
  poster: string
  type: "movie"
  addedAt: string
}

export interface Show {
  id: string
  tvdbId: string
  title: string
  year: string
  poster: string
  type: "series"
  addedAt: string
}

export type MediaItem = Movie | Show

export interface OMDBResponse {
  Title: string
  Year: string
  Poster: string
  imdbID: string
  Type: string
  Response: string
  Error?: string
}

export interface OMDBSearchResponse {
  Search: OMDBResponse[]
  totalResults: string
  Response: string
  Error?: string
}

export interface TVDBAuthResponse {
  status: string
  data: {
    token: string
  }
}

export interface TVDBSearchResult {
  objectID: string
  name: string
  year: string
  image_url: string
  type: string
}

export interface TVDBSearchResponse {
  status: string
  data: TVDBSearchResult[]
}
