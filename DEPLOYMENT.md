# Deployment Guide

## ✅ Your Setup is Complete!

Your Neon database is already configured on Vercel. Here's what's ready:

### Already Configured:
- ✅ Neon PostgreSQL database
- ✅ Environment variables (`DATABASE_URL`) set on Vercel
- ✅ Database schema pushed to production
- ✅ All environments (Development, Preview, Production)

## Deploy to Vercel

### Option 1: Automatic Deployment (Recommended)

If your repository is already connected to Vercel:

```bash
git add .
git commit -m "Add Neon database integration"
git push
```

Vercel will automatically:
1. Detect the changes
2. Build your app
3. Deploy to production
4. Use the existing `DATABASE_URL` environment variable

### Option 2: Manual Deployment

If not connected yet:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add Neon database integration"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Verify Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Confirm `DATABASE_URL` exists for all environments

## Post-Deployment

### Test Your Deployment

1. Visit your deployed site: `https://your-app.vercel.app`
2. Go to `/admin` and login (password: `seen2024`)
3. Add a test movie or show
4. Verify it appears on the `/seen` page
5. Close browser and reopen - data should persist!

### Migrate Existing Data

If you had localStorage data before:

1. Go to `/admin` on your deployed site
2. Look for "Sync localStorage" button
3. Click to migrate your data to the database
4. Data is now backed by Neon and will persist forever

## Vercel Environment Variables

Your Vercel project automatically has these variables:

```env
DATABASE_URL=postgresql://...  # Primary database connection
POSTGRES_URL=postgresql://...  # Alternative naming
OMDB_API_KEY=d29e8464         # Movie database API
```

## Database Management

### View Your Database

**Option 1: Drizzle Studio (Local)**
```bash
pnpm db:studio
```
Opens a visual database browser at http://localhost:4983

**Option 2: Neon Console**
1. Go to [neon.tech](https://neon.tech)
2. Find your project
3. Use SQL Editor to query your data

### Make Schema Changes

1. **Update schema:** Edit `lib/db/schema.ts`

2. **Push changes:**
   ```bash
   pnpm db:push
   ```

3. **Deploy:**
   ```bash
   git add .
   git commit -m "Update database schema"
   git push
   ```

Vercel will automatically apply changes on deployment.

## Monitoring

### Check Database Health

- **Neon Dashboard:** [console.neon.tech](https://console.neon.tech)
  - View connection count
  - Monitor storage usage
  - Check query performance

- **Vercel Logs:** Project → Logs
  - View API route errors
  - Check database connection issues

## Troubleshooting

### Deployment fails with database error

1. Check Vercel logs for specific error
2. Verify `DATABASE_URL` is set in Vercel environment variables
3. Ensure database is active in Neon console

### API routes not working

1. Check `/api/media` endpoint directly: `https://your-app.vercel.app/api/media`
2. Should return empty array `[]` if no data
3. Check browser console for errors
4. Review Vercel function logs

### Data not syncing

1. Open browser DevTools → Network tab
2. Try adding a movie
3. Look for POST to `/api/media`
4. Check response status and body
5. Review Vercel function logs

## Rolling Back

If you need to rollback:

1. Go to Vercel Dashboard → Deployments
2. Find a previous working deployment
3. Click "..." → "Promote to Production"

Your database data is preserved during rollbacks.

## Backup

Neon automatically backs up your database:
- Point-in-time recovery available
- Managed by Neon
- Access via Neon console

To manually export data:
```bash
pnpm db:studio
```
Then use the export feature in Drizzle Studio.

## Next Steps

- ✅ Deploy your app
- ✅ Test adding movies/shows
- ✅ Share with friends!
- Consider adding user authentication
- Add social sharing features
- Export your collection to CSV

Your app now has enterprise-grade persistent storage! 🚀
