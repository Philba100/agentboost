import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get('platform') || 'windows';

  // Base GitHub release download URL for your repo
  const repoBase = 'https://github.com/Philba100/agentboost/releases/latest/download';
  const releasesPage = 'https://github.com/Philba100/agentboost/releases/latest';

  let targetAsset = releasesPage;

  switch (platform.toLowerCase()) {
    case 'windows':
    case 'win':
      // Direct Windows MSI installer
      targetAsset = `${repoBase}/AgentBoost_0.1.0_x64_en-US.msi`;
      break;
    case 'mac':
    case 'macos':
    case 'darwin':
      // Direct macOS DMG bundle
      targetAsset = `${repoBase}/AgentBoost_0.1.0_x64.dmg`;
      break;
    case 'linux':
      // Direct Linux AppImage / deb
      targetAsset = `${repoBase}/agentboost_0.1.0_amd64.AppImage`;
      break;
    default:
      targetAsset = releasesPage;
  }

  return NextResponse.redirect(targetAsset, 302);
}