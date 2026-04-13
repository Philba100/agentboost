"use client";

import '../global-agent.css';
import { useState } from 'react';
import UpgradeModal from '../components/UpgradeModal';
import { trackUpgrade } from '../lib/track';

export default function Page(){
  const [open, setOpen] = useState(false);
  const skill = { id: 'meeting-scheduler', name: 'Meeting Scheduler' };

  const openModal = () => {
    try { trackUpgrade(skill.id); } catch (e) {}
    setOpen(true);
  };

  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>Meeting Scheduler</h1>
        <p className="agent-sub">Calendar sync, AI-proposed times, and automated agenda generation with reminders.</p>
      </header>

      <section className="agent-card">
        <h2>Features</h2>
        <p className="meta">Intelligent meeting scheduling with calendar integration.</p>
        <div className="actions">
          <a className="btn" href="../../skills/meeting-scheduler/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/meeting-scheduler/scripts/index.html">Demo</a>
        </div>
      </section>
      
      <section className="agent-card">
        <h2>Calendar Integration & Auto-Agenda</h2>
        <p className="meta">Connect Google Calendar and Outlook, auto-propose optimal meeting times, and generate agendas.</p>
        <ul className="meta" style={{marginTop:8}}>
          <li>Google/Outlook sync</li>
          <li>Auto-agenda generation</li>
          <li>Automated reminders</li>
        </ul>
        <div className="actions">
          <button className="btn" onClick={openModal}>Upgrade to Pro</button>
        </div>
      </section>

      <UpgradeModal open={open} onClose={() => setOpen(false)} skill={skill} />
    </main>
  );
}
