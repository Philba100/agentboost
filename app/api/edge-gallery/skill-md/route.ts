import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import skills from '@/app/lib/skillsData';

/**
 * EDGE GALLERY SKILL.MD ENDPOINT
 * Serves SKILL.md files in Edge Gallery format for import
 * 
 * When users add a skill from URL in Edge Gallery, it requests:
 * GET /api/edge-gallery/skill-md?skillId=linkedin-pro
 * 
 * This endpoint returns the SKILL.md content that Edge Gallery can parse
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skillId = searchParams.get('skillId');

    if (!skillId) {
      return NextResponse.json({ error: 'Missing skillId parameter' }, { status: 400 });
    }

    // Verify skill exists
    const skillExists = skills.find(s => s.id === skillId);
    if (!skillExists) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    // Try to read existing SKILL.md from skills folder
    try {
      const mdPath = path.join(process.cwd(), 'skills', skillId, 'SKILL.md');
      const content = await fs.promises.readFile(mdPath, 'utf8');
      
      // Return with correct content type for markdown
      return new NextResponse(content, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    } catch (err) {
      // If SKILL.md doesn't exist, generate one from skill data
      const skill = skillExists;
      const generatedSkillMd = generateSkillMd(skill);
      
      return new NextResponse(generatedSkillMd, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }
  } catch (error) {
    console.error('Edge Gallery SKILL.md error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/**
 * Generate SKILL.md content for Edge Gallery format
 * If no file exists, create it dynamically from skill data
 */
function generateSkillMd(skill: any): string {
  const examples = getSkillExamples(skill.id);
  const instructions = getSkillInstructions(skill.id);
  
  return `---
name: ${skill.name}
description: ${skill.desc}
metadata:
  icon: ${skill.icon}
  category: ${skill.category || 'General'}
  free: ${skill.free ? 'true' : 'false'}
  homepage: https://agentboost-seven.vercel.app/skills/${skill.id}
---

# ${skill.icon} ${skill.name}

${skill.desc}

---

## What This Skill Does

${instructions.overview}

### Key Capabilities
${skill.benefits.map((benefit: string) => `- ✓ ${benefit}`).join('\n')}

---

## How to Use in Edge Gallery

### Step 1: Ask the Model
Simply chat with the model naturally about your needs. The model will automatically invoke this skill when relevant.

### Step 2: Provide Information
The skill will guide you through what information it needs (example below).

### Step 3: Get Results
The skill will return actionable insights, recommendations, or outputs.

---

## Example Prompts

Try asking the model one of these:

${examples.prompts.map((prompt: string, idx: number) => `**${idx + 1}. "${prompt}"**`).join('\n\n')}

---

## What to Expect

${examples.expectedOutput}

---

## Skill Details

- **Category:** ${skill.category || 'General'}
- **Type:** ${skill.free ? '🟢 Free (Always Accessible)' : '🔵 Premium (Enterprise Plan)'}
- **Model Required:** Works with Gemma 4 and compatible LLMs
- **Response Time:** 2-10 seconds typically
- **Requires Internet:** No (100% on-device)

---

## Pro Tips

${instructions.proTips.join('\n')}

---

## Detailed Instructions

${instructions.detailed}

---

## More Information

- **Full Documentation:** https://agentboost-seven.vercel.app/skills/${skill.id}
- **Platform:** AgentBoost (https://agentboost-seven.vercel.app)
- **GitHub:** https://github.com/google-ai-edge/gallery
`;
}

