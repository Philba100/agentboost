"use client";

import '../global-agent.css';
import { useState } from 'react';
import UpgradeModal from '../components/UpgradeModal';
import { trackUpgrade } from '../lib/track';

export default function Page(){
  const [open, setOpen] = useState(false);
  const skill = { id: 'bidding-engine', name: 'Bidding Engine' };

  const openModal = () => {
    try { trackUpgrade(skill.id); } catch (e) {}
    setOpen(true);
  };

  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>Bidding Engine</h1>
        <p className="agent-sub">Dynamic pricing, RFQ responses, and margin-optimized proposals.</p>
      </header>

      <section className="agent-card">
        <h2>Features</h2>
        <p className="meta">Competitive bidding and proposal generation.</p>
        <div className="actions">
          <a className="btn" href="../../skills/bidding-engine/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/bidding-engine/scripts/index.html">Demo</a>
        </div>
      </section>
      
      <section className="agent-card">
        <h2>Margin Optimization & Scenario Analysis</h2>
        <p className="meta">Automatically generate bids optimized for margin, run scenario analysis, and produce RFQ-ready proposals.</p>
        <ul className="meta" style={{marginTop:8}}>
          <li>Margin optimization</li>
          <li>Scenario analysis</li>
          <li>Auto-generated proposals</li>
        </ul>
        <div className="actions">
          <button className="btn" onClick={openModal}>Upgrade to Pro</button>
        </div>
      </section>

      <UpgradeModal open={open} onClose={() => setOpen(false)} skill={skill} />
    </main>
  );
}
