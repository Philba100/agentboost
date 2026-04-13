import '../global-agent.css';

export default function Page() {
  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>Procurement Bid Coordinator</h1>
        <p className="agent-sub">Compare vendor bids, evaluate supplier risk and recommend purchase decisions.</p>
      </header>

      <section className="agent-card">
        <h2>Vendor Comparison</h2>
        <p className="meta">View recommended suppliers with cost and delivery trade-offs.</p>
        <div className="actions">
          <a className="btn" href="../../skills/procurement-bid-coordinator/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/procurement-bid-coordinator/scripts/index.html">Demo</a>
        </div>
      </section>
    </main>
  );
}
