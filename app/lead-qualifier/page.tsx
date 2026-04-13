"use client";

import '../global-agent.css';
import { useState } from 'react';
import UpgradeModal from '../components/UpgradeModal';
import { trackUpgrade } from '../lib/track';

export default function Page(){
  const [open, setOpen] = useState(false);
  const skill = { id: 'lead-qualifier', name: 'Lead Qualifier' };

  const openModal = () => {
    try { trackUpgrade(skill.id); } catch (e) {}
    setOpen(true);
  };

  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>Lead Qualifier</h1>
        <p className="agent-sub">BANT/MEDDIC lead scoring and qualification with composite scoring and next-action recommendations.</p>
      </header>

      <section className="agent-card">
        <h2>Features</h2>
        <p className="meta">Enterprise-grade lead qualification powered by AI scoring.</p>
        <div className="actions">
          <a className="btn" href="../../skills/lead-qualifier/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/lead-qualifier/scripts/index.html">Demo</a>
        </div>
      </section>
      
      <section className="agent-card">
        <h2>Composite Scoring & CRM Integration</h2>
        <p className="meta">Automatically score leads using BANT/MEDDIC frameworks, generate next actions, and trigger CRM workflows.</p>
        <ul className="meta" style={{marginTop:8}}>
          <li>Composite score (0-100)</li>
          <li>Next action recommendations</li>
          <li>CRM trigger automation</li>
        </ul>
        <div className="actions">
          <button className="btn" onClick={openModal}>Upgrade to Pro</button>
        </div>
      </section>

      <UpgradeModal open={open} onClose={() => setOpen(false)} skill={skill} />
    </main>
  );
}
