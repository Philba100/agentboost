import { NextResponse } from 'next/server';
import skills from '@/app/lib/skillsData';

/**
 * EDGE GALLERY SKILL METADATA ENDPOINT
 * Provides OpenAPI-compatible tool definitions for Google AI Edge Gallery
 * 
 * This endpoint returns skill metadata formatted for LiteRT-LM tool integration
 * so AgentBoost skills can be used as Agent Skills in Edge Gallery
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skillId = searchParams.get('skillId');
    const format = searchParams.get('format') || 'edge-gallery'; // 'edge-gallery' or 'openapi'

    if (!skillId) {
      // Return all skills metadata
      const skillsMetadata = skills.map(skill => ({
        id: skill.id,
        name: skill.name,
        description: skill.desc,
        icon: skill.icon,
        category: skill.category || 'General',
        free: skill.free,
        benefits: skill.benefits
      }));

      return NextResponse.json({
        success: true,
        skills: skillsMetadata,
        count: skillsMetadata.length
      });
    }

    // Get specific skill
    const skill = skills.find(s => s.id === skillId);
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    if (format === 'openapi') {
      // Return OpenAPI format for tool definition
      return NextResponse.json({
        name: skill.id,
        description: skill.desc,
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The query or parameters for this skill'
            }
          },
          required: ['query']
        }
      });
    }

    // Return Edge Gallery format (default)
    return NextResponse.json({
      success: true,
      skill: {
        id: skill.id,
        name: skill.name,
        description: skill.desc,
        icon: skill.icon,
        category: skill.category || 'General',
        free: skill.free,
        benefits: skill.benefits,
        skillMdUrl: `/api/edge-gallery/skill-md?skillId=${skill.id}`,
        executeUrl: `/api/v1/execute`,
        docsUrl: `/skills/${skill.id}`
      }
    });
  } catch (error) {
    console.error('Edge Gallery metadata error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
