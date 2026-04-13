import '../global-agent.css';

export default function Page() {
  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>Project Status Dashboard</h1>
        <p className="agent-sub">Executive view of milestones, risks, and resource allocation.</p>
      </header>

      <section className="agent-card">
        <h2>Project Health</h2>
        <p className="meta">Highlight at-risk milestones and required leadership decisions.</p>
        <div className="actions">
          <a className="btn" href="../../skills/project-status-dashboard/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/project-status-dashboard/scripts/index.html">Demo</a>
        </div>
      </section>
    </main>
  );
}
