import '../global-agent.css';

export default function Page() {
  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>Task Prioritization Engine</h1>
        <p className="agent-sub">Rank tasks by impact, urgency and effort and produce a delivery plan for teams.</p>
      </header>

      <section className="agent-card">
        <h2>Top Priorities</h2>
        <p className="meta">Get a ranked task list with owners and estimated effort.</p>
        <div className="actions">
          <a className="btn" href="../../skills/task-prioritization-engine/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/task-prioritization-engine/scripts/index.html">Demo</a>
        </div>
      </section>
    </main>
  );
}
