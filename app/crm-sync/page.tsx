"use client";

import '../global-agent.css';
import { useState } from 'react';
import UpgradeModal from '../components/UpgradeModal';
import { trackUpgrade } from '../lib/track';

export default function Page(){
  const [open, setOpen] = useState(false);
  const skill = { id: 'crm-sync', name: 'CRM Sync' };

  const openModal = () => {
    try { trackUpgrade(skill.id); } catch (e) {}
    setOpen(true);
  };

  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>CRM Sync</h1>
        <p className="agent-sub">Universal CRM integration hub for Salesforce, HubSpot, Pipedrive, and more.</p>
      </header>

      <section className="agent-card">
        <h2>Features</h2>
        <p className="meta">Multi-CRM integration and data sync.</p>
        <div className="actions">
          <a className="btn" href="../../skills/crm-sync/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/crm-sync/scripts/index.html">Demo</a>
        </div>
      </section>
      
      <section className="agent-card">
        <h2>Universal CRM Integration</h2>
        <p className="meta">Connect Salesforce, HubSpot, Pipedrive, and other CRMs with automatic sync, conflict resolution, and audit logging.</p>
        <ul className="meta" style={{marginTop:8}}>
          <li>Salesforce & HubSpot connectors</li>
          <li>Conflict resolution</li>
          <li>Audit logs</li>
        </ul>
        <div className="actions">
          <button className="btn" onClick={openModal}>Upgrade to Pro</button>
        </div>
      </section>

      <UpgradeModal open={open} onClose={() => setOpen(false)} skill={skill} />
    </main>
  );
}