function getSkillExamples(skillId: string): any {
  const examples: { [key: string]: any } = {
    'lead-qualifier': {
      prompts: [
        'Score this lead: Tech founder, $500k budget, needs CRM, Q2 timeline, decision maker, pain point is sales efficiency',
        'Is this a qualified lead? Enterprise company, executive sponsor, AI procurement, budget unclear, long approval process',
        'Use MEDDIC to analyze: Mid-market SaaS buyer, strong need for automation, executive champion identified, 30-day cycle',
      ],
      expectedOutput: `**Output Example:**
\`\`\`
LEAD SCORE: 82/100 ✓ Qualified

BANT Analysis:
- Budget: ✓ Confirmed ($500k)
- Authority: ✓ Decision Maker Present
- Need: ✓ Clear (Sales Efficiency)
- Timeline: ✓ Q2 (90 days)

Recommendation: PROCEED TO DISCOVERY
Next Step: Schedule executive briefing
\`\``
    },

    'meeting-scheduler': {
      prompts: [
        'Schedule a meeting with the sales team next Tuesday at 2pm',
        'Find a time that works for me, Sarah, and Mike this week',
        'Set up a 1-hour sync with John between 9am-5pm any day this week',
      ],
      expectedOutput: `**Output Example:**
\`\`\`
✓ Meeting Scheduled

Date: Tuesday, April 22, 2025
Time: 2:00 PM - 2:30 PM
Duration: 30 minutes
Attendees: You, Sarah, Mike (3 people)
Platform: Google Meet
Reminder: 15 minutes before

Agenda: Sales Team Sync
\`\``
    },

    'linkedin-pro': {
      prompts: [
        'Write a LinkedIn post about AI trends that will get engagement',
        'Create viral social copy about remote work best practices',
        'Generate 3 LinkedIn post ideas for thought leadership, all with hooks',
      ],
      expectedOutput: `**Output Example:**
\`\`\`
📱 LinkedIn Post (Viral Hook):

"I spent 10 years in corporate. Here's what nobody tells you about remote work..."

[Opens with curiosity, builds value, ends with CTA]

Estimated Engagement: 🔥 8.5% CTR
Best Time to Post: Tuesday 8am EST

A/B Test Variant (Casual Tone):
"Remote work isn't the future. It's the NOW. Here's how to nail it..."
\`\``
    },

    'real-estate': {
      prompts: [
        'Analyze this deal: $2M purchase price, estimated $15k monthly rent',
        'Is this a good investment? Cap rate above 7%?',
        'Calculate ROI for: $800k property, $8k monthly income',
      ],
      expectedOutput: `**Output Example:**
\`\`\`
💰 Real Estate Analysis

Purchase Price: $2,000,000
Monthly Rent: $15,000
Annual Rent: $180,000

CAP RATE: 9.0% ✓ EXCELLENT

Analysis:
- Market Average: 5-7%
- Your Property: 9.0% (Above Market)
- Status: STRONG INVESTMENT

Recommendation: PROCEED TO DUE DILIGENCE
\`\``
    },

    'crypto': {
      prompts: [
        'Analyze Bitcoin volatility - suggest option strategy for current market',
        'Calculate Greeks for $65k BTC calls expiring in 7 days',
        'What hedge would protect a long Bitcoin position?',
      ],
      expectedOutput: `**Output Example:**
\`\`\`
📈 Crypto Options Analysis (BTC)

Current Price: $65,000
IV Rank: 78th Percentile (HIGH)
Expiration: 7 days

Recommended Strategy: Iron Condor
- Sell 65,500 Call (Premium: $320)
- Buy 66,500 Call  (Premium: $150)
- Sell 64,500 Put  (Premium: $310)
- Buy 63,500 Put   (Premium: $140)

Max Profit: $540 (Theta Decay optimal)
Greeks: Theta Positive ✓
\`\``
    },

    'bidding-engine': {
      prompts: [
        'Set competitive pricing for $50k project with 30% margin requirement',
        'Generate bid for RFQ: 3-month timeline, 5 competitors expected',
        'What should we bid to win without leaving money on the table?',
      ],
      expectedOutput: `**Output Example:**
\`\`\`
💼 Bid Analysis

Project Value: $50,000
Margin Target: 30%
Cost Base: $35,000

RECOMMENDED BID: $47,500

Strategy:
- Positions us 8% below market
- Maintains 35.7% margin ✓
- Win probability: 78%

Alt Bid (Premium): $52,000 (48.6% margin)
\`\``
    },

    'b2b-leads': {
      prompts: [
        'Find marketing directors at tech companies in SF',
        'Extract decision-makers from healthcare industry, $1B+ revenue',
        'Get CFOs from SaaS companies in NYC area',
      ],
      expectedOutput: `**Output Example:**
\`\`\`
👥 B2B Leads Found: 12

Top Results:
1. Jane Smith - VP Marketing at TechCorp
   Email: jane@techcorp.com
   Region: San Francisco
   Confidence: 98%

2. John Chen - Marketing Director at CloudInnovate
   Email: john@cloudinnovate.com
   Region: Mountain View
   Confidence: 96%

[+ 10 more verified leads]

Verified Accuracy: 98%
\`\``
    },

    'seo-audit': {
      prompts: [
        'Audit my website for SEO issues',
        'Check Core Web Vitals and identify bottlenecks',
        'Find technical SEO problems preventing ranking',
      ],
      expectedOutput: `**Output Example:**
\`\`\`
🔍 SEO Audit Report

Overall Health: 78/100

Core Web Vitals:
- LCP: 2.1s ✓ Good
- CLS: 0.14 ⚠️ Needs Work
- FID: 45ms ✓ Good

Top Issues Found:
1. Missing alt tags on 23 images (-12 pts)
2. Duplicate H1 on index page (-8 pts)
3. Slow server response (2.4s) (-6 pts)

Quick Wins (implement first):
- Add alt tags: +12 points
- Optimize images: +8 points

Estimated Impact: +40 rankings
\`\``
    },
  };

  return examples[skillId] || {
    prompts: [
      'What can you help me with?',
      'Show me an example of how to use this skill',
      'What information do you need from me?',
    ],
    expectedOutput: `**Output Example:**
\`\`\`
The skill will analyze your input and provide:
- Specific insights or recommendations
- Actionable next steps
- Relevant metrics or calculations
\`\``
  };
}

