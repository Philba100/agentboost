import '../global-agent.css';

export default function Page(){
  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>Calendar Sync (Free)</h1>
        <p className="agent-sub">Check availability and propose meeting times using Google or Outlook (free tier).</p>
      </header>

      <section className="agent-card">
        <h2>Quick Actions</h2>
        <p className="meta">Propose times, check availability, or create provisional events.</p>
        <div className="actions">
          <a className="btn" href="../../skills/calendar-sync-free/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/calendar-sync-free/scripts/index.html">Demo</a>
        </div>
      </section>
      <section className="agent-card">
        <h2>Calendar Pro</h2>
        <p className="meta">Free calendar sync checks availability. Pro adds bulk scheduling, buffer rules, timezone normalization, and CRM-linked invites.</p>
        <ul className="meta" style={{marginTop:8}}>
          <li>Bulk scheduling & smart availability</li>
          <li>Buffer times and automatic timezone normalization</li>
          <li>CRM-linked event creation and logging</li>
        </ul>
        <div className="actions">
          <a className="btn" href="/PRICING.md">See Pricing</a>
          <a className="btn outline" href="/login?next=/meeting-scheduler">Upgrade to Pro</a>
        </div>
      </section>
    </main>
  );
}
