"use client";

import '../global-agent.css';
import { useState } from 'react';
import UpgradeModal from '../components/UpgradeModal';
import { trackUpgrade } from '../lib/track';

export default function Page(){
  const [open, setOpen] = useState(false);
  const skill = { id: 'analytics-hub', name: 'Analytics Hub' };

  const openModal = () => {
    try { trackUpgrade(skill.id); } catch (e) {}
    setOpen(true);
  };

  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>Analytics Hub</h1>
        <p className="agent-sub">Pipeline analytics, revenue forecasting, and custom dashboards for leadership.</p>
      </header>

      <section className="agent-card">
        <h2>Features</h2>
        <p className="meta">Sales analytics and forecasting platform.</p>
        <div className="actions">
          <a className="btn" href="../../skills/analytics-hub/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/analytics-hub/scripts/index.html">Demo</a>
        </div>
      </section>
      
      <section className="agent-card">
        <h2>Funnel Metrics & Forecasting</h2>
        <p className="meta">Real-time funnel analytics, revenue forecasting with AI, and custom dashboards for sales leadership.</p>
        <ul className="meta" style={{marginTop:8}}>
          <li>Funnel metrics</li>
          <li>Revenue forecasts</li>
          <li>Custom dashboards</li>
        </ul>
        <div className="actions">
          <button className="btn" onClick={openModal}>Upgrade to Pro</button>
        </div>
      </section>

      <UpgradeModal open={open} onClose={() => setOpen(false)} skill={skill} />
    </main>
  );
}