function getSkillInstructions(skillId: string): any {
  const instructions: { [key: string]: any } = {
    'lead-qualifier': {
      overview: 'Analyzes potential sales leads using proven qualification frameworks (BANT and MEDDIC) to determine sales-readiness.',
      proTips: [
        '💡 Provide as much detail as possible - the more info, the better the score',
        '💡 Use exact budget figures when known (e.g., "$500k" not "large budget")',
        '💡 Timeline is critical - specific dates improve accuracy',
        '💡 Ask for MEDDIC analysis for complex enterprise deals',
      ],
      detailed: `
## BANT Framework
- **Budget:** Is there actual budget allocated?
- **Authority:** Is the person a decision maker?
- **Need:** Is there a clear business pain point?
- **Timeline:** When do they plan to buy?

## MEDDIC Framework (for larger deals)
- **Metrics:** What success looks like
- **Economic Buyer:** Who controls budget
- **Decision Criteria:** What factors matter most
- **Decision Process:** How will they decide
- **Identify Pain:** What problems they face
- **Champion:** Who advocates internally

## How to Use
1. Describe the prospect/company
2. Include budget, authority, need, timeline
3. Skill returns 0-100 qualification score
4. Follow the recommendation (score > 70 = qualified)
      `
    },

    'linkedin-pro': {
      overview: 'Generates engaging, viral-ready LinkedIn content optimized for professional audience engagement and thought leadership.',
      proTips: [
        '🎯 Include your tone preference: "professional", "casual", "witty", or "inspirational"',
        '🎯 Specify your audience: "founders", "marketers", "engineers", "executives"',
        '🎯 Ask for A/B test variants to compare engagement',
        '🎯 Request posting time suggestions for maximum reach',
      ],
      detailed: `
## Best Practices
- Hook in first line (emotional or curious)
- Build context (story or relatable moment)
- Deliver promise (value, insight, lesson)
- End with call-to-action (like, comment, follow)

## Tone Options
- Professional: For B2B/corporate content
- Casual: Friendly, approachable, relatable
- Witty: Clever wordplay, humor
- Inspirational: Motivational, aspirational

## Content Types
- Personal stories (highest engagement)
- Industry insights (credibility)
- Contrarian takes (virality)
- Lessons learned (value)

## Engagement Metrics
- Posts with hooks: 2-3x more clicks
- 150-200 characters: optimal length
- Tuesday 8am EST: best posting time
- Questions at end: +40% comments
      `
    },

    'real-estate': {
      overview: 'Analyzes commercial real estate investments with precision underwriting, calculating Cap Rates, ROI, and investment viability.',
      proTips: [
        '🏠 Always provide: purchase price, monthly rent, property type',
        '🏠 Cap Rate > 7% = strong investment, < 5% = buyer beware',
        '🏠 Include closing costs for accurate ROI (usually 5-10%)',
        '🏠 Ask for "market comparison" to see local averages',
      ],
      detailed: `
## Key Metrics
- **Cap Rate:** (Annual Rent / Purchase Price) × 100
  - Formula: (Monthly Rent × 12) / Price
  - Market avg: 5-7%
  - > 7% = Strong deal

- **Cash-on-Cash Return:** Annual Cash Flow / Initial Investment
- **Debt Service Coverage:** Annual Revenue / Annual Debt Payment

## Red Flags
- Cap rate below 5% (overpriced)
- Unclear tenant credit
- Major repairs needed soon
- Market vacancy above 10%

## Green Lights
- Cap rate 7-12% = solid
- Stable tenants (3+ years)
- Growth area with strong fundamentals
- Below market rent (upside potential)

## Due Diligence Checklist
1. Verify rental income
2. Check tenant credit
3. Inspect property condition
4. Research neighborhood trends
5. Get professional appraisal
      `
    },

    'crypto': {
      overview: 'Institutional-grade quantitative analysis for crypto options and volatility, with Greeks tracking and hedging strategies.',
      proTips: [
        '📊 Provide current price, IV rank, and timeframe needed',
        '📊 Delta-Neutral = no directional bias, pure volatility play',
        '📊 Theta positive = profit from time decay (your friend)',
        '📊 Ask for "risk scenarios" to understand max loss potential',
      ],
      detailed: `
## Greeks Explained
- **Delta:** How much price moves with $1 change (0-100)
- **Gamma:** Rate of Delta change (stability)
- **Theta:** Daily profit from time decay (+good)
- **Vega:** Sensitivity to volatility changes
- **Rho:** Sensitivity to interest rates

## Strategy Types
- **Iron Condor:** Sell volatility, limited risk
- **Straddle:** Profit from big moves either direction
- **Butterfly Spread:** Low risk, defined profit zone
- **Calendar Spread:** Profit from time decay

## Risk Management
- Max loss = premium difference × contract size
- Always use stops for directional positions
- IV Rank > 75% = good for selling vol
- IV Rank < 25% = good for buying vol

## Entry Signals
- IV rank increasing = sell vol
- IV rank decreasing = buy vol
- Support/resistance breaks = direction play
      `
    },

    'bidding-engine': {
      overview: 'Strategic pricing and RFQ response generation with margin optimization and competitive positioning analysis.',
      proTips: [
        '💰 Specify: project scope, timeline, number of competitors',
        '💰 Margin target matters: higher = less competition, lower = more wins',
        '💰 Ask for "scenario analysis" to test different bid prices',
        '💰 Request "competitor intelligence" if you know market rates',
      ],
      detailed: `
## Bidding Strategy Elements
- **Cost Base:** Starting point (internal costs)
- **Margin %:** Profit as percentage of cost
- **Market Rate:** What competitors typically bid
- **Win Probability:** Estimated chance at this price

## Positioning Options
1. **Aggressive:** 5-15% below market (high volume strategy)
2. **Competitive:** At or slightly below market (balanced)
3. **Premium:** 10-20% above market (differentiation/quality)

## Factors Affecting Bid
- Timeline urgency (tighter = more expensive)
- Competition count (more = sharper pricing)
- Your track record (established = can bid premium)
- Client budget signals (known vs unknown)

## Tips for Winning
- Bid to win, not every deal
- Premium quality justifies premium price
- Build relationships, not just low bids
- Focus on value, not just price
      `
    },

    'b2b-leads': {
      overview: 'Verified B2B decision-maker extraction with direct contact data and high email verification confidence.',
      proTips: [
        '🔍 Be specific: company size, industry, location, role',
        '🔍 Provide company URL or domain name when possible',
        '🔍 Request "export to spreadsheet" for CRM integration',
        '🔍 Ask for "verification report" to confirm data accuracy',
      ],
      detailed: `
## Qualification Criteria
- **Company Size:** Revenue, employees, industry
- **Title/Role:** Marketing director, CFO, VP, etc
- **Geographic:** Specific regions or remote
- **Industry Vertical:** Tech, Healthcare, Finance, etc

## Verification Confidence
- 98%+ = Direct-dial verified
- 95%+ = LinkedIn cross-confirmed
- 90%+ = Domain-based (high confidence)
- 85%+ = GeoIP validated

## Export Options
- CSV for Excel/Sheets
- CRM format (Salesforce/HubSpot ready)
- Email list format
- spreadsheet with all contact data

## Next Steps
1. Export results to your CRM
2. Personalize outreach (use their content)
3. Reference mutual connections if possible
4. Track responses and engagement
      `
    },

    'seo-audit': {
      overview: 'Technical SEO health assessment with Core Web Vitals audit, identifying ranking bottlenecks and quick-win improvements.',
      proTips: [
        '🚀 Provide your website URL',
        '🚀 Core Web Vitals matter most for Google ranking (LCP, CLS, FID)',
        '🚀 Ask for "quick wins" to implement immediately',
        '🚀 Focus on high-impact fixes first (usually 20% of work = 80% of gains)',
      ],
      detailed: `
## Core Web Vitals (Google Ranking Factors)
- **LCP (Largest Contentful Paint):** < 2.5s (good)
- **CLS (Cumulative Layout Shift):** < 0.1 (good)
- **FID (First Input Delay):** < 100ms (good)

## Technical Audit Areas
1. Meta tags (Title, Description)
2. Header structure (H1, H2, H3 hierarchy)
3. Image optimization (alt text, file size)
4. Site speed (server response, compression)
5. Mobile responsiveness
6. XML sitemap submission
7. Robots.txt configuration
8. Duplicate content issues

## Quick Wins (Implement First)
- Add missing alt tags
- Compress images
- Remove unused CSS/JS
- Enable caching
- Fix duplicate content

## Expected Results
- 20-40% speed improvement
- +5-15 ranking positions
- Better mobile usability
- Higher click-through rate
      `
    },
  };

  return instructions[skillId] || {
    overview: 'This skill provides expert analysis and recommendations.',
    proTips: [
      '💡 Provide detailed context for better results',
      '💡 Ask follow-up questions for clarification',
      '💡 Request specific output formats when needed',
    ],
    detailed: 'Use this skill to get expert guidance on specialized topics. The more specific your input, the better the output.'
  };
}
