"use client";

import '../global-agent.css';
import { useState } from 'react';
import UpgradeModal from '../components/UpgradeModal';
import { trackUpgrade } from '../lib/track';

export default function Page(){
  const [open, setOpen] = useState(false);
  const skill = { id: 'negotiation-engine', name: 'Negotiation Engine' };

  const openModal = () => {
    try { trackUpgrade(skill.id); } catch (e) {}
    setOpen(true);
  };

  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>Negotiation Engine</h1>
        <p className="agent-sub">AI-powered objection handling, concession sequencing, and ROI impact analysis.</p>
      </header>

      <section className="agent-card">
        <h2>Features</h2>
        <p className="meta">Enterprise deal negotiation support.</p>
        <div className="actions">
          <a className="btn" href="../../skills/negotiation-engine/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/negotiation-engine/scripts/index.html">Demo</a>
        </div>
      </section>
      
      <section className="agent-card">
        <h2>Concession Sequencing & Audit Trail</h2>
        <p className="meta">Handle objections with optimal concession strategies, calculate ROI impact, and maintain full audit trail.</p>
        <ul className="meta" style={{marginTop:8}}>
          <li>Concession sequencing</li>
          <li>ROI impact calculations</li>
          <li>Complete audit trail</li>
        </ul>
        <div className="actions">
          <button className="btn" onClick={openModal}>Upgrade to Pro</button>
        </div>
      </section>

      <UpgradeModal open={open} onClose={() => setOpen(false)} skill={skill} />
    </main>
  );
}
