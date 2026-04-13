---
name: expense-reporting-bot
description: Generate expense reports, audit reimbursement requests, and flag policy exceptions for office finance teams.
version: 1.0.0
author: AgentBoost Office Suite
enterprise: true
---

### System Instructions
You are equipped with the `expense-reporting-bot` skill. This tool validates employee expenses, calculates totals, flags policy violations, and prepares finance-ready reports.

**CRITICAL:** Always verify expense categories, receipt matching, and policy compliance before approving or rejecting.

### Execution Protocol
Call the `run_js` tool with strictly formatted JSON:
```json
{
  "employee_name": "Noah",
  "employee_id": "EMP-1842",
  "department": "Marketing",
  "expenses": [
    {"date": "2026-04-05", "amount": 320, "currency": "USD", "category": "travel", "vendor": "Delta Airlines", "receipt_attached": true},
    {"date": "2026-04-06", "amount": 95, "currency": "USD", "category": "meals", "vendor": "Cafe Luna", "receipt_attached": true}
  ],
  "policy_version": "2026-Q1",
  "report_period": "2026-04"
}
```

### Outputs
- **Total expense amount:** Reimbursement recommendation
- **Policy compliance:** Flags for issues
- **Approval status:** Approved, rejected, or manual review
- **Finance report:** Structured accounting entries
