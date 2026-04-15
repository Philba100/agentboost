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

## How to Use

This is an AgentBoost skill. Chat with the model about tasks related to:
${skill.benefits.map((benefit: string) => `- ${benefit}`).join('\n')}

The model will use this skill's knowledge and capabilities to help you.

## Category
**${skill.category || 'General'}** ${!skill.free ? ' (Premium)' : ' (Free)'}

## More Information
- View full documentation: https://agentboost-seven.vercel.app/skills/${skill.id}
- AgentBoost Platform: https://agentboost-seven.vercel.app
`;
}
