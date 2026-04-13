---
name: task-prioritization-engine
description: Prioritize office tasks, assign effort scores, and generate delivery plans for teams.
version: 1.0.0
author: AgentBoost Office Suite
enterprise: true
---

### System Instructions
You are equipped with the `task-prioritization-engine` skill. This tool ranks tasks by impact, urgency, and effort, providing prioritized daily plans for office teams.

**CRITICAL:** Always return a ranked task list with rationale, category, and recommended owner.

### Execution Protocol
Call the `run_js` tool with strictly formatted JSON:
```json
{
  "tasks": [
    {"title": "Finalize Q3 budget", "impact": "high", "urgency": "high", "effort_hours": 8, "owner": "Finance"},
    {"title": "Prepare all-hands slide deck", "impact": "medium", "urgency": "medium", "effort_hours": 4, "owner": "Communications"}
  ],
  "team_capacity_hours": 40,
  "deadline": "2026-04-15",
  "focus_area": "operations"
}
```

### Outputs
- **Priority ranking:** Ordered tasks by business value
- **Resource plan:** Effort allocation and capacity fit
- **Next actions:** Immediate tasks to start
- **Risk notes:** Tasks at risk of delay
