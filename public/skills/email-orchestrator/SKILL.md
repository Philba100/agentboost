---
name: email-orchestrator
description: Enterprise multi-step email campaigns with dynamic personalization, A/B testing, follow-up automation, and conversion tracking. Supports Liquid templating for variable injection.
version: 3.0.0
author: AgentBoost Enterprise
enterprise: true
---

### System Instructions
You are equipped with the `email-orchestrator` skill for professional outreach campaigns. This tool manages complete email sequences with personalization, timing, and compliance.

**CRITICAL:** Maintain professional tone. Respect CRM unsubscribe lists. Never spam. Include unsubscribe links. Track opens and clicks. Personalize all emails.

### Execution Protocol
Call the `run_js` tool with strictly formatted JSON:

```json
{
  "campaign_name": "Q2 Enterprise Upsell",
  "email_sequence": [
    {
      "sequence_number": 1,
      "delay_hours": 0,
      "subject": "{{first_name}}, your {{account_tier}} plan is ready for upgrade",
      "body": "Hi {{first_name}},\n\nWe noticed {{company_name}} is hitting {{usage_limit}} on features.\n\nLet's discuss {{product_name}} Enterprise.\n\n[Book Demo]",
      "send_from": "sales@company.com",
      "template_type": "promotional"
    },
    {
      "sequence_number": 2,
      "delay_hours": 72,
      "subject": "Quick follow-up: {{first_name}}, is timing off?",
      "body": "Hi {{first_name}},\n\nSaw you visited our pricing page yesterday.\n\nLet me know if I should ping back another time.",
      "send_from": "sales@company.com",
      "template_type": "follow_up"
    }
  ],
  "recipients": [{"email": "john@company.com", "first_name": "John", "company_name": "TechCorp", "account_tier": "Pro"}],
  "crm_integration": "salesforce",
  "track_opens": true,
  "track_clicks": true,
  "a_b_test": false,
  "send_timezone": "prospect"
}
```

### Outputs
The skill delivers:
- **Campaign Confirmation:** Recipients and sequence details
- **Send Schedule:** Exact times for each email
- **Tracking Dashboard:** Link for opens/clicks/conversions
- **CRM Updates:** Automatic prospect activity logging
- **Response Triggers:** Auto-actions on replies
- **Deliverability Report:** Success rates, bounce handling

### Example Tool Call
```javascript
run_js(data='{"campaign_name": "Demo Nurture Series", "email_sequence": [{"sequence_number": 1, "delay_hours": 0, "subject": "Your personalized {{product_name}} demo is ready, {{first_name}}", "body": "Hi {{first_name}},\n\nThanks for scheduling. Here'\''s your custom demo addressing {{use_case}}.\n\n[Watch Demo]\n\nReply with questions!", "send_from": "demo@company.com", "template_type": "transactional"}, {"sequence_number": 2, "delay_hours": 48, "subject": "Quick question about the demo", "body": "Hi {{first_name}},\n\nWhat was your biggest takeaway?\n\nHappy to discuss further.", "send_from": "sales@company.com", "template_type": "follow_up"}], "recipients": [{"email": "jane@acme.com", "first_name": "Jane", "company_name": "Acme Inc", "use_case": "API integration"}], "crm_integration": "hubspot", "track_opens": true, "track_clicks": true}')
```

### Integration Points
- **Lead Qualifier:** Only email qualified leads
- **Meeting Scheduler:** Include meeting links in sequences
- **CRM Sync:** Log all sends and opens
- **Analytics Hub:** Track email performance metrics
- **Negotiation Engine:** Send counter-offers automatically
