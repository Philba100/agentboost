import { NextResponse } from 'next/server';
import skills from '@/app/lib/skillsData';

/**
 * EDGE GALLERY SKILL DIRECTORY ENDPOINT
 * Lists all available skills and their metadata
 * 
 * This endpoint enables Edge Gallery to discover all AgentBoost skills
 * Returns JSON that can be used for:
 * 1. Skill discovery and browsing
 * 2. Batch importing multiple skills
 * 3. API integration with Edge Gallery
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const free = searchParams.get('free');
    const format = searchParams.get('format') || 'json'; // 'json' or 'markdown'

    // Filter skills
    let filtered = [...skills];

    if (category) {
      filtered = filtered.filter(s => (s.category || 'General') === category);
    }

    if (free === 'true') {
      filtered = filtered.filter(s => s.free === true);
    } else if (free === 'false') {
      filtered = filtered.filter(s => s.free !== true);
    }

    if (format === 'markdown') {
      // Return markdown listing
      let markdown = `# AgentBoost Skills Directory\n\n`;
      markdown += `**Available Skills: ${filtered.length}** (Free: ${filtered.filter(s => s.free).length} | Premium: ${filtered.filter(s => !s.free).length})\n\n`;

      // Group by category
      const categories = new Set(filtered.map(s => s.category || 'General'));
      for (const cat of categories) {
        markdown += `## ${cat}\n\n`;
        const catSkills = filtered.filter(s => (s.category || 'General') === cat);
        for (const skill of catSkills) {
          markdown += `### ${skill.icon} ${skill.name}\n`;
          markdown += `${skill.desc}\n\n`;
          markdown += `- **Type:** ${skill.free ? '🟢 Free' : '🔵 Premium'}\n`;
          markdown += `- **URL:** https://agentboost-seven.vercel.app/api/edge-gallery/skill-md?skillId=${skill.id}\n`;
          markdown += `- **Docs:** https://agentboost-seven.vercel.app/skills/${skill.id}\n\n`;
        }
      }

      return new NextResponse(markdown, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
        }
      });
    }

    // Return JSON (default)
    const skillsList = filtered.map(skill => ({
      id: skill.id,
      name: skill.name,
      description: skill.desc,
      icon: skill.icon,
      category: skill.category || 'General',
      free: skill.free,
      benefits: skill.benefits,
      skillMdUrl: `https://agentboost-seven.vercel.app/api/edge-gallery/skill-md?skillId=${skill.id}`,
      docsUrl: `https://agentboost-seven.vercel.app/skills/${skill.id}`
    }));

    return NextResponse.json({
      success: true,
      platform: 'AgentBoost',
      version: '1.0',
      totalSkills: skillsList.length,
      freeSkills: filtered.filter(s => s.free).length,
      premiumSkills: filtered.filter(s => !s.free).length,
      categories: Array.from(new Set(filtered.map(s => s.category || 'General'))),
      skills: skillsList
    });
  } catch (error) {
    console.error('Edge Gallery directory error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
