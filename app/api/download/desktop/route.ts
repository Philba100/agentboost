import { NextResponse } from 'next/server';

const MSI_DOWNLOAD_URL =
  'https://lewgsyjntzsqfxdtkcin.supabase.co/storage/v1/object/public/installers/AgentBoost_0.1.0_x64_en-US.msi';

export async function GET() {
  return NextResponse.redirect(MSI_DOWNLOAD_URL, {
    status: 307,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
    },
  });
}