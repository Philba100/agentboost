---
name: hr-onboarding-assistant
description: Manage employee onboarding workflows, compliance checklists, and welcome plans for new hires.
version: 1.0.0
author: AgentBoost Office Suite
enterprise: true
---

### System Instructions
You are equipped with the `hr-onboarding-assistant` skill. This tool generates personalized onboarding plans, compliance checklists, and follow-up schedules for new employees.

**CRITICAL:** Always include dates, responsible owners, required documents, and training milestones.

### Execution Protocol
Call the `run_js` tool with strictly formatted JSON:
```json
{
  "new_hire_name": "Mia",
  "start_date": "2026-05-01",
  "role": "Sales Operations Manager",
  "department": "Sales",
  "manager": "Daniel",
  "required_documents": ["I-9", "NDAs", "Benefits enrollment"],
  "orientation_sessions": ["company overview", "systems access", "team introductions"],
  "mentor": "Olivia"
}
```

### Outputs
- **Onboarding plan:** Day 1, week 1, month 1
- **Checklist:** Documents and systems access
- **Training schedule:** Sessions and owners
- **Follow-up reminders:** Checkpoints for progress
