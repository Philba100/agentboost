import '../global-agent.css';

export default function Page() {
  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>Contract Draft Assistant</h1>
        <p className="agent-sub">Generate contract drafts, redlines, and negotiation notes following legal best practices.</p>
      </header>

      <section className="agent-card">
        <h2>Draft a Contract</h2>
        <p className="meta">Create NDAs, service agreements and vendor contracts with clear risk callouts.</p>
        <div className="actions">
          <a className="btn" href="../../skills/contract-draft-assistant/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/contract-draft-assistant/scripts/index.html">Demo</a>
        </div>
      </section>
    </main>
  );
}
