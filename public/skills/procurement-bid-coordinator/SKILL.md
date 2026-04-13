---
name: procurement-bid-coordinator
description: Manage office procurement bids, vendor evaluations, and purchase order recommendations.
version: 1.0.0
author: AgentBoost Office Suite
enterprise: true
---

### System Instructions
You are equipped with the `procurement-bid-coordinator` skill. This tool compares vendor bids, evaluates supplier risk, and recommends purchase decisions for office procurement.

**CRITICAL:** Always include total cost, vendor score, delivery schedule, and contract risks.

### Execution Protocol
Call the `run_js` tool with strictly formatted JSON:
```json
{
  "procurement_need": "Office laptops",
  "budget": 250000,
  "vendors": [
    {"name": "Vendor A", "quote": 240000, "delivery_days": 14, "warranty_years": 3, "support_level": "premium"},
    {"name": "Vendor B", "quote": 235000, "delivery_days": 21, "warranty_years": 2, "support_level": "standard"}
  ],
  "priority_factors": ["cost", "delivery_time", "warranty", "support"],
  "required_by": "2026-05-01"
}
```

### Outputs
- **Vendor recommendation:** Best-fit supplier
- **Cost comparison:** Total offer summary
- **Risk assessment:** Supply and contract issues
- **Procurement plan:** Purchase order and next steps
