# Check Vercel Environment Variables

If Vercel didn't set `DATABASE_URL` automatically, you might see these instead:

Common Vercel/Neon variable names:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `DATABASE_URL`

## Quick Fix Options:

### Option A: Add DATABASE_URL manually
Go to Vercel → Settings → Environment Variables
Add `DATABASE_URL` with your connection string (see instructions above)

### Option B: Use existing POSTGRES_URL
If `POSTGRES_URL` already exists on Vercel, we can update the code to use that instead.

Check your Vercel dashboard at:
https://vercel.com/vivek-dodia/seen/settings/environment-variables

Do you see:
- [ ] DATABASE_URL (our target)
- [ ] POSTGRES_URL (Vercel's default)
- [ ] Other database variables?

Let me know what you see and I'll update the code accordingly!
