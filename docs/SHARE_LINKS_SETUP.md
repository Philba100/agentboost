# Share Link System Setup Guide

## Overview

The new share link system allows users to generate clean, trackable share URLs for skills without API keys in the URL. Perfect for Edge Gallery and social sharing.

### Architecture

```
User Dashboard
    ↓
[Generate Share Link Button]
    ↓
POST /api/generate-share-link
    ↓
Creates entry in share_links table with unique ID
    ↓
Returns: agentboost.app/share/{randomId}
    ↓
User can share this link
    ↓
When accessed: /share/{randomId} → looks up skill → displays it
```

---

## Setup Instructions

### Step 1: Create the Database Table

Run this SQL in your Supabase dashboard:

1. Go to **https://app.supabase.com**
2. Navigate to your project
3. Click **SQL Editor** → **New Query**
4. Copy and paste the entire contents of `migrations/001_create_share_links.sql`
5. Click **Run**

You should see:
```
✓ Success
- Table 'share_links' created
- 4 indexes created  
- RLS policies applied
```

### Step 2: Verify Environment Variables

Ensure your `.env.local` has:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 3: Restart Dev Server

```bash
npm run dev
```

---

## Using the Share Link System

### For Users

1. **Generate a Share Link**
   - Go to Dashboard
   - Click a skill's "Share" button
   - Choose expiration (optional): Never, 7 days, 30 days
   - Click "Generate Link"
   - Copy the link: `agentboost.app/share/7k3m9x2l-9d4f-8p2q-1r5s-3t8u9v2w4x5y`

2. **Share the Link**
   - Send to team members
   - Post on Edge Gallery
   - Share on social media
   - No API key in the URL ✓

3. **Recipients Access**
   - Opens directly to the skill page
   - Clean, professional URL
   - No authentication required
   - View counts tracked

### For Developers

#### Generate a Share Link (Backend)

```typescript
import { createShareLink } from '@/lib/shareLinks';

const result = await createShareLink(
  skillId: 'lead-qualifier',
  userId: 'user-uuid-here',
  expiresInDays: 30  // Optional
);

console.log(result.shareUrl);
// Output: https://agentboost-seven.vercel.app/share/7k3m9x2l-9d4f-8p2q-1r5s-3t8u9v2w4x5y
```

#### Get User's Share Links

```typescript
import { getShareLinks } from '@/lib/shareLinks';

const links = await getShareLinks(userId);
// Returns: [
//   {
//     share_id: '7k3m9x2l-...',
//     shareUrl: 'https://...',
//     skill_id: 'lead-qualifier',
//     created_at: '2026-04-14T10:00:00Z',
//     expires_at: '2026-05-14T10:00:00Z',
//     view_count: 42
//   }
// ]
```

#### Delete a Share Link

```typescript
import { deleteShareLink } from '@/lib/shareLinks';

const success = await deleteShareLink(shareId, userId);
```

---

## Share Link URL Format

### Clean Share URL
```
https://agentboost-seven.vercel.app/share/7k3m9x2l-9d4f-8p2q-1r5s-3t8u9v2w4x5y
```

### How It Works
1. User visits share URL
2. `/share/[slug]` route loads
3. Calls `/api/share-info/{slug}` to look up skill
4. Database returns skill_id
5. Page displays the skill
6. View count incremented

---

## Share Link Features

### Views Tracking
- Each access increments `view_count`
- Track link popularity
- See which skills are shared most

### Expiration
- Optional expiration dates
- Links can last: Never, 7 days, 30 days, custom
- Expired links return 410 (Gone) status

### Security
- Unique random IDs (not guessable)
- RLS policies prevent unauthorized access/deletion
- Each user can only manage their own links

### Analytics
- Track views per link
- See shared skill usage
- Monitor engagement

---

## Database Schema

```sql
Table: share_links
├── share_id (VARCHAR 36) - Unique share identifier
├── skill_id (VARCHAR 255) - Skill being shared
├── user_id (UUID) - User who created link
├── created_at (TIMESTAMP) - Creation time
├── expires_at (TIMESTAMP) - Optional expiration
├── view_count (INTEGER) - Times accessed
└── updated_at (TIMESTAMP) - Last update

Indexes:
├── share_id (PRIMARY)
├── user_id (for finding user's links)
├── skill_id (for analytics)
└── created_at (for sorting)
```

---

## API Endpoints

### Generate Share Link
```
POST /api/generate-share-link

Body: {
  "skillId": "lead-qualifier",
  "expiresInDays": 30  // Optional
}

Response: {
  "shareId": "7k3m9x2l-9d4f-8p2q-1r5s-3t8u9v2w4x5y",
  "shareUrl": "https://agentboost-seven.vercel.app/share/7k3m9x2l-..."
}
```

### Get Share Info
```
GET /api/share-info/{slug}

Response: {
  "skill_id": "lead-qualifier",
  "user_id": "user-uuid",
  "shared_at": "2026-04-14T10:00:00Z"
}
```

### Public Share Page
```
GET /share/{slug}

Redirects to: /share/{slug} (displays skill)
```

---

## Migrating from Old API Key System

### Old System
```
/skills/lead-qualifier?key=abc123def456
```

### New System
```
/share/7k3m9x2l-9d4f-8p2q-1r5s-3t8u9v2w4x5y
```

### Migration Steps
1. Generate new share links for shared skills
2. Update any links shared externally  
3. Keep old API key system as fallback (optional)
4. Deprecate API key shares in future release

---

## Troubleshooting

### "Share link not found" error

**Check:**
1. Share ID is correct
2. Link hasn't expired
3. Database table created
4. RLS policies are correct

**Debug:**
```sql
-- Check if share link exists
SELECT * FROM share_links WHERE share_id = '7k3m9x2l-...';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'share_links';
```

### Share link works but skill doesn't load

**Check:**
1. Skill ID is in skillsData.ts
2. SKILL.md file exists
3. No TypeScript errors in console

**Debug:**
```bash
# Check API response
curl http://localhost:3000/api/share-info/7k3m9x2l-...
```

### Can't create share link

**Check:**
1. User is authenticated
2. SUPABASE_SERVICE_ROLE_KEY is set
3. share_links table exists

---

## Next Steps

- Add share link UI to dashboard
- Create "Share" button on skill pages
- Add view analytics dashboard
- Implement link expiration reminders
- Create share link management panel

---

## Questions?

See [SUPPORT.md](../SUPPORT.md) for contact information.
