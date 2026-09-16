import { NextResponse } from 'next/server';
import { processAutonomousTender, TenderRequirements } from '@/lib/pipelines/tenderPipeline';

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
    const { tender, internal_cost_basis_usd } = body;

    if (!tender || !tender.rfq_id) {
      return NextResponse.json(
        { error: 'Invalid payload: "tender" object with "rfq_id" is required.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const tenderInput: TenderRequirements = {
      rfq_id: tender.rfq_id,
      client_organization: tender.client_organization || 'Enterprise Tendering Authority',
      scope_summary: tender.scope_summary || 'Multi-Tier Infrastructure & Automation Services',
      submission_deadline: tender.submission_deadline || new Date(Date.now() + 14 * 86400000).toISOString(),
      budget_ceiling_usd: Number(tender.budget_ceiling_usd) || 180000,
      mandatory_criteria: tender.mandatory_criteria || [
        '99.9% Uptime Guarantee',
        'ISO-27001 Certification',
        '5% Performance Bond Guarantee'
      ],
      bond_required_percent: Number(tender.bond_required_percent) || 5,
      delivery_timeline_weeks: Number(tender.delivery_timeline_weeks) || 8
    };

    const costBasis = Number(internal_cost_basis_usd) || 65000;

    // Execute complete intake pipeline deterministically
    const evaluation = processAutonomousTender(tenderInput, costBasis);

    return NextResponse.json(
      {
        success: true,
        evaluation
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Tender pipeline execution failed' },
      { status: 500, headers: corsHeaders }
    );
  }
}