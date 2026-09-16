import { NextResponse } from 'next/server';
import { executeSkill } from '@/lib/executor';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Token',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { skill, data = {}, callback_url } = body;

    if (!skill) {
      return NextResponse.json(
        { error: 'Missing parameter: "skill" is required.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Execute skill deterministically
    const result = await executeSkill(skill, data);

    // If client system specified a webhook callback, dispatch response asynchronously
    if (callback_url) {
      fetch(callback_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      }).catch((err) => console.warn('Callback dispatch warning:', err.message));
    }

    return NextResponse.json(
      {
        status: 'AUTOMATION_COMPLETED',
        executed_by: 'AgentBoost Desktop Runner',
        result
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Client automation processing failure' },
      { status: 500, headers: corsHeaders }
    );
  }
}