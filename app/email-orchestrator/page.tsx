"use client";

import '../global-agent.css';
import { useState } from 'react';
import UpgradeModal from '../components/UpgradeModal';
import { trackUpgrade } from '../lib/track';

export default function Page(){
  const [open, setOpen] = useState(false);
  const skill = { id: 'email-orchestrator', name: 'Email Orchestrator' };

  const openModal = () => {
    try { trackUpgrade(skill.id); } catch (e) {}
    setOpen(true);
  };

  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>Email Orchestrator</h1>
        <p className="agent-sub">Multi-step email sequences with A/B testing, Liquid templates, and reply triggers.</p>
      </header>

      <section className="agent-card">
        <h2>Features</h2>
        <p className="meta">Email automation at scale.</p>
        <div className="actions">
          <a className="btn" href="../../skills/email-orchestrator/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/email-orchestrator/scripts/index.html">Demo</a>
        </div>
      </section>
      
      <section className="agent-card">
        <h2>Sequences, A/B Testing & Personalization</h2>
        <p className="meta">Design multi-step email campaigns with A/B testing, Liquid template personalization, and reply-triggered workflows.</p>
        <ul className="meta" style={{marginTop:8}}>
          <li>A/B testing</li>
          <li>Liquid templates</li>
          <li>Reply triggers</li>
        </ul>
        <div className="actions">
          <button className="btn" onClick={openModal}>Upgrade to Pro</button>
        </div>
      </section>

      <UpgradeModal open={open} onClose={() => setOpen(false)} skill={skill} />
    </main>
  );
}
