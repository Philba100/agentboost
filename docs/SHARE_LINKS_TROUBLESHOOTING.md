# Share Links Troubleshooting Guide

## Problem: All Shared Links Show "Lead Qualifier"

This typically happens when the share link resolution isn't working correctly with Edge Gallery or the client is not resolving the share_id properly.

### Root Cause Analysis

The original implementation had **two separate systems**:
1. **Web Share Links** - `/share/[shareId]` page that resolves the share_id to skill_id
2. **Edge Gallery Access** - Direct `/api/skill-md?id=skillId` endpoint

**The problem:** Edge Gallery doesn't understand `/share/[shareId]` links - it needs `/api/skill-md?id=shareId` to work directly.

### Solution Implemented

✅ **Modified `/api/skill-md` endpoint** to:
1. Detect if the `id` parameter is a share_id (matches pattern: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
2. Look up the share_id in the `share_links` table
3. Get the actual skill_id from the database
4. Serve the correct skill's SKILL.md file
5. Increment view count for tracking

### How to Test

#### 1. Check if share links exist in your database:

```bash
# Run this SQL query in your Supabase SQL editor:
SELECT * FROM share_links ORDER BY created_at DESC LIMIT 10;
```

Expected output should show:
- `share_id`: e.g., `7k3m9x2l-9d4f-8p2q-1r5s-3t8u9v2w4x5y`
- `skill_id`: e.g., `lead-qualifier`, `meeting-scheduler`, etc.
- `created_at`: timestamp
- `expires_at`: timestamp (or NULL)
- `view_count`: number

#### 2. Test share link resolution directly:

```bash
# Use the debug endpoint (requires your auth token):
curl -H "Authorization: Bearer <YOUR_TOKEN>" \
  https://agentboost-seven.vercel.app/api/debug/share-links?action=list-all
```

#### 3. Test the updated skill-md endpoint:

```bash
# Test with a share_id:
curl "https://agentboost-seven.vercel.app/api/skill-md?id=7k3m9x2l-9d4f-8p2q-1r5s-3t8u9v2w4x5y"

# Should return the correct skill's markdown content
```

### Common Issues & Fixes

#### Issue 1: Database table not found
**Error**: `PGRST205` or `share_links not found`

**Fix**: Ensure the database migration was run:
```bash
# In your Supabase SQL editor, run:
```
[See migrations/001_create_share_links.sql]

#### Issue 2: Share links are all pointing to 'lead-qualifier'
**Problem**: All share_ids have `skill_id = 'lead-qualifier'` in the database

**Fix**: Delete incorrect entries and regenerate:
```sql
-- Check what's in your table:
SELECT share_id, skill_id, COUNT(*) as count 
FROM share_links 
GROUP BY skill_id;

-- If needed, delete and regenerate shares:
DELETE FROM share_links WHERE skill_id = 'lead-qualifier' AND ( /* your condition */ );
```

#### Issue 3: Edge Gallery still not working
**Symptoms**: Share link works in web (agentboost.app) but not in Edge Gallery

**Possible causes**:
1. Edge Gallery is caching the old endpoint - clear browser cache
2. CORS issues - check browser console for errors
3. Share link has expired - check `expires_at` timestamp

**Fix**:
```bash
# Test if the endpoint is accessible from Edge Gallery context:
curl -v "https://agentboost-seven.vercel.app/api/skill-md?id=<share_id>"

# Verify CORS headers are present:
curl -i -X OPTIONS "https://agentboost-seven.vercel.app/api/skill-md?id=<share_id>"
```

### How Share Links Should Work Now

```
Web Browser (HTML page):
  /share/[shareId]
    ↓
  Component calls: /api/skill-md?id=shareId
    ↓
  API detects it's a share_id → Looks up in share_links table
    ↓
  Gets skill_id → Returns SKILL.md content
    ↓
  Page displays skill ✓

Edge Gallery (Agent):
  Needs: /api/skill-md?id=shareId
    ↓
  Same as above ✓
```

### New Capabilities

With this update, you can now:

1. **Generate share links for ANY skill** (not just for API keys)
2. **Share links expire automatically** based on subscription end date
3. **Track usage** with view counts
4. **Works in Edge Gallery** - just pass the share_id as the `id` parameter

### Example: Creating a Share Link for Edge Gallery

```javascript
// 1. Generate the share link
const response = await fetch('/api/generate-share-link', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify({
    skillId: 'meeting-scheduler',
    expiresInDays: 30  // Link expires in 30 days
  })
});

const { shareUrl, shareId } = await response.json();

// 2. Share the link with Edge Gallery
// Edge Gallery can now use:
// https://agentboost-seven.vercel.app/api/skill-md?id=<shareId>

// 3. Or share the full web URL:
// https://agentboost-seven.vercel.app/share/<shareId>
```

### Verification Checklist

- [ ] Database `share_links` table exists
- [ ] Share links have correct `skill_id` values (not all 'lead-qualifier')
- [ ] `/api/skill-md?id=<share_id>` returns correct skill markdown
- [ ] Share links have not expired (check `expires_at`)
- [ ] Web page `/share/[shareId]` loads correctly
- [ ] Edge Gallery can access the skill content
- [ ] View counts are incrementing

### Still Having Issues?

Check the browser console for errors:
1. **Network tab** - Is `/api/skill-md?id=...` responding with 200?
2. **Console** - Any JavaScript errors?
3. **Request headers** - Are auth headers being sent?

You can also check server logs for detailed error messages when the API is called.
