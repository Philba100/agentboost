import { NextResponse } from 'next/server';
import { generateCorporateDocument } from '@/lib/documents/generator';
import { executeSkill } from '@/lib/executor';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { document_type, skill_id, parameters = {}, format = 'json' } = body;

    if (!document_type) {
      return NextResponse.json(
        { error: 'Missing parameter: "document_type" is required.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 1. Run the deterministic calculation engine first if a skill is provided
    let calculationPayload = parameters;
    if (skill_id) {
      const execResult = await executeSkill(skill_id, parameters);
      calculationPayload = { ...parameters, ...execResult.data };
    }

    // 2. Synthesize official document from the calculated data
    const document = generateCorporateDocument(document_type, calculationPayload);

    // 3. Return as direct downloadable file or JSON payload
    if (format === 'html') {
      return new NextResponse(document.content_html, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': `attachment; filename="${document.filename.replace('.md', '.html')}"`
        }
      });
    }

    if (format === 'markdown') {
      return new NextResponse(document.content_markdown, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': `attachment; filename="${document.filename}"`
        }
      });
    }

    return NextResponse.json(
      {
        success: true,
        document
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Document generation failure' },
      { status: 500, headers: corsHeaders }
    );
  }
}