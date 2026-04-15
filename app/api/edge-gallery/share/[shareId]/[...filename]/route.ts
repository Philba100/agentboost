import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import fs from 'fs';
import path from 'path';
import skills from '@/app/lib/skillsData';

/**
 * SHARE LINK EDGE GALLERY ENDPOINT
 * Serves skills via share links in Edge Gallery format
 * 
 * URL: /api/edge-gallery/share/[shareId]/[filename]
 * Example: /api/edge-gallery/share/klwyrrw8-2unh-kf5b-zupv-yk5vp398e19b/SKILL.md
 * 
 * This allows Edge Gallery to directly load skills from share links
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ shareId: string; filename?: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const { shareId, filename } = resolvedParams;

    if (!shareId) {
      return NextResponse.json({ error: 'Share ID is required' }, { status: 400 });
    }

    // Look up the share link in database
    const { data: shareLink, error: shareError } = await supabaseAdmin
      .from('share_links')
      .select('skill_id, expires_at')
      .eq('share_id', shareId)
      .single();

    if (shareError || !shareLink) {
      return NextResponse.json(
        { error: 'Share link not found' },
        { status: 404 }
      );
    }

    // Check if link has expired
    if (shareLink.expires_at) {
      const expirationDate = new Date(shareLink.expires_at);
      if (new Date() > expirationDate) {
        return NextResponse.json(
          { error: 'Share link has expired' },
          { status: 403 }
        );
      }
    }

    const skillId = shareLink.skill_id;
    const skill = skills.find(s => s.id === skillId);

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    // Determine which file to serve
    const requestedFile = filename ? filename[0] : 'SKILL.md';

    // Security: Only allow serving specific files for Edge Gallery
    const allowedFiles = ['SKILL.md', 'index.html', 'icon.png', 'icon.svg'];
    if (!allowedFiles.includes(requestedFile)) {
      return NextResponse.json(
        { error: 'File not allowed' },
        { status: 403 }
      );
    }

    // Try to serve from skills folder
    try {
      const skillPath = path.join(process.cwd(), 'skills', skillId, requestedFile);
      const content = await fs.promises.readFile(skillPath, 'utf8');

      let contentType = 'text/plain';
      if (requestedFile === 'SKILL.md') contentType = 'text/markdown';
      else if (requestedFile === 'index.html') contentType = 'text/html';
      else if (requestedFile === 'icon.png') contentType = 'image/png';
      else if (requestedFile === 'icon.svg') contentType = 'image/svg+xml';

      return new NextResponse(content, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600',
          'X-Shared-By': shareId,
        }
      });
    } catch (err) {
      // If file doesn't exist, generate SKILL.md
      if (requestedFile === 'SKILL.md') {
        const skillMdContent = generateSkillMd(skill);
        return new NextResponse(skillMdContent, {
          status: 200,
          headers: {
            'Content-Type': 'text/markdown',
            'Cache-Control': 'public, max-age=3600',
            'X-Shared-By': shareId,
          }
        });
      }

      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Share link Edge Gallery error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

function generateSkillMd(skill: any): string {
  return `---
name: ${skill.name}
description: ${skill.desc}
metadata:
  icon: ${skill.icon}
  category: ${skill.category || 'General'}
  free: ${skill.free ? 'true' : 'false'}
  homepage: https://agentboost-seven.vercel.app/skills/${skill.id}
---

# ${skill.name}

## Overview
${skill.desc}

### Key Features
${skill.benefits.map((benefit: string) => `- ✓ ${benefit}`).join('\n')}

## Instructions

${getSkillInstructions(skill.id)}

## How to Access
- Full documentation: https://agentboost-seven.vercel.app/skills/${skill.id}
- Dashboard: https://agentboost-seven.vercel.app/dashboard?skill=${skill.id}

## Category
**${skill.category || 'General'}** ${!skill.free ? ' (Premium)' : ' (Free)'}
`;
}

function getSkillInstructions(skillId: string): string {
  const instructions: { [key: string]: string } = {
    'lead-qualifier': `You are a lead qualification expert. When users provide information about potential leads, analyze them using BANT or MEDDIC frameworks:
- **Budget**: Does the prospect have budget?
- **Authority**: Is this the decision maker?
- **Need**: Do they have a clear need?
- **Timeline**: When do they need to buy?
- **Decision Criteria**: What factors influence their decision?
- **Identify Pain**: What problems do they face?
- **Economic Impact**: What's the financial impact?
- **Decision Process**: How will they decide?
- **Decision Criteria**: What matters most?

Provide a qualification score (0-100) and recommended next steps.`,

    'bidding-engine': `You are a pricing and bidding strategist. When users ask about pricing strategies, RFQ responses, or bids:
1. Analyze margin requirements
2. Consider market conditions
3. Suggest competitive pricing
4. Provide scenario analysis
5. Generate proposals

Help users maximize profits while remaining competitive.`,

    'real-estate': `You are a real estate investment analyst. When users provide property information:
1. Calculate Cap Rate = (Annual Rent × 12) / Purchase Price
2. Analyze ROI and cash flow
3. Compare to market benchmarks
4. Assess investment viability
5. Provide underwriting recommendations

Formula: Cap Rate = (Monthly Rent × 12) / Purchase Price`,

    'linkedin-pro': `You are a LinkedIn copywriter specialist. Help users create viral, high-converting social media content:
1. Craft scroll-stopping hooks
2. Tell compelling stories
3. End with call-to-action
4. Test different tones (professional, casual, witty)
5. Optimize for engagement

Create content that resonates with professionals and drives business results.`,

    'crypto': `You are a cryptocurrency options and volatility analyst. When users ask about crypto strategies:
1. Analyze implied volatility (IV)
2. Calculate Greeks (Delta, Gamma, Theta, Vega)
3. Suggest option strategies
4. Assess risk/reward
5. Provide hedge recommendations

Focus on institutional-grade quantitative analysis.`
  };

  return instructions[skillId] || `You are an expert in ${skillId.replace(/-/g, ' ')}. Provide valuable insights and actionable recommendations based on the user's needs.`;
}
