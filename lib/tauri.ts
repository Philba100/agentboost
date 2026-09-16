/**
 * TAURI UTILITIES
 * Safely handle Tauri interactions with type checks and graceful fallbacks.
 */

export async function isTauri(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  // @ts-ignore
  return !!window.__TAURI_INTERNALS__;
}

export async function openExternalUrl(url: string): Promise<void> {
  if (typeof window === 'undefined') return;

  const inTauri = await isTauri();

  if (inTauri) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('plugin:shell|open', { path: url });
      return;
    } catch (error) {
      console.warn('Tauri shell.open bypassed, using standard browser fallback:', error);
    }
  }

  // Resilient browser fallback
  window.open(url, '_blank', 'noopener,noreferrer');
}

export async function spawnAgent(skillId: string, name: string) {
  if (typeof window === 'undefined') return;

  const currentUrl = new URL(window.location.href);
  if (currentUrl.searchParams.get('mode') === 'desktop') {
    return;
  }

  try {
    const { invoke } = await import('@tauri-apps/api/core');
    await invoke('spawn_agent', { skillId, name });
  } catch (error) {
    console.error('Failed to spawn agent window:', error);
    const existingWindow = window.open('', '_blank');
    if (existingWindow) {
      existingWindow.location.href = `/dashboard?skill=${encodeURIComponent(skillId)}`;
    }
  }
}

export async function openWorkspace(skillId: string, name: string) {
  if (typeof window === 'undefined') return false;

  const tauriRuntime = await isTauri();
  if (tauriRuntime) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('spawn_agent', { skillId, name });
      return true;
    } catch (error) {
      console.error('Native workspace launch failed, opening web workspace:', error);
    }
  }

  window.location.assign(`/dashboard?skill=${encodeURIComponent(skillId)}`);
  return true;
}

export async function downloadDesktopAgent(
  skillId: string,
  name: string,
  metadata: Record<string, unknown> = {}
): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    const tauriRuntime = await isTauri();
    if (tauriRuntime) {
      const { invoke } = await import('@tauri-apps/api/core');
      const savedPath = await invoke<string>('download_desktop_agent', {
        skillId,
        name,
        metadata: {
          ...metadata,
          desktopBundle: {
            mode: 'desktop',
            packageType: 'agent-bundle',
            bundleVersion: '1.0.0'
          },
          commandCenter: true,
          connectedAi: true,
          generatedAt: new Date().toISOString(),
          downloadedBy: 'AgentBoost Desktop Agent',
          hierarchy: ['AgentBoost', 'Operations', metadata.category || 'General', name]
        }
      });

      console.log('Desktop bundle saved to:', savedPath);
      return true;
    }
  } catch (error) {
    console.error('Native desktop download failed, falling back to browser download:', error);
  }

  const payload = {
    skillId,
    name,
    generatedAt: new Date().toISOString(),
    metadata,
    downloadedBy: 'AgentBoost Desktop Agent',
    hierarchy: ['AgentBoost', 'Operations', metadata.category || 'General', name],
    commandCenter: true,
    connectedAi: true,
    desktopBundle: {
      mode: 'desktop',
      packageType: 'agent-bundle',
      bundleVersion: '1.0.0'
    }
  };

  try {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${skillId === 'all' ? 'agentboost-desktop-fleet' : `${skillId}-desktop-agent`}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    return false;
  }
}