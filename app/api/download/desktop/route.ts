import { NextResponse } from 'next/server';

const DOWNLOAD_URL =
  'https://lewgsyjntzsqfxdtkcin.supabase.co/storage/v1/object/public/installers/agentboost.exe';

export async function GET() {
  return NextResponse.redirect(DOWNLOAD_URL, {
    status: 307,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
  });
}