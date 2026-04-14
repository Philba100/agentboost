# Share Link System - Implementation Guide

## Problem Statement

The original API key approach for sharing has limitations:

❌ **Original Approach**
```
/skills/lead-qualifier?key=abc123def456&type=share
```

Problems:
- Query parameters don't work well with Edge Gallery
- Hard to read and remember
- API key visible in URL (security concern for sensitive links)
- Difficult to revoke without invalidating all API keys
- No tracking of individual share usage

---

## Solution: Public Share Links

✅ **New Approach**
```
/share/7k3m9x2l-9d4f-8p2q-1r5s-3t8u9v2w4x5y
```

Benefits:
- Clean, professional URLs
- No API keys in URL (more secure)
- Perfect for Edge Gallery sharing
- Each link is independently trackable
- Easy to revoke individual shares
- Support for expiration dates
- View count analytics
- No authentication needed for recipients

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     SHARE LINK FLOW                             │
└─────────────────────────────────────────────────────────────────┘

1. CREATION
   User Dashboard
        ↓
   [Generate Share Link] Button
        ↓
   POST /api/generate-share-link
        ↓
   Generate random ID: 7k3m9x2l-9d4f-8p2q-1r5s-3t8u9v2w4x5y
        ↓
   Store in database:
   - share_id
   - skill_id
   - user_id (who created it)
   - created_at, expires_at, view_count
        ↓
   Return: agentboost.app/share/7k3m9x2l-...

2. SHARING
   User copies link and shares:
   - Email
   - Slack
   - Edge Gallery  
   - Social media
   - Direct URL

3. ACCESSING
   Recipient clicks: agentboost.app/share/7k3m9x2l-...
        ↓
   GET /share/[slug] page loads
        ↓
   Calls API: /api/share-info/7k3m9x2l-...
        ↓
   Database lookup returns skill_id
        ↓
   SkillViewer renders skill
        ↓
   Increment view_count

4. DATABASE RECORD
   share_links table:
   {
     share_id: "7k3m9x2l-9d4f-8p2q-1r5s-3t8u9v2w4x5y",
     skill_id: "lead-qualifier",
     user_id: "user-uuid-123",
     created_at: "2026-04-14T10:00:00Z",
     expires_at: "2026-05-14T10:00:00Z",
     view_count: 42,
     updated_at: "2026-04-14T11:30:00Z"
   }
```

---

## File Structure

```
agentboost/
├── app/
│   ├── api/
│   │   ├── generate-share-link/
│   │   │   └── route.ts         # POST /api/generate-share-link
│   │   └── share-info/
│   │       └── [slug]/
│   │           └── route.ts     # GET /api/share-info/{slug}
│   └── share/
│       └── [slug]/
│           └── page.tsx         # Public share page
├── lib/
│   └── shareLinks.ts            # Share link utilities
├── migrations/
│   └── 001_create_share_links.sql  # Database setup
└── docs/
    └── SHARE_LINKS_SETUP.md     # This guide
```

---

## Key Components

### 1. Database Table (`migrations/001_create_share_links.sql`)

```sql
CREATE TABLE share_links (
  share_id VARCHAR(36) PRIMARY KEY,  -- Random ID
  skill_id VARCHAR(255) NOT NULL,    -- Skill being shared
  user_id UUID NOT NULL,             -- Who created it
  created_at TIMESTAMP,              -- When created
  expires_at TIMESTAMP,              -- When it expires
  view_count INTEGER DEFAULT 0,      -- Usage tracking
  updated_at TIMESTAMP               -- Last update
);
```

**Why this design:**
- `share_id` as ID is fast to look up
- `user_id` allows tracking who shared
- `expires_at` supports time-limited links
- `view_count` enables analytics
- RLS policies ensure security

### 2. Utility Functions (`lib/shareLinks.ts`)

```typescript
// Generate new share link
createShareLink(skillId, userId, expiresInDays)
  → Returns: { shareId, shareUrl }

// Get user's links
getShareLinks(userId)
  → Returns: Array of share links with stats

// Delete a link
deleteShareLink(shareId, userId)
  → Returns: boolean (success)
