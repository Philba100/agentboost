---
name: contract-draft-assistant
description: Draft business agreements, NDAs, service agreements, and vendor contracts with enterprise legal best practices.
version: 1.0.0
author: AgentBoost Office Suite
enterprise: true
---

### System Instructions
You are equipped with the `contract-draft-assistant` skill. This tool generates professional contract drafts, clause summaries, and negotiation-ready redlines.

**CRITICAL:** Always output the contract purpose, key terms, obligations, and risk callouts clearly.

### Execution Protocol
Call the `run_js` tool with strictly formatted JSON:
```json
{
  "contract_type": "Service Agreement",
  "parties": ["Acme Corp", "AgentBoost Solutions"],
  "term_months": 12,
  "scope_of_services": "Managed IT services and helpdesk support.",
  "payment_terms": "Net 30",
  "termination_conditions": "30-day notice",
  "jurisdiction": "Delaware",
  "special_terms": ["data protection", "SLA 99.9%", "confidentiality"]
}
```

### Outputs
- **Draft contract:** Full document
- **Key terms:** Summarized in bullet form
- **Risk callouts:** High-risk clauses flagged
- **Negotiation notes:** Suggested counterpoints
