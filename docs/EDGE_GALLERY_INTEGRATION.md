# AgentBoost + Google AI Edge Gallery Integration

## Overview

AgentBoost skills are now compatible with **Google AI Edge Gallery**. Users can add AgentBoost skills directly to their Edge Gallery app and use them with on-device LLMs like Gemma 4.

## How to Add Skills to Edge Gallery

### Method 1: Add Individual Skill via Share Link (Recommended)

1. **Open Edge Gallery App** on your Android or iOS device
2. **Tap** "AI Chat" or "Agent Skills"
3. **Tap the Skills icon** (Skill Manager)
4. **Tap the (+) button** to add a new skill
5. **Select "Load skill from URL"**
6. **Paste your AgentBoost skill URL:**

```
https://agentboost-seven.vercel.app/api/edge-gallery/share/[your-share-id]/SKILL.md
```

Replace `[your-share-id]` with your actual share ID from the AgentBoost link.

7. **Tap "Add Skill"** and wait for it to load
8. **Confirm the skill appears** in your Skills Manager

---

### Method 2: Add All Skills from Directory

1. **Get the directory URL:**
```
https://agentboost-seven.vercel.app/api/edge-gallery/directory
```

2. **Download the JSON** or use it to discover all available skills
3. **Add each skill individually** using Method 1

---

### Method 3: API Integration (For Developers)

If you're building a custom app that integrates with LiteRT-LM:

#### Get Skill Metadata
```bash
curl https://agentboost-seven.vercel.app/api/edge-gallery/skill-metadata?skillId=linkedin-pro
```

Response:
```json
{
  "success": true,
  "skill": {
    "id": "linkedin-pro",
    "name": "LinkedIn Ghostwriter",
    "description": "Generate viral, high-converting social copy",
    "icon": "👔",
    "skillMdUrl": "/api/edge-gallery/skill-md?skillId=linkedin-pro",
    "executeUrl": "/api/v1/execute",
    "docsUrl": "/skills/linkedin-pro"
  }
}
```

#### Get All Skills Directory
```bash
curl https://agentboost-seven.vercel.app/api/edge-gallery/directory
```

#### Execute Skill (Requires API Key)
```bash
curl -X POST https://agentboost-seven.vercel.app/api/v1/execute \
  -H "Authorization: Bearer [YOUR_API_KEY]" \
  -H "Content-Type: application/json" \
  -d '{
    "skill": "linkedin-pro",
    "data": {
      "topic": "AI trends in 2025",
      "tone": "professional"
    }
  }'
```

---

## Available Endpoints

### Skill Metadata Endpoints

| Endpoint | Purpose | Example |
|----------|---------|---------|
| `GET /api/edge-gallery/skill-metadata?skillId=XX` | Get single skill metadata | `/api/edge-gallery/skill-metadata?skillId=linkedin-pro` |
| `GET /api/edge-gallery/skill-md?skillId=XX` | Get SKILL.md content | `/api/edge-gallery/skill-md?skillId=linkedin-pro` |
| `GET /api/edge-gallery/directory` | List all skills | `/api/edge-gallery/directory?category=Marketing` |
| `GET /api/edge-gallery/share/[shareId]/SKILL.md` | Share link access | `/api/edge-gallery/share/klwyrrw8.../SKILL.md` |

---

## Supported Skills

### 🟢 Free Skills (Always Accessible)
- **Lead Qualifier** - BANT/MEDDIC lead scoring
- **Meeting Scheduler** - Calendar sync & scheduling
- **Negotiation Engine** - Objection handling
- **Email Orchestrator** - Multi-step sequences
- **Analytics Hub** - Pipeline forecasting

### 🔵 Premium Skills (Requires Enterprise Plan)
- **LinkedIn Ghostwriter** - Social media copy generation
- **Crypto Quant Pro** - Options & volatility analysis
- **Real Estate Pro** - Investment underwriting
- **LeadScraper Pro** - Decision-maker extraction
- **Security Code Pro** - Pull request analysis
- **AWS Cost Optimizer** - Cloud infrastructure scanning
- **SEO Technical Pro** - Technical site audits
- **And 10+ more...**

---

## Share Links

Your share link allows easy credential-less access for Edge Gallery:

```
https://agentboost-seven.vercel.app/share/[your-share-id]
```

**Share Link Format:**
- Expires in **365 days** by default
- No authentication required
- Perfect for sharing with Edge Gallery users
- Visible in your AgentBoost dashboard

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────┐
│         Google AI Edge Gallery (Mobile)              │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  LiteRT-LM Language Models (Gemma 4, etc)    │   │
│  └──────────────────────────────────────────────┘   │
│                      ↓                               │
│  ┌──────────────────────────────────────────────┐   │
│  │         Agent Skills Manager                 │   │
│  │  (Auto-discovers skills from SKILL.md)      │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────┘
                           ↓ (HTTP)
┌─────────────────────────────────────────────────────┐
│      AgentBoost Platform (Web API)                   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  /api/edge-gallery/skill-metadata            │   │
│  │  /api/edge-gallery/skill-md                  │   │
│  │  /api/edge-gallery/share/[id]/SKILL.md       │   │
│  │  /api/v1/execute                             │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────┐
│         Supabase (Database & Auth)                  │
│  - Skills metadata                                   │
│  - User subscriptions                                │
│  - API keys & access control                        │
└─────────────────────────────────────────────────────┘
```

---

## SKILL.md Format

Each skill follows this format:

```markdown
---
name: Skill Name
description: Short description
metadata:
  icon: 🎯
  category: Marketing
  free: true
  homepage: https://...
---

# Skill Name

## Overview
Detailed description...

## Instructions
Model instructions...
```

---

## Troubleshooting

### Skill Won't Load
- ✅ Verify URL is correct (ends with `SKILL.md`)
- ✅ Check share link hasn't expired (365 days from creation)
- ✅ Ensure you have internet connection
- ✅ Try using GitHub Pages or Cloudflare to host if needed

### Share Link Not Working
- ✅ Regenerate share link from AgentBoost dashboard
- ✅ Verify skill ID is correct
- ✅ Check subscription tier has access to skill

### API Execution Fails
- ✅ Verify API key is valid
- ✅ Check subscription tier allows skill access
- ✅ Ensure all required parameters are provided

---

## API Rate Limits

- **Skill Metadata**: 1000 requests/day
- **SKILL.md Requests**: 2000 requests/day  
- **Execute Endpoint**: Based on subscription tier

---

## Support

For issues or questions:
- 📧 Email: support@agentboost.com
- 🐛 Report bugs: https://github.com/agentboost/issues
- 📚 Documentation: https://docs.agentboost.com/edge-gallery

---

## Next Steps

1. **Get a Share Link** - Generate one from your AgentBoost dashboard
2. **Add to Edge Gallery** - Follow "Method 1" above
3. **Test with Gemma 4** - Try using the skill in a chat
4. **Explore More Skills** - Browse the full directory at `/api/edge-gallery/directory`