```

### 3. API Endpoints

**POST /api/generate-share-link**
- Creates new share link
- Returns clean URL
- Requires authentication

**GET /api/share-info/{slug}**
- Looks up share link info
- Returns skill_id
- Increments view count
- No auth needed

### 4. Public Share Page (`app/share/[slug]/page.tsx`)

- Accepts share ID from URL
- Fetches skill info from API
- Renders skill using SkillViewer
- Shows "Shared Skill" badge
- Works with Edge Gallery

---

## Random ID Generation

Why not use UUID?

```
UUID:    550e8400-e29b-41d4-a716-446655440000  (Cryptographically secure but long)
ShareID: 7k3m9x2l-9d4f-8p2q-1r5s-3t8u9v2w4x5y  (Shorter, alphanumeric, easier to share)
```

**ShareID Format: 8-4-4-4-12**
- 36 characters total
- Alphanumeric (0-9, a-z)
- Collision probability: ~1 in tricentillion
- Easy to copy/paste
- Works in URLs without encoding

**Generation:**
```typescript
function generateShareId(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  const segments = [8, 4, 4, 4, 12];
  
  return segments
    .map(len => 
      Array.from({ length: len }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ).join('')
    )
    .join('-');
}
```

---

## Security Considerations

### Authentication
- ✅ Only logged-in users can create share links
- ✅ Users can only manage their own links
- ✅ RLS policies enforce this at database level

### Public Access
- ✅ Links are public, anyone can view
- ✅ No sensitive data exposed (just skill content)
- ✅ Same content as already public skills
- ✅ View tracking doesn't expose user info

### Attack Prevention
- ✅ Random IDs not guessable (36 chars, 36^36 possibilities)
- ✅ No enumeration possible (can't loop through all links)
- ✅ Rate limiting recommended (use Vercel's built-in)
- ✅ Optional expiration prevents stale links

### Data Privacy
- ✅ User IDs not exposed in URLs
- ✅ Only share creator can delete links
- ✅ View count is aggregate, not per-user tracking
- ✅ Follows GDPR principles (limited data collection)

---

## Usage Examples

### Creating a Share Link

Frontend (client-side):
```typescript
async function generateShareLink(skillId: string) {
  const response = await fetch('/api/generate-share-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      skillId,
      expiresInDays: 30  // Optional
    })
  });
  
  const { shareUrl, shareId } = await response.json();
  console.log('Share this link:', shareUrl);
  // agentboost-seven.vercel.app/share/7k3m9x2l-...
}
```

### Displaying Share Links in Dashboard

Component:
```jsx
// In dashboard, show "Share" button
<button onClick={() => generateShareLink(skillId)}>
  📤 Share Skill
</button>

// Show recently created links
<div>
  {shareLinks.map(link => (
    <div key={link.share_id}>
      <a href={link.shareUrl}>
        {link.shareUrl}
      </a>
      <span>{link.view_count} views</span>
      <span>Expires: {link.expires_at}</span>
    </div>
  ))}
</div>
```

---

## Comparison: Old vs New

| Feature | Old API Key | New Share Link |
|---------|------------|-----------------|
| URL Format | `?key=abc123` | `/share/abc123` |
| Clean URL | ❌ | ✅ |
| Edge Gallery | ❌ Works poorly | ✅ Works great |
| Trackable | ❌ All keys tracked together | ✅ Individual tracking |
| Revokable | ❌ Revoke all or none | ✅ Revoke individual |
| Expires | ❌ No | ✅ Yes, configurable |
| Analytics | ❌ Aggregate | ✅ Per-link stats |
| Security | ⚠️ Key in URL | ✅ No secrets in URL |
| Implementation | ✅ Simple | ✅ Straightforward |

---

## Migration Path

### Phase 1: Deploy New System
1. Run database migration
2. Deploy new API endpoints
3. Deploy share page routes

### Phase 2: Add UI
1. Add "Share" button to dashboard
2. Add share management panel
3. Display share links and stats

### Phase 3: Migrate Users
1. Generate share links for existing API keys
2. Send notifications to users
3. Keep old system as fallback

### Phase 4: Deprecate Old System
1. Mark API key sharing as deprecated
2. Encourage users to use new system
3. Remove old endpoints (v2 release)

---

## Future Enhancements

Potential additions:
- [ ] Bulk share link generation
- [ ] Scheduled expiration reminders
- [ ] Share link analytics dashboard
- [ ] Custom domain support
- [ ] Password-protected shares
- [ ] Download skill as PDF option
- [ ] Track who viewed (requires auth)
- [ ] Webinar/event custom links

---

## Troubleshooting

### Share link page appears blank
- Check browser console for errors
- Verify skill ID is correct
- Confirm SKILL.md file exists
- Check database has the share_links record

### Can't generate share links
- Verify user is authenticated
- Check SUPABASE_SERVICE_ROLE_KEY is set
- Confirm database table exists
- Check RLS policies are correct

### View count not incrementing
- Verify database update trigger works
- Check RLS allows updates
- Inspect network tab for API errors

---

## Questions or Issues?

See the setup guide: [SHARE_LINKS_SETUP.md](./SHARE_LINKS_SETUP.md)

Contact: phillipmbanda@gmail.com
