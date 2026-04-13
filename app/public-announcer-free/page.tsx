import '../global-agent.css';

export default function Page(){
  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>Public Announcer (Free)</h1>
        <p className="agent-sub">Schedule or send one-off public announcements to Telegram or Mastodon.</p>
      </header>

      <section className="agent-card">
        <h2>Quick Actions</h2>
        <p className="meta">Create a broadcast or schedule an announcement to public channels.</p>
        <div className="actions">
          <a className="btn" href="../../skills/public-announcer-free/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/public-announcer-free/scripts/index.html">Demo</a>
        </div>
      </section>
      <section className="agent-card">
        <h2>Pro Advantages</h2>
        <p className="meta">Public Announcer free supports single-channel broadcasts. Pro supports multi-channel scheduling, UTM tracking, and analytics.</p>
        <ul className="meta" style={{marginTop:8}}>
          <li>Multi-channel scheduling (Telegram, Mastodon, Twitter)</li>
          <li>UTM & attribution tracking</li>
          <li>Delivery analytics and retry logic</li>
        </ul>
        <div className="actions">
          <a className="btn" href="/PRICING.md">See Pricing</a>
          <a className="btn outline" href="/login?next=/email-orchestrator">Upgrade to Pro</a>
        </div>
      </section>
    </main>
  );
}
