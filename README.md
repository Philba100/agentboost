# 🤖 AgentBoost

![AgentBoost](https://img.shields.io/badge/AgentBoost-Enterprise%20AI%20Agent%20Orchestration-00ff9d) ![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg) [![Status: Active](https://img.shields.io/badge/Status-Active%20Development-green)]()

**Enterprise-grade AI Agent Orchestration Platform** — A comprehensive suite of 31+ specialized AI agents and workflow skills for automating complex business processes, lead qualification, contract management, CRM integration, and intelligent business intelligence.

**⚠️ IMPORTANT**: This project is intended for use by **supporters and sponsors only**. While released under MIT License, we encourage users to sponsor/support development for production usage. See [Sponsorship](#sponsorship-and-support) section below.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [API Reference](#api-reference)
- [Skills Catalog](#skills-catalog)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Development](#development)
- [Sponsorship and Support](#sponsorship-and-support)
- [License](#license)
- [Contact](#contact)

---

## Overview

AgentBoost is a full-featured AI agent orchestration platform built with **Next.js 16+**, **React 19**, and **Supabase**. It provides:

✅ **31+ Pre-built AI Skills** — Lead qualification, contract drafting, CRM synchronization, analytics, and more  
✅ **Multi-tier Subscription System** — Free, Pro, and Enterprise access levels  
✅ **Secure API Key Management** — 14-character cryptographic API keys for integration  
✅ **Beautiful Dashboard UI** — Dark theme with responsive design  
✅ **Full Authentication System** — Email/password auth with Supabase  
✅ **Markdown Documentation** — Skill documentation with interactive tabs  
✅ **Enterprise Features** — Multi-agent workflows, CRM integration, real-time analytics  

---

## Features

### Core Features
- 🎯 **31+ Pre-built AI Skills** covering sales, legal, operations, and finance
- 📊 **Real-time Dashboard** with skill browsing and access controls
- 🔐 **Subscription Tiers** — Free (5 skills), Pro (per-skill purchase), Enterprise (unlimited)
- 🔑 **API Key Management** — Secure key generation and share links
- 📱 **Mobile Responsive** — Full mobile support with optimized UI
- 🌙 **Dark Theme** — Modern dark interface (#0f172a background)
- 📚 **Interactive Documentation** — Tabbed interface with How-To guides

### Skill Categories

**Sales & Marketing** (7 skills)
- Lead Qualifier (BANT Scoring)
- B2B Lead Generator
- Email Orchestrator
- LinkedIn Pro
- Public Announcer
- Telegram Connector
- WhatsApp Connector

**Operations & Management** (8 skills)
- Task Prioritization Engine
- Project Status Dashboard
- Meeting Scheduler
- Meeting Minutes Manager
- Calendar Sync
- Slack Lite
- Office Ops Coordinator
- Expense Reporting Bot

**Legal & Contracts** (4 skills)
- Contract Draft Assistant
- Legal Risk Analyzer
- Negotiation Engine
- Procurement Bid Coordinator

**Enterprise & Finance** (7 skills)
- CRM Sync
- Invoice Payments Manager
- AWS Cost Analyzer
- Crypto Analyzer
- Stripe Invoice Manager
- Knowledge Hub Curator
- GitHub Review Assistant

**AI & Content** (5 skills)
- HR Onboarding Assistant
- Real Estate Assistant
- SEO Audit Tool
- RSS Aggregator
- YouTube Predictor

---

## Architecture

```
agentboost/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Landing page
│   ├── dashboard/               # User dashboard
│   ├── skills/[skill]/          # Dynamic skill pages
│   ├── api/                     # API routes
│   │   ├── validate-token       # Token validation
│   │   ├── skill-md             # Markdown content server
│   │   ├── checkout             # Payment processing
│   │   └── webhooks/            # Webhook handlers
│   ├── auth/                    # Authentication pages
│   ├── components/              # React components
│   └── lib/                     # Utilities and helpers
├── public/                      # Static assets
├── skills/                      # Skill documentation (SKILL.md)
├── components/                  # Shared components
├── lib/
│   ├── skillsData.ts           # Skill registry
│   ├── skillAccess.ts          # Access control logic
│   └── supabaseAdmin.ts        # Database client
├── next.config.ts              # Next.js config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies

Database Schema (Supabase):
├── profiles
│   ├── id (UUID)
│   ├── email (string)
│   ├── subscription_tier (free|pro|enterprise)
│   ├── created_at (timestamp)
│   └── updated_at (timestamp)
├── api_keys
│   ├── id (UUID)
│   ├── user_id (FK)
│   ├── key_prefix (first 14 chars)
│   ├── created_at (timestamp)
│   └── skill_id (string)
```

---

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Clone & Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/agentboost.git
cd agentboost

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

```bash
# .env.local

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Database (Admin - for server-side only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxx
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Vercel Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
```

---

## Quick Start

### Development

```bash
# Start dev server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build
npm run build

# Start production server
npm start
```

### Testing

```bash
# Run tests
npm test

# Run linter
npm run lint
```

---

## Documentation

### User Documentation

- **[Platform Overview](./docs/platform-overview.md)** — Features, architecture, and capabilities
- **[User Guide](./docs/user-guide.md)** — Dashboard, subscription management, API keys
- **[Integration Guide](./docs/integration-guide.md)** — APIs, webhooks, OAuth
- **[Skill Documentation](./docs/skills/)** — Individual skill guides and examples

### For Developers

- **[Development Guide](./docs/development.md)** — Setup, architecture, code structure
- **[API Reference](./docs/api-reference.md)** — Endpoint documentation, authentication
- **[Deployment Guide](./docs/deployment.md)** — Deploy to Vercel, Docker, AWS
- **[Contributing Guide](./CONTRIBUTING.md)** — Code standards, pull requests

### Skill-Specific Docs

Each skill includes detailed documentation accessible via:
- **Dashboard** → Click skill → "View Skill Docs"
- **Direct URL** → `/skills/{skill-id}/`
- **Markdown** → `skills/{skill-id}/SKILL.md`

---

## API Reference

### Authentication

All API requests require authentication via:

**Cookie-based (Web)**
```bash
# Automatically managed by Supabase client
```

**API Key (Integration)**
```bash
curl -X GET http://localhost:3000/api/validate-token?key=YOUR_API_KEY&skill=lead-qualifier
```

### Endpoints

#### Validate Token
```
GET /api/validate-token?key={apiKeyPrefix}&skill={skillId}

Response:
{
  "valid": true,
  "type": "free|paid|enterprise",
  "message": "Access granted",
  "error": null
}
```

#### Get Skill Markdown
```
GET /api/skill-md?id={skillId}

Response:
{
  "content": "# Skill Documentation Markdown...",
  "error": null
}
```

#### Track Skill Usage
```
POST /api/track-upgrade

Body:
{
  "skillId": "lead-qualifier",
  "action": "view|execute|share"
}
```

#### Stripe Webhooks
```
POST /api/webhooks/stripe

# Handles: customer.subscription.created, updated, deleted
```

### Rate Limiting

- **Free tier**: 100 requests/day per skill
- **Pro tier**: 1,000 requests/day per purchased skill
- **Enterprise tier**: Unlimited

---

## Skills Catalog

### Lead Qualifier (Free)
BANT/MEDDIC lead scoring and qualification for sales teams.

```json
{
  "id": "lead-qualifier",
  "name": "Lead Qualifier",
  "icon": "🎯",
  "category": "Sales",
  "free": true,
  "desc": "Enterprise-grade multi-dimensional lead scoring"
}
```

### Contract Draft Assistant
Automated contract drafting with risk analysis and negotiation notes.

```json
{
  "id": "contract-draft-assistant",
  "name": "Contract Draft Assistant",
  "icon": "📜",
  "category": "Legal",
  "free": false,
  "desc": "Draft contracts, redlines and negotiation notes"
}
```

**View [Full Skills Registry](./app/lib/skillsData.ts)** for all 31+ skills.

---

## Configuration

### Subscription Tiers

**Free Tier**
- 5 free skills + 5 utility skills
- 100 API calls/skill/day
- No API key generation
- 30-day access period

**Pro Tier**
- Individual skill purchase ($9.99-$99.99/skill)
- 1,000 API calls/skill/day
- API key generation & management
- 30-day renewal model

**Enterprise Tier**
- Unlimited access to all 31+ skills
- Unlimited API calls
- Priority support
- Custom integrations
- Annual billing

### Skill Access Control

Skills have a `free` property that determines accessibility:

```typescript
// skillsData.ts
{
  id: "lead-qualifier",
  free: true,  // ← Always accessible
  // ...
}

{
  id: "contract-draft-assistant",
  free: false, // ← Requires subscription
  // ...
}
```

---

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Push to GitHub
git add .
git commit -m "Deploy to Vercel"
git push origin main

# Connect to Vercel via GitHub
# https://vercel.com/new

# Set environment variables in Vercel dashboard
# Deploy!
```

### Deploy to Docker

```bash
# Build image
docker build -t agentboost .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  agentboost
```

### Deploy to AWS

See [AWS Deployment Guide](./docs/deployment.md#aws-ec2)

---

## Development

### Code Structure

```
Key Files:
- app/page.tsx              → Landing page
- app/dashboard/page.tsx    → Main user dashboard
- app/skills/[skill]/       → Dynamic skill pages
- app/lib/skillsData.ts     → Central skill registry
- components/SiteHeader.tsx → Navigation
- lib/supabaseAdmin.ts      → Database client
```

### Adding a New Skill

1. **Create SKILL.md**
   ```bash
   mkdir skills/my-skill
   echo "# My Skill\nDocumentation..." > skills/my-skill/SKILL.md
   ```

2. **Register in skillsData.ts**
   ```typescript
   {
     id: "my-skill",
     icon: "🎯",
     name: "My Skill",
     desc: "Description",
     category: "Sales",
     free: false,  // or true
     benefits: ["Feature 1", "Feature 2"]
   }
   ```

3. **Build & Deploy**
   ```bash
   npm run build
   npm start
   ```

### Tech Stack

- **Framework**: Next.js 16.2.2
- **Runtime**: React 19.2.4
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **Markdown**: react-markdown v9
- **Payment**: Stripe
- **Deployment**: Vercel

---

## Sponsorship and Support

This project is provided under the **MIT License**, which allows free usage and modification. However, **professional usage in production environments should include sponsorship or support agreements**.

### Why Sponsor?

- 💰 **Ensures Sustainability** — Keeps development active and security patches current
- 🎯 **Priority Features** — Influence feature roadmap
- 🔒 **Security Support** — First access to security updates
- 📞 **Direct Support** — Email and Slack support channels
- 🏢 **Enterprise SLA** — 99.9% uptime guarantee

### Sponsorship Tiers

| Tier | Price | Includes |
|------|-------|----------|
| **Supporter** | $5/mo | GitHub sponsor badge, early access |
| **Professional** | $50/mo | Email support, priority updates |
| **Enterprise** | Custom | SLA, custom integrations, direct support |

**[Become a Sponsor →](https://github.com/sponsors/Philba100)**

---

## License

MIT License © 2024-2026 Phillip Martin Banda

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, and distribute copies of the Software, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

**THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND**, express or implied, including but not limited to the warranties of MERCHANTABILITY, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.

**For production or commercial use, we recommend sponsorship.** See [Sponsorship and Support](#sponsorship-and-support).

---

## Contact

**Author**: Phillip Martin Banda  
**Email**: [phillipmbanda@gmail.com](mailto:phillipmbanda@gmail.com)  
**GitHub**: [@Philba100](https://github.com/Philba100/)  
**LinkedIn**: [phillip-banda-4a95949a](https://www.linkedin.com/in/phillip-banda-4a95949a/)

### Support

- 📧 **Email Support**: phillipmbanda@gmail.com
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Philba100/agentboost/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Philba100/agentboost/discussions)
- 🌐 **Website**: [agentboost-seven.vercel.app](https://agentboost-seven.vercel.app)

---

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Database powered by [Supabase](https://supabase.io)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Payments via [Stripe](https://stripe.com)
- Hosted on [Vercel](https://vercel.com)

---

**⭐ If you find AgentBoost useful, please consider sponsoring the project or giving it a star!**
