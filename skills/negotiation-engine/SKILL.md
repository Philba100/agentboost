---
name: negotiation-engine
description: Enterprise negotiation assistant. Manages deal flow, generates counter-offers, identifies objections, suggests compromise paths, and tracks concession history for optimal outcomes.
version: 3.0.0
author: AgentBoost Enterprise
enterprise: true
---

### System Instructions
You are equipped with the `negotiation-engine` skill for professional deal negotiation. This tool provides real-time guidance, objection responses, and strategic compromise recommendations to maximize win rates.

**CRITICAL:** Never recommend giving away core value. Suggest trade-offs that maintain margin while addressing objections. Always document decisions for audit trail.

### Execution Protocol
Call the `run_js` tool with strictly formatted JSON:

```json
{
  "deal_id": "DEAL-2026-0847",
  "prospect_company": "Acme Corp",
  "current_proposal": {
    "annual_contract_value": 150000,
    "term_months": 12,
    "support_tier": "premium",
    "features_included": ["integration", "api_access", "training"]
  },
  "prospect_feedback": "Price is 40% above budget. Also need annual discount for multi-year commitment.",
  "your_constraints": {
    "minimum_price": 100000,
    "minimum_term": 12,
    "margin_target": 0.65
  },
  "negotiation_stage": "counter_offer",
  "historical_deal_size": 80000,
  "pressure_level": "medium"
}
```

### Outputs
The skill delivers:
- **Objection Analysis:** Root cause and severity assessment
- **Counter-Offer Strategy:** 3 compromise pathways with financial impact
- **Alternative Packages:** Different feature/price combinations
- **Concession Sequencing:** What to offer in which order
- **Deal Analysis:** ROI, margin impact, strategic value
- **Next Steps:** Recommended follow-up approach

### Example Tool Call
```javascript
run_js(data='{"deal_id": "DEAL-2026-0852", "prospect_company": "TechVenture Ltd", "current_proposal": {"annual_contract_value": 200000, "term_months": 24, "support_tier": "enterprise", "features_included": ["full_api", "sso", "custom_reporting"]}, "prospect_feedback": "Looking for 30% discount for 3-year prepayment and quarterly business reviews.", "your_constraints": {"minimum_price": 140000, "minimum_term": 24, "margin_target": 0.60}, "negotiation_stage": "counter_offer", "historical_deal_size": 150000, "pressure_level": "high"}')
```

### Integration Points
- **CRM Sync:** Log all negotiations and counter-offers
- **Bidding Engine:** Align pricing strategy with proposals
- **Meeting Scheduler:** Schedule negotiation sessions
- **Analytics Hub:** Track deal velocity and close rates
- **Email Orchestrator:** Auto-send proposals and counter-offers
