import '../global-agent.css';

export default function Page() {
  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>Knowledge Hub Curator</h1>
        <p className="agent-sub">Organize internal docs, generate summaries, and keep knowledge up to date.</p>
      </header>

      <section className="agent-card">
        <h2>Documentation Overview</h2>
        <p className="meta">Search, summarize or request updates across internal knowledge bases.</p>
        <div className="actions">
          <a className="btn" href="../../skills/knowledge-hub-curator/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/knowledge-hub-curator/scripts/index.html">Demo</a>
        </div>
      </section>
    </main>
  );
}
