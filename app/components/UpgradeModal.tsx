"use client";

import React from 'react';
import { trackUpgrade as track } from '../lib/track';

type Skill = { id?: string; name?: string } | null | undefined;

type Props = {
  open: boolean;
  onClose: () => void;
  skill?: Skill;
};

export default function UpgradeModal({ open, onClose, skill }: Props) {
  if (!open) return null;

  const handleUpgrade = async () => {
    try {
      await track(skill?.id || 'unknown');
    } catch (e) {
      // swallow tracking errors
    }
    // Redirect to login with the skill ID in next parameter
    const skillPath = skill?.id ? `/skills/${skill.id}` : '/dashboard';
    window.location.href = `/login?next=${encodeURIComponent(skillPath)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="bg-white rounded-xl p-6 w-[720px] max-w-[95%]">
        <h3 className="text-xl font-semibold mb-2">{skill?.name} — Free vs Pro</h3>
        <div className="grid grid-cols-2 gap-6 text-sm text-slate-700">
          <div>
            <h4 className="font-semibold">Free</h4>
            <ul className="mt-2 space-y-1">
              <li>• Basic functionality and demos</li>
              <li>• Low rate limits</li>
              <li>• No SLA or analytics</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Pro</h4>
            <ul className="mt-2 space-y-1">
              <li>• SLA-backed throughput and reliability</li>
              <li>• Multi-channel routing & integrations</li>
              <li>• Usage analytics, priority support & audit logs</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button className="btn outline" onClick={onClose}>Close</button>
          <button className="btn" onClick={handleUpgrade}>Upgrade to Pro</button>
        </div>
      </div>
    </div>
  );
}
