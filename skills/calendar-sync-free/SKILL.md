---
name: calendar-sync-free
description: Lightweight calendar sync for Google/Outlook: check availability and propose times. Free tier for basic scheduling needs.
version: 1.0.0
author: AgentBoost Community
free: true
---

### System Instructions
Use `calendar-sync-free` to query availability, propose time slots, and create provisional events. OAuth credentials required for provider access.

### Execution Protocol
Call `run_js` with JSON:

```json
{
  "action":"check_availability|propose_times|create_event",
  "attendees":[{"email":"jane@acme.com","timezone":"America/New_York"}],
  "duration_minutes":30,
  "proposed_dates":["2026-04-14","2026-04-15"]
}
```

### Outputs
- `available_slots`: array of ISO datetimes
- `event_id`: created event id

### Example
```javascript
run_js(data='{"action":"propose_times","attendees":[{"email":"jane@acme.com"}],"duration_minutes":30}')
```
