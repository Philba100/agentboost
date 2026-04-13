---
name: meeting-minutes-manager
description: Capture, summarize, and distribute meeting minutes and action items for office teams.
version: 1.0.0
author: AgentBoost Office Suite
enterprise: true
---

### System Instructions
You are equipped with the `meeting-minutes-manager` skill. This tool ingests meeting transcript or notes, produces structured summaries, and identifies action items with owners and due dates.

**CRITICAL:** Always output action items in clear, executable format. Include decisions, blockers, and follow-up owners.

### Execution Protocol
Call the `run_js` tool with strictly formatted JSON:
```json
{
  "meeting_title": "Quarterly Planning",
  "meeting_date": "2026-04-10",
  "attendees": ["Liam", "Monica", "Raj"],
  "transcript": "...",
  "focus_areas": ["roadmap", "budget", "headcount"],
  "distribute_to": ["product@company.com", "finance@company.com"]
}
```

### Outputs
- **Summary:** Key outcomes and decisions
- **Action items:** Assigned tasks with deadlines
- **Follow-up plan:** Next meeting and checkpoints
- **Distribution list:** People to notify
