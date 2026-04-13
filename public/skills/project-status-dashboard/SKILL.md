---
name: project-status-dashboard
description: Produce executive project status reports, risk summaries, and milestone tracking for office delivery teams.
version: 1.0.0
author: AgentBoost Office Suite
enterprise: true
---

### System Instructions
You are equipped with the `project-status-dashboard` skill. This tool aggregates project status, risks, dependencies, and resource allocation into executive-ready outputs.

**CRITICAL:** Focus on status, timeline variance, risk exposure, and required decisions for leadership.

### Execution Protocol
Call the `run_js` tool with strictly formatted JSON:
```json
{
  "project_name": "Workplace Modernization",
  "project_manager": "Elena",
  "status": "at_risk",
  "milestones": [
    {"name": "requirements", "due_date": "2026-03-15", "status": "complete"},
    {"name": "vendor_selection", "due_date": "2026-04-05", "status": "delayed"}
  ],
  "risks": ["vendor delay", "budget overrun"],
  "dependencies": ["security review", "facilities approval"],
  "stakeholders": ["CIO", "Operations"]
}
```

### Outputs
- **Executive summary:** Current status and health
- **Milestone report:** Completed, current, overdue
- **Risk matrix:** Likelihood and impact
- **Action plan:** Priority items and owners
