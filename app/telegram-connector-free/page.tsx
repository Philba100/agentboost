"use client";

import '../global-agent.css';
import { useState } from 'react';
import UpgradeModal from '../components/UpgradeModal';
import { trackUpgrade } from '../lib/track';

export default function Page(){
  const [open, setOpen] = useState(false);
  const skill = { id: 'telegram-connector-free', name: 'Telegram Connector' };

  const openModal = () => {
    try { trackUpgrade(skill.id); } catch (e) {}
    setOpen(true);
  };

  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>Telegram Connector (Free)</h1>
        <p className="agent-sub">Basic Telegram bot actions: send messages, register simple webhooks, and reply to commands.</p>
      </header>

      <section className="agent-card">
        <h2>Quick Actions</h2>
        <p className="meta">Use the demo to test sending messages or register a webhook.</p>
        <div className="actions">
          <a className="btn" href="../../skills/telegram-connector-free/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/telegram-connector-free/scripts/index.html">Demo</a>
        </div>
      </section>
      
      <section className="agent-card">
        <h2>Upgrade to Pro</h2>
        <p className="meta">Free connector lets you try messaging; the Pro tier adds guaranteed delivery, higher rate limits, multi-channel routing, and analytics.</p>
        <ul className="meta" style={{marginTop:8}}>
          <li>Guaranteed SLA & higher throughput</li>
          <li>Multi-channel routing (Telegram, WhatsApp, SMS)</li>
          <li>Built-in analytics & message history</li>
        </ul>
        <div className="actions">
          <button className="btn" onClick={openModal}>See Pricing</button>
          <button className="btn outline" onClick={openModal}>Upgrade to Pro</button>
        </div>
      </section>

      <UpgradeModal open={open} onClose={() => setOpen(false)} skill={skill} />
    </main>
  );
}
