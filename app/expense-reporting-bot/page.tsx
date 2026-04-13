import '../global-agent.css';

export default function Page() {
  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>Expense Reporting Bot</h1>
        <p className="agent-sub">Validate receipts, flag policy exceptions, and prepare finance-ready reports.</p>
      </header>

      <section className="agent-card">
        <h2>Submit Expense</h2>
        <p className="meta">Upload receipts or start bulk report generation for the finance team.</p>
        <div className="actions">
          <a className="btn" href="../../skills/expense-reporting-bot/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/expense-reporting-bot/scripts/index.html">Demo</a>
        </div>
      </section>
    </main>
  );
}
