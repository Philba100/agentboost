import '../global-agent.css';

export default function Page(){
  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>Slack Lite (Free)</h1>
        <p className="agent-sub">Send simple messages to Slack channels and enable basic slash commands for quick integrations.</p>
      </header>

      <section className="agent-card">
        <h2>Quick Actions</h2>
        <p className="meta">Post a message or test a command in a channel.</p>
        <div className="actions">
          <a className="btn" href="../../skills/slack-lite/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/slack-lite/scripts/index.html">Demo</a>
        </div>
      </section>
      <section className="agent-card">
        <h2>Why upgrade to Pro?</h2>
        <p className="meta">Slack Lite is perfect for quick tests. Pro adds enterprise connectors, message history, and advanced command workflows.</p>
        <ul className="meta" style={{marginTop:8}}>
          <li>Persistent message storage & auditing</li>
          <li>Advanced slash-command orchestration</li>
          <li>Integration with Email Orchestrator and CRM</li>
        </ul>
        <div className="actions">
          <a className="btn" href="/PRICING.md">See Pricing</a>
          <a className="btn outline" href="/login?next=/email-orchestrator">Upgrade to Pro</a>
        </div>
      </section>
    </main>
  );
}
