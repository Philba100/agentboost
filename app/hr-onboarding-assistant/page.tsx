import '../global-agent.css';

export default function Page() {
  return (
    <main className="agent-page">
      <header className="agent-header">
        <h1>HR Onboarding Assistant</h1>
        <p className="agent-sub">Personalized onboarding plans, compliance checklists, and training schedules for new hires.</p>
      </header>

      <section className="agent-card">
        <h2>New Hire Checklist</h2>
        <p className="meta">Automated day-1, week-1 and month-1 plans with owners and reminders.</p>
        <div className="actions">
          <a className="btn" href="../../skills/hr-onboarding-assistant/SKILL.md">Skill Docs</a>
          <a className="btn outline" href="../../skills/hr-onboarding-assistant/scripts/index.html">Demo</a>
        </div>
      </section>
    </main>
  );
}
