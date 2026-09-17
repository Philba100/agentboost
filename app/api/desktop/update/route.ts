import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const currentVersion = searchParams.get('current') || '0.1.0';

  // Set to 0.1.1 for ongoing testing and development builds
  const latestVersion = '0.1.1';
  const hasUpdate = isNewerVersion(currentVersion, latestVersion);

  const updatePayload = {
    update_available: hasUpdate,
    current_version: currentVersion,
    latest_version: latestVersion,
    release_date: new Date().toISOString().split('T')[0],
    critical_security_patch: false,
    download_url:
      'https://lewgsyjntzsqfxdtkcin.supabase.co/storage/v1/object/public/installers/AgentBoost_0.1.0_x64_en-US.msi',
    fallback_exe_url:
      'https://lewgsyjntzsqfxdtkcin.supabase.co/storage/v1/object/public/installers/agentboost.exe',
    release_notes: [
      'Testing & Dev Build (v0.1.1): Internal release for workstation validation.',
      'Autonomous Fleet Integration: Verified Web Intel Scout, Email Processor, Supplier Negotiator, and Task Follow-Up Sentinel.',
      'Local Inference Bridge: Enhanced auto-reconnect and health checks for LM Studio and Gemma 4.',
      'In-App Installer Test: Verified native package download and installation pipeline.'
    ]
  };

  return NextResponse.json(updatePayload, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache'
    }
  });
}

function isNewerVersion(current: string, target: string): boolean {
  const clean = (v: string) => v.replace(/^v/, '').split('.').map(Number);
  const [cMaj = 0, cMin = 0, cPatch = 0] = clean(current);
  const [tMaj = 0, tMin = 0, tPatch = 0] = clean(target);

  if (tMaj > cMaj) return true;
  if (tMaj === cMaj && tMin > cMin) return true;
  if (tMaj === cMaj && tMin === cMin && tPatch > cPatch) return true;
  return false;
}