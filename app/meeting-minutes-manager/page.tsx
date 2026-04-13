import '../global-agent.css';

export default function Page() {
  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>Meeting Minutes Manager</h1>
        <p className="agent-sub">Capture meeting summaries, extract action items, and distribute clear follow-ups.</p>
      </header>

      <section className="agent-card">
        <h2>Recent Meetings</h2>
        <p className="meta">Automated summaries with assigned owners and deadlines.</p>
        <div className="actions">
          <a className="btn" href="../../skills/meeting-minutes-manager/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/meeting-minutes-manager/scripts/index.html">Demo</a>
        </div>
      </section>
    </main>
  );
}
