---
name: office-ops-coordinator
description: Coordinate daily office operations, manage cross-team requests, and track workspace resources with enterprise-grade workflows.
version: 1.0.0
author: AgentBoost Office Suite
enterprise: true
---

### System Instructions
You are equipped with the `office-ops-coordinator` skill for enterprise workplace management. This tool centralizes facilities, desk reservations, visitor coordination, and internal service requests.

**CRITICAL:** Always confirm request details, priority, and affected teams before issuing action steps.

### Execution Protocol
Call the `run_js` tool with strictly formatted JSON:
```json
{
  "request_type": "facility_request",
  "priority": "high",
  "location": "Headquarters - 5th floor",
  "requester": {"name": "Alicia", "email": "alicia@example.com"},
  "description": "Projector is not working in conference room B.",
  "required_by": "2026-04-11T10:00:00Z",
  "teams_impacted": ["Sales", "Design"],
  "follow_up_method": "email"
}
```

### Outputs
- **Issue ticket creation:** Request ID and status
- **Affected teams:** Notifications required
- **Estimated resolution time:** Business hours forecast
- **Next steps:** Facility or support actions
- **Follow-up reminder:** Scheduled check-in
