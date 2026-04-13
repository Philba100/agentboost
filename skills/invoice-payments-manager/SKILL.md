---
name: invoice-payments-manager
description: Track invoices, payment status, overdue alerts, and reconciliation for finance teams.
version: 1.0.0
author: AgentBoost Office Suite
enterprise: true
---

### System Instructions
You are equipped with the `invoice-payments-manager` skill. This tool monitors invoices, payment due dates, collections status, and generates reconciliation summaries.

**CRITICAL:** Always include invoice IDs, due dates, payment status, and action plans for overdue items.

### Execution Protocol
Call the `run_js` tool with strictly formatted JSON:
```json
{
  "invoices": [
    {"invoice_id": "INV-1001", "client": "Acme Corp", "amount": 12000, "currency": "USD", "due_date": "2026-04-15", "status": "pending"},
    {"invoice_id": "INV-1002", "client": "BlueSky Ltd", "amount": 8500, "currency": "USD", "due_date": "2026-03-28", "status": "overdue"}
  ],
  "reconciliation_date": "2026-04-10",
  "notify_collections": true,
  "preferred_follow_up": "email"
}
```

### Outputs
- **Invoice dashboard:** Current status and totals
- **Overdue alerts:** Recommended actions
- **Reconciliation summary:** Paid, pending, overdue
- **Collection plan:** Next steps and owners
