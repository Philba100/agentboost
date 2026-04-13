"use client";

export async function trackUpgrade(skillId: string) {
  if (typeof window === 'undefined') return;
  try {
    await fetch('/api/track-upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillId, ts: Date.now(), path: window.location.pathname })
    }).catch(() => {});
  } catch (e) {
    // swallow errors - tracking is best-effort
    // eslint-disable-next-line no-console
    console.warn('track failed', e);
  }
}
