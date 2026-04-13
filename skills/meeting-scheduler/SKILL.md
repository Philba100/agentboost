---
name: meeting-scheduler
description: Enterprise meeting orchestration. Syncs with calendars (Google, Outlook, Calendly), generates proposals, sends confirmations, manages follow-ups, and tracks meeting outcomes.
version: 3.0.0
author: AgentBoost Enterprise
enterprise: true
---

### System Instructions
You are equipped with the `meeting-scheduler` skill for professional meeting coordination. This tool handles complete meeting lifecycle: proposal generation, scheduling, confirmation, and follow-up automation.

**CRITICAL:** Always confirm timezone, validate attendee availability, and generate meeting materials automatically.

### Execution Protocol
Call the `run_js` tool with strictly formatted JSON:

```json
{
  "meeting_type": "product_demo",
  "attendees": [{"name": "John Smith", "email": "john@company.com", "timezone": "America/New_York"}],
  "duration_minutes": 30,
  "proposed_dates": ["2026-04-15", "2026-04-16", "2026-04-17"],
  "time_slots": ["10:00 AM", "2:00 PM"],
  "agenda_topics": ["Product overview", "Integration capabilities", "Pricing tiers"],
  "send_agenda_materials": true,
  "proposal_template": "standard_demo",
  "calendar_provider": "google",
  "auto_send_confirmation": true,
  "follow_up_sequence": "discovery_call"
}
```

### Outputs
The skill delivers:
- **Calendar Link:** Multi-candidate availability view
- **Meeting Proposal:** Customized one-pager with agenda
- **Confirmation Email:** With calendar invite and Zoom/Teams link
- **Follow-up Sequence:** Auto-scheduled pre/post-meeting touchpoints
- **Attendee Reminder:** 24hr and 1hr notifications

### Example Tool Call
```javascript
run_js(data='{"meeting_type": "product_demo", "attendees": [{"name": "Sarah Connor", "email": "sarah@techcorp.com", "timezone": "America/Los_Angeles"}], "duration_minutes": 45, "proposed_dates": ["2026-04-20", "2026-04-22"], "time_slots": ["9:00 AM", "11:00 AM"], "agenda_topics": ["Product capabilities", "Security features", "Support SLA"], "send_agenda_materials": true, "calendar_provider": "google", "auto_send_confirmation": true, "follow_up_sequence": "discovery_call"}')
```

### Integration Points
- **Lead Qualifier:** Auto-check lead score before scheduling
- **Email Orchestrator:** Coordinate agenda distribution
- **CRM Sync:** Log meeting in customer record
- **Analytics Hub:** Track meeting → conversion metrics
- **Calendar Providers:** Google Calendar, Microsoft Outlook, Calendly
