import '../global-agent.css';

export default function Page() {
  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>Invoice Payments Manager</h1>
        <p className="agent-sub">Monitor invoices, overdue alerts, collections and reconciliation summaries.</p>
      </header>

      <section className="agent-card">
        <h2>Invoice Dashboard</h2>
        <p className="meta">View outstanding balances and follow-up actions for collections.</p>
        <div className="actions">
          <a className="btn" href="../../skills/invoice-payments-manager/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/invoice-payments-manager/scripts/index.html">Demo</a>
        </div>
      </section>
    </main>
  );
}
