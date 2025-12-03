# Neon Database Setup Guide

This guide will help you set up Neon PostgreSQL database for persistent storage in your Seen app.

## 1. Vercel Database Configuration

When you're at the Vercel Neon DB configuration screen:

### Settings to Configure:
- **Connect to**: `seen-0` (or your database name)
- **Environments**: ✅ Check all three:
  - Development
  - Preview
  - Production
- **Create database branch for deployment**: ✅ Check:
  - Preview
  - Production
- **Custom Prefix**: `STORAGE`
  - This creates the `STORAGE_URL` environment variable

Click **Continue** to create the database.

## 2. Local Development Setup

### Step 1: Get your database URL from Vercel

After connecting Neon DB on Vercel, Vercel automatically provides the connection string as `DATABASE_URL`:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Find and copy the `DATABASE_URL` value (the pooled connection is recommended)

### Step 2: Create local environment file

Create a `.env.local` file in the root of your project:

```bash
DATABASE_URL=your_database_url_here
OMDB_API_KEY=d29e8464
```

Note: The code supports both `DATABASE_URL` (Vercel's default) and `STORAGE_URL` (if you used a custom prefix).

### Step 3: Push the database schema

Run this command to create the tables in your Neon database:

```bash
pnpm db:push
```

This will create the `media_items` table with the following schema:
- `id` (UUID, primary key)
- `imdb_id` (text, for movies)
- `tvdb_id` (text, for TV shows)
- `title` (text, not null)
- `year` (text, not null)
- `poster` (text, not null)
- `type` (text, not null) - "movie" or "series"
- `added_at` (timestamp, default now)

### Step 4: Start development server

```bash
pnpm dev
```

## 3. Migrating Existing localStorage Data

If you have existing movies/shows in localStorage:

1. Open your app and go to `/admin`
2. Login with password: `seen2024`
3. Look for the **"Sync localStorage"** button in the top right
4. Click it to migrate your data to the database
5. Once synced, the button will disappear

The sync is automatic and will:
- Read all items from localStorage
- Upload them to the database
- Mark the sync as complete so it won't run again

## 4. Database Commands

### Generate migrations
```bash
pnpm db:generate
```

### Push schema changes (for development)
```bash
pnpm db:push
```

### Open Drizzle Studio (visual database browser)
```bash
pnpm db:studio
```

## 5. Deployment

Your database is already configured on Vercel! Just:

1. Push your code to GitHub
2. Vercel will automatically deploy
3. The `STORAGE_URL` environment variable is already set for all environments

## 6. Troubleshooting

### "DATABASE_URL or STORAGE_URL environment variable is not set"
- Make sure you created `.env.local` file
- Verify the `DATABASE_URL` is correct
- Restart your development server

### Database connection fails
- Check that your Neon database is active in the Vercel dashboard
- Verify the connection string includes the correct password
- Ensure your IP is not blocked (Neon has no IP restrictions by default)

### Data not syncing
- Open browser console to check for errors
- Verify `/api/media` endpoint is working
- Check Vercel logs for API route errors

## Architecture Changes

### Before (localStorage only):
```
Browser → localStorage
```

### After (Neon DB):
```
Browser → Next.js API Routes → Neon PostgreSQL
         ↓ (fallback on error)
         localStorage
```

Benefits:
- ✅ Data persists across devices
- ✅ No data loss when clearing browser cache
- ✅ Can access from any device
- ✅ Automatic backups via Neon
- ✅ Fallback to localStorage if API fails
