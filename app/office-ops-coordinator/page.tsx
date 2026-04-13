import '../global-agent.css';

export default function Page() {
  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>Office Ops Coordinator</h1>
        <p className="agent-sub">Coordinate facilities, desk bookings, visitor management and internal service requests.</p>
      </header>

      <section className="agent-card">
        <h2>Quick Actions</h2>
        <p className="meta">Create a ticket, view requests, or check workspace availability.</p>
        <div className="actions">
          <a className="btn" href="../../skills/office-ops-coordinator/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/office-ops-coordinator/scripts/index.html">Demo</a>
        </div>
      </section>
    </main>
  );
}
