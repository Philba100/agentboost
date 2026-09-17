export interface AgentDefinition {
  id: string;
  icon: string;
  name: string;
  role: string;
  desc: string;
  channel: 'Web & API' | 'Email' | 'Procurement / EDI' | 'Internal Ops' | 'Executive';
  capabilities: string[];
  autonomousTriggers: string[];
  category: string;
  free: boolean;
}

export const autonomousAgents: AgentDefinition[] = [
  {
    id: "web-intel-scout",
    icon: "🌐",
    name: "Web Intelligence & Regulatory Scout",
    role: "Autonomous Web & Sanctions Crawler",
    desc: "Autonomous internet search and intelligence engine that crawls corporate registries, gazettes, sanctions lists, and trade index tariffs.",
    channel: "Web & API",
    capabilities: [
      "Live company registry & trade license verification",
      "Sanctions screening (OFAC, UN, EU Lists)",
      "Statutory tariff, HS code, and index benchmarking"
    ],
    autonomousTriggers: ["New counterparty check", "Periodic license audit", "Sanctions list updates"],
    category: "Corporate Intelligence",
    free: false
  },
  {
    id: "email-inbox-processor",
    icon: "📬",
    name: "Autonomous Email & RFQ Processor",
    role: "Inbound/Outbound Communications Parser",
    desc: "Ingests operational email streams, parses PDF/invoice attachments, categorizes business urgency, and drafts context-aware channel communications.",
    channel: "Email",
    capabilities: [
      "Automated RFQ, invoice, and notice extraction",
      "Urgency triage and escalation routing",
      "Pre-drafted multi-channel executive replies"
    ],
    autonomousTriggers: ["Incoming procurement email", "Overdue payment notice", "RFP document attachment"],
    category: "Communications",
    free: false
  },
  {
    id: "supplier-negotiator",
    icon: "🤝",
    name: "Supplier & Vendor Communications Manager",
    role: "Procurement & Commercial Terms Negotiator",
    desc: "Automates correspondence with suppliers, renegotiates payment terms (Net 30/60/90), resolves delivery delays, and enforces SLA penalties.",
    channel: "Procurement / EDI",
    capabilities: [
      "Automated counter-offer and margin protection scripts",
      "Discrepancy notice and liquidated damages drafting",
      "Supplier scorecard and risk indexing"
    ],
    autonomousTriggers: ["Delayed shipment alert", "Price increase notification", "Contract renewal window"],
    category: "Procurement & Supply",
    free: false
  },
  {
    id: "task-followup-sentinel",
    icon: "⏱️",
    name: "Task Follow-Up & Accountability Sentinel",
    role: "Autonomous Milestone & Project Verifier",
    desc: "Monitors cross-departmental milestones, detects project slippage, verifies completed deliverables, and alerts managers with proactive recommendations.",
    channel: "Internal Ops",
    capabilities: [
      "Deadlines and milestone slippage forecasting",
      "Proactive automated check-ins and escalations",
      "Deliverable completion verification and audit sign-off"
    ],
    autonomousTriggers: ["Milestone due in 48 hours", "Unfinished dependencies", "Deliverable uploaded"],
    category: "Operations & Governance",
    free: false
  },
  {
    id: "executive-decision-radar",
    icon: "📊",
    name: "Executive Decision & Risk Radar",
    role: "Strategic C-Suite Risk Synthesizer",
    desc: "Synthesizes company-wide operational data into clear, actionable executive decision memos with quantified balance-sheet and legal exposure.",
    channel: "Executive",
    capabilities: [
      "Single-page executive decision memos",
      "Quantified balance sheet and liability exposure",
      "Go/No-Go statutory recommendation matrix"
    ],
    autonomousTriggers: ["Major tender submission", "Capital expenditure > $250k", "Litigation/audit alert"],
    category: "Corporate Strategy",
    free: false
  }
];

export default autonomousAgents;