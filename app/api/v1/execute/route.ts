import { NextResponse } from 'next/server';
import { executeSkill } from '@/lib/executor';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { skill, data = {} } = body;

    if (!skill) {
      return NextResponse.json({ error: 'Missing skill identifier' }, { status: 400 });
    }

    const result = await executeSkill(skill, data);

    return NextResponse.json({
      success: result.success,
      skill: result.skill,
      category: result.category,
      latency_ms: result.latency_ms,
      data: result.data
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Execution failed' },
      { status: 500 }
    );
  }
}