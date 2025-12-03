# Seen - Personal Movie & TV Show Tracker

> *"I watch; therefore I remember"*

A beautiful, immersive web app to track movies and TV shows you've watched, featuring a stunning 3D infinite gallery powered by WebGL.

![Seen App](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Database](https://img.shields.io/badge/Database-Neon-green?style=flat&logo=postgresql)

## ✨ Features

### 🎨 3D Infinite Gallery
- Stunning WebGL-powered carousel using Three.js
- Cloth-like physics with realistic folding effects
- Interactive scrolling (mouse wheel, arrow keys, touch)
- Depth-of-field blur and fade effects
- Auto-play mode with smooth animations

### 🎬 Media Tracking
- Add movies and TV shows to your collection
- Search via OMDB API (movies) and TVDB API (shows)
- Beautiful masonry grid layout
- Filter by all/movies/shows
- Poster images and metadata

### 💾 Persistent Storage
- **Neon PostgreSQL** database for permanent storage
- Data persists across devices and browsers
- Automatic backups via Neon
- One-click localStorage migration
- Fallback to localStorage if API fails

### 🔐 Admin Panel
- Password-protected admin interface
- Search and add movies/shows
- Remove items from collection
- Sync existing localStorage data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Vercel account (for deployment)
- Neon database (free tier available)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd seen
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` with your database URL from Vercel/Neon:
   ```env
   DATABASE_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require
   OMDB_API_KEY=d29e8464
   ```

3. **Push database schema:**
   ```bash
   pnpm db:push
   ```

4. **Start development server:**
   ```bash
   pnpm dev
   ```

5. **Open your browser:**
   - Main app: http://localhost:3000
   - Admin panel: http://localhost:3000/admin (password: `seen2024`)

## 📁 Project Structure

```
seen/
├── app/
│   ├── api/
│   │   ├── media/route.ts          # Media CRUD API
│   │   ├── search-movie/route.ts   # OMDB search
│   │   └── search-show/route.ts    # TVDB search
│   ├── admin/page.tsx              # Admin panel
│   ├── seen/page.tsx               # Media list view
│   ├── page.tsx                    # 3D gallery landing
│   └── layout.tsx
├── components/
│   └── InfiniteGallery.tsx         # 3D WebGL carousel
├── lib/
│   ├── db/
│   │   ├── schema.ts               # Database schema
│   │   └── index.ts                # DB connection
│   ├── storage.ts                  # Storage API wrapper
│   ├── types.ts                    # TypeScript types
│   └── utils.ts
├── drizzle.config.ts               # Drizzle ORM config
├── SETUP.md                        # Database setup guide
└── DEPLOYMENT.md                   # Deployment guide
```

## 🗄️ Database Schema

```typescript
media_items {
  id: UUID (primary key)
  imdb_id: TEXT (for movies)
  tvdb_id: TEXT (for TV shows)
  title: TEXT (not null)
  year: TEXT (not null)
  poster: TEXT (not null)
  type: TEXT (not null) // "movie" or "series"
  added_at: TIMESTAMP (default now)
}
```

## 🎯 API Routes

### GET `/api/media`
Fetch all media items
```json
[
  {
    "id": "uuid",
    "imdbId": "tt1234567",
    "title": "Movie Title",
    "year": "2024",
    "poster": "https://...",
    "type": "movie",
    "addedAt": "2024-01-01T00:00:00Z"
  }
]
```

### POST `/api/media`
Add new media item
```json
{
  "imdbId": "tt1234567",
  "title": "Movie Title",
  "year": "2024",
  "poster": "https://...",
  "type": "movie"
}
```

### DELETE `/api/media?id=<uuid>`
Remove media item

## 🛠️ Database Commands

```bash
# Push schema changes to database
pnpm db:push

# Generate migrations
pnpm db:generate

# Open Drizzle Studio (visual DB browser)
pnpm db:studio
```

## 🚢 Deployment

### Deploy to Vercel

1. **Connect Neon Database:**
   - Go to your Vercel project
   - Add Neon integration
   - Select all environments
   - Vercel sets `DATABASE_URL` automatically

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit with Neon DB"
   git push origin main
   ```

3. **Deploy:**
   - Vercel auto-deploys on push
   - Database is already configured
   - No additional setup needed!

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🔧 Configuration

### Admin Password
Change the admin password in `app/admin/page.tsx`:
```typescript
const ADMIN_PASSWORD = "seen2024"  // Change this!
```

### OMDB API Key
Get your own key at [omdbapi.com](http://www.omdbapi.com/apikey.aspx) and update `.env.local`

## 🎨 Customization

### 3D Gallery Settings
Customize the gallery in `app/page.tsx`:
```typescript
<InfiniteGallery
  images={sampleImages}
  speed={1.2}           // Scroll speed multiplier
  zSpacing={3}          // Spacing between images
  visibleCount={12}     // Number of visible planes
  falloff={{ near: 0.8, far: 14 }}  // Depth range
/>
```

### Styling
- Uses Tailwind CSS v4
- Dark theme by default
- Modify `app/globals.css` for global styles

## 📦 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5
- **3D Graphics:** Three.js, React Three Fiber
- **Database:** Neon PostgreSQL (Serverless)
- **ORM:** Drizzle ORM
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel
- **APIs:** OMDB (movies), TVDB (TV shows)

## 🐛 Troubleshooting

### Database connection fails
- Verify `DATABASE_URL` in `.env.local`
- Check Neon database is active
- Ensure SSL mode is enabled (`?sslmode=require`)

### 3D Gallery not rendering
- Check WebGL support in browser
- Falls back to image grid if WebGL unavailable
- Check browser console for errors

### API routes returning 500
- Check Vercel function logs
- Verify database schema is pushed
- Ensure environment variables are set

See [SETUP.md](SETUP.md) for detailed troubleshooting.

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your own use!

## 📄 License

MIT License - feel free to use this project however you'd like.

## 🙏 Credits

- Movie data: [OMDB API](http://www.omdbapi.com/)
- TV show data: [TVDB API](https://thetvdb.com/)
- 3D graphics: [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- Database: [Neon](https://neon.tech/)
- Hosting: [Vercel](https://vercel.com/)

---

**Enjoy tracking your watched content!** 🎬✨
