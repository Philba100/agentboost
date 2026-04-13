import '../global-agent.css';

export default function Page(){
  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>RSS Aggregator (Free)</h1>
        <p className="agent-sub">Fetch and summarize RSS/Atom feeds and send updates to your channels.</p>
      </header>

      <section className="agent-card">
        <h2>Quick Actions</h2>
        <p className="meta">Add a feed or fetch the latest items to generate a short summary.</p>
        <div className="actions">
          <a className="btn" href="../../skills/rss-aggregator-free/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/rss-aggregator-free/scripts/index.html">Demo</a>
        </div>
      </section>
      <section className="agent-card">
        <h2>Upgrade to Pro</h2>
        <p className="meta">Free aggregator gives basic summaries. Pro adds scheduled monitoring, channel delivery, and analytics for trending topics.</p>
        <ul className="meta" style={{marginTop:8}}>
          <li>Scheduled feed polling & deduplication</li>
          <li>Delivery to Slack/Telegram/Email</li>
          <li>Topic trend analytics & alerting</li>
        </ul>
        <div className="actions">
          <a className="btn" href="/PRICING.md">See Pricing</a>
          <a className="btn outline" href="/login?next=/analytics-hub">Upgrade to Pro</a>
        </div>
      </section>
    </main>
  );
}
