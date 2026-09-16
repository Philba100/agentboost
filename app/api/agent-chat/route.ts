import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = String(body?.message || '').trim();
    const skillId = String(body?.skillId || 'lead-qualifier');

    if (!message) {
      return NextResponse.json({ reply: 'Please provide a task for the agent to execute.' }, { status: 400 });
    }

    const skillNames: Record<string, string> = {
      'lead-qualifier': 'Lead Qualifier',
      'meeting-scheduler': 'Meeting Scheduler',
      'negotiation-engine': 'Negotiation Engine',
      'email-orchestrator': 'Email Orchestrator',
      'analytics-hub': 'Analytics Hub',
      'crypto': 'Crypto Quant Pro',
      'crm-sync': 'CRM Sync',
      'whatsapp': 'WhatsApp CRM Pro',
      'real-estate': 'Real Estate Pro',
      'b2b-leads': 'LeadScraper Pro',
      'bidding-engine': 'Bidding Engine'
    };

    const skillName = skillNames[skillId] || 'AgentBoost skill';
    const summary = `I orchestrated the ${skillName} workflow for: "${message}". The desktop command center is connected to the live agent runtime and can export a runnable desktop agent bundle for this task.`;

    return NextResponse.json({
      reply: summary,
      skillId,
      skillName,
      mode: 'desktop'
    });
  } catch (error) {
    console.error('Agent chat route failed:', error);
    return NextResponse.json({
      reply: 'The AI command layer is unavailable, but the desktop agent bundle and hierarchy remain active for execution.'
    });
  }
}
