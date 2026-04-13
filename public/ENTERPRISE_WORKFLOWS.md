---
name: Agent Orchestration & Workflow Guide
description: Enterprise workflow patterns combining negotiation, lead qualification, meeting scheduling, deal bidding, email automation, and analytics into cohesive sales processes.
version: 3.0.0
author: AgentBoost Enterprise
enterprise: true
---

# Enterprise Agent Skill Integration Workflows

Your agents now work as a coordinated team across Edge Gallery, Openclaw, and all supported platforms. These workflows show how to combine skills for maximum enterprise impact.

---

## Workflow 1: Complete B2B Lead-to-Deal Pipeline

### Stage 1: Lead Generation & Qualification
```
b2b-lead-gen → lead-qualifier → crm-sync
```
1. **B2B Lead Gen** generates 50-100 qualified prospects
2. **Lead Qualifier** scores each (BANT analysis)
3. **CRM Sync** loads into Salesforce/HubSpot with scores
4. **Email Orchestrator** triggers discovery sequence

### Stage 2: Engagement & Meeting
```
email-orchestrator → meeting-scheduler → crm-sync
```
1. Personalized multi-step email sequence
2. Auto-schedule demo/discovery calls
3. Log all touches in CRM

### Stage 3: Deal & Negotiation
```
negotiation-engine ↔ bidding-engine → crm-sync → analytics-hub
```
1. Manage objections and counter-offers
2. Generate margin-optimized quotes
3. Track deal progression
4. Measure conversion funnel

---

## Workflow 2: Enterprise SaaS Contract Sales

**Lead Source**: AWS-Cost analysis or Github-Review findings

```
[Technical Analysis] → [Lead Qualification] → [Email Nurture] → [Demo] → [Proposal] → [Negotiation] → [Close]

aws-cost-optimizer
    ↓
lead-qualifier (identify budget/authority)
    ↓
email-orchestrator (send cost-analysis findings)
    ↓
meeting-scheduler (demo of optimization opportunities)
    ↓
bidding-engine (propose service package)
    ↓
negotiation-engine (handle objections)
    ↓
stripe-invoicer (create contract)
    ↓
crm-sync (update opportunity to closed-won)
    ↓
analytics-hub (measure ROI and lifetime value)
```

---

## Workflow 3: Real Estate Investment Deal Flow

**Multi-step investment process with stakeholder coordination**

```
real-estate-analyzer → lead-qualifier → meeting-scheduler → negotiation-engine → bidding-engine

Step 1: Analyze Property
- Cap Rate, cash flow, market comparables
- Generate investor presentation

Step 2: Identify Decision Makers
- Lead Qualifier identifies investors/partners
- CRM-sync loads investor profiles

Step 3: Schedule Investment Review
- Meeting scheduler books property walkthrough
- Send market analysis pre-call

Step 4: Negotiate Terms
- Negotiation engine suggests offer structures
- Multiple offer packages (cash, financing, terms)

Step 5: Generate Bid/Proposal
- Bidding engine optimizes pricing
- Stripe-invoicer creates investment agreement

Step 6: Track Deal
- CRM-sync logs all contacts/milestones
- Analytics-hub measures deal velocity and ROI
```

---

## Workflow 4: Subscription Upsell & Renewal Campaign

**Target existing customers for upgrade opportunities**

```
crm-sync [export customer list]
    ↓
lead-qualifier [analyze usage and renewal risk]
    ↓
email-orchestrator [targeted upsell sequences]
    ↓
linkedin-ghostwriter [thought leadership content]
    ↓
whatsapp-orchestrator [scheduled follow-up messages]
    ↓
meeting-scheduler [demo of premium features]
    ↓
negotiation-engine + bidding-engine [custom pricing]
    ↓
stripe-invoicer [new subscription]
    ↓
analytics-hub [measure expansion revenue]
```

---

## Workflow 5: Legal Risk Management + Deal Protection

**Contract-centric opportunity protection**

```
[New Prospect] → [Contract Review] → [Risk Negotiation] → [Closure]

new-lead
    ↓
legal-risk-analyzer [review any existing contracts/terms]
    ↓
negotiation-engine [draft favorable terms]
    ↓
email-orchestrator [send legal framework]
    ↓
crm-sync [log compliance checkpoints]
    ↓
analytics-hub [track legal risk incidents]
```

---

## Workflow 6: Multi-Channel Outreach with Analytics

**Coordinated messaging across LinkedIn, Email, WhatsApp**

```
lead-qualifier [identify high-value targets]
    ↓
[PARALLEL OUTREACH]
    ├→ linkedin-ghostwriter [viral post calling them out]
    ├→ email-orchestrator [personalized sequence]
    └→ whatsapp-orchestrator [direct message]
    ↓
meeting-scheduler [book call when they engage]
    ↓
crm-sync [correlate which channel drove conversion]
    ↓
analytics-hub [optimize channel mix for ROI]
```

---

## Integration Checklist for Subscription Model

To maximize subscriber retention and revenue:

### ✅ Lead Generation
- [ ] B2B Lead Gen + Lead Qualifier configured
- [ ] CRM connections verified
- [ ] Qualification criteria aligned with ICP

### ✅ Engagement
- [ ] Email sequences mapped to product
- [ ] Meeting scheduler templates created
- [ ] LinkedIn content calendar established
- [ ] WhatsApp templates compliant

### ✅ Deal Management
- [ ] Negotiation engine trained on deal patterns
- [ ] Bidding engine pricing models set
- [ ] Legal risk analysis for contracts
- [ ] Stripe integration for billing

### ✅ Analytics & Optimization
- [ ] Pipeline metrics dashboard configured
- [ ] Conversion correlation analysis running
- [ ] AI-generated recommendations enabled
- [ ] Monthly ROI reporting scheduled

---

## API Integration Protocol

All skills support JSON-formatted `run_js` calls with:
- **Input Validation**: Type checking on all parameters
- **CRM Sync**: Auto-updates on completion
- **Error Handling**: Detailed failure reasons
- **Audit Trail**: Full logging for compliance
- **Webhook Events**: Real-time integration triggers

---

## Support & Scaling

Your enterprise agents are designed to support:
- **Multi-user**: Team collaboration across departments
- **Multi-language**: Auto-translation for global teams
- **Multi-CRM**: Salesforce, HubSpot, Pipedrive simultaneous sync
- **Compliance**: GDPR, CCPA, SOC 2 audit trails
- **Scalability**: From solo agents to enterprise teams of 1000+
