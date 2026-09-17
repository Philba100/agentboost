import { autonomousAgents } from './agentsData';

export interface SkillItem {
  id: string;
  icon: string;
  name: string;
  desc: string;
  benefits: string[];
  category?: string;
  free?: boolean;
}

// All 100+ institutional enterprise skills preserved completely
const baseSkills: SkillItem[] = [
  // 5 High-Leverage Business Paperwork Automation Skills
  {
    id: "trade-lc-auditor",
    icon: "🚢",
    name: "Letter of Credit & Trade Auditor",
    desc: "Scans bank LCs, bills of lading, and shipping manifests to eliminate discrepancy rejections and release escrow capital.",
    benefits: [
      "Zero-demurrage discrepancy checks",
      "Tolerance & date mismatch audit",
      "Bank presentation compliance"
    ],
    category: "Logistics & Trade",
    free: false
  },
  {
    id: "ap-three-way-match",
    icon: "📑",
    name: "Invoice & PO 3-Way Matcher",
    desc: "Autonomous reconciliation of vendor invoices against purchase orders and warehouse goods receipts (GRN).",
    benefits: [
      "Overbilling & shortfall detection",
      "Automatic tax/VAT recalculation",
      "Vendor credit note generation"
    ],
    category: "Finance & Accounting",
    free: false
  },
  {
    id: "corporate-governance-bot",
    name: "Board Resolution & Governance Engine",
    icon: "🏛️",
    desc: "Generates legally binding corporate board resolutions, UBO filings, and trade license renewal dossiers.",
    benefits: [
      "Instant resolution drafting",
      "UBO & AML compliance audit",
      "Commercial registry filing readiness"
    ],
    category: "Legal & Compliance",
    free: false
  },
  {
    id: "lease-contract-generator",
    icon: "🏢",
    name: "Commercial Lease & Ejari Drafter",
    desc: "Automates tenancy contracts, statutory rent index escalation limits, and mandatory regulatory addendums.",
    benefits: [
      "Statutory rent cap auditing",
      "Cheque & deposit schedules",
      "Rental dispute center compliance"
    ],
    category: "Real Estate & Assets",
    free: false
  },
  {
    id: "payroll-wps-auditor",
    icon: "💼",
    name: "WPS Payroll & Gratuity Calculator",
    desc: "Pre-flight audit for SIF payroll files and exact statutory end-of-service benefit calculations.",
    benefits: [
      "SIF payroll error prevention",
      "Accurate statutory severance math",
      "Zero labor ministry infractions"
    ],
    category: "Operations & HR",
    free: false
  },
  {
    id: "lead-qualifier",
    icon: "🎯",
    name: "Lead Qualifier",
    desc: "BANT/MEDDIC lead scoring and qualification.",
    benefits: [
      "Composite score",
      "Next actions",
      "CRM triggers"
    ],
    category: "Marketing",
    free: true
  },
  {
    id: "meeting-scheduler",
    icon: "📅",
    name: "Meeting Scheduler",
    desc: "Calendar sync, proposals, and reminders.",
    benefits: [
      "Google/Outlook sync",
      "Auto-agenda",
      "Reminders"
    ],
    category: "Operations & HR",
    free: true
  },
  {
    id: "negotiation-engine",
    icon: "🤝",
    name: "Negotiation Engine",
    desc: "Objection handling and counter-offer strategies.",
    benefits: [
      "Concession sequencing",
      "ROI impact",
      "Audit trail"
    ],
    category: "Sales",
    free: true
  },
  {
    id: "email-orchestrator",
    icon: "✉️",
    name: "Email Orchestrator",
    desc: "Multi-step email sequences with personalization.",
    benefits: [
      "A/B testing",
      "Liquid templates",
      "Reply triggers"
    ],
    category: "Marketing",
    free: true
  },
  {
    id: "analytics-hub",
    icon: "📊",
    name: "Analytics Hub",
    desc: "Pipeline analytics and forecasting.",
    benefits: [
      "Funnel metrics",
      "Forecasts",
      "Custom dashboards"
    ],
    category: "Data Science",
    free: true
  },
  {
    id: "bidding-engine",
    icon: "🏷️",
    name: "Bidding Engine",
    desc: "Dynamic pricing and RFQ responses.",
    benefits: [
      "Margin optimization",
      "Scenario analysis",
      "Proposal generation"
    ],
    category: "Finance",
    free: false
  },
  {
    id: "crm-sync",
    icon: "🔗",
    name: "CRM Sync",
    desc: "Universal CRM integration hub.",
    benefits: [
      "Salesforce/HubSpot connectors",
      "Conflict resolution",
      "Audit logs"
    ],
    category: "Operations & HR",
    free: false
  },
  {
    id: "crypto",
    icon: "📈",
    name: "Crypto Quant Pro",
    desc: "Institutional-grade quantitative analysis for crypto options and volatility signals.",
    benefits: [
      "Real-time GREEKS tracking",
      "Delta-Neutral hedging",
      "Exchange API integration"
    ],
    category: "Finance",
    free: false
  },
  {
    id: "real-estate",
    icon: "🏠",
    name: "Real Estate Pro",
    desc: "High-precision commercial investment underwriting, calculating Cap Rate and IRR.",
    benefits: [
      "Multi-year IRR projections",
      "Market comp analysis",
      "Automated memorandums"
    ],
    category: "Real Estate & Assets",
    free: false
  },
  {
    id: "whatsapp",
    icon: "💬",
    name: "WhatsApp CRM Pro",
    desc: "Scalable CRM orchestration and high-conversion automation for enterprise communication.",
    benefits: [
      "High-deliverability routing",
      "Liquid-template personalization",
      "Webhook integration"
    ],
    category: "Marketing",
    free: false
  },
  {
    id: "b2b-leads",
    icon: "🔍",
    name: "LeadScraper Pro",
    desc: "Extract verified decision-maker contact data from any company domain.",
    benefits: [
      "Direct-dial phone numbers",
      "98% Email verification",
      "Salesforce/HubSpot export"
    ],
    category: "Sales",
    free: false
  },
  {
    id: "github-review",
    icon: "🛡️",
    name: "Security Code Pro",
    desc: "Comprehensive security review for pull requests, identifying vulnerabilities.",
    benefits: [
      "SOC2 compliance scanning",
      "Static & Dynamic analysis",
      "Auto-Fix CLI commands"
    ],
    category: "Security",
    free: false
  },
  {
    id: "aws-cost",
    icon: "☁️",
    name: "AWS Cost Optimizer",
    desc: "Automated cloud infrastructure scanning to detect idle resources and anomalies.",
    benefits: [
      "Idle EC2/EBS detection",
      "One-click cost reduction scripts",
      "IAM-secured read access"
    ],
    category: "Finance",
    free: false
  },
  {
    id: "legal-risk",
    icon: "⚖️",
    name: "Legal Counsel Pro",
    desc: "High-liability risk assessment for NDAs and enterprise vendor agreements.",
    benefits: [
      "IP trap detection",
      "Enforceability risk scoring",
      "Redlined counter-offers"
    ],
    category: "Legal & Compliance",
    free: false
  },
  {
    id: "seo-audit",
    icon: "🚀",
    name: "SEO Technical Pro",
    desc: "Instant technical health checks, crawling sites for ranking bottlenecks.",
    benefits: [
      "Core Web Vitals audit",
      "H1/Meta tag optimization",
      "White-label PDF reporting"
    ],
    category: "Marketing",
    free: false
  },
  {
    id: "linkedin-pro",
    icon: "👔",
    name: "LinkedIn Ghostwriter",
    desc: "Generate viral, high-converting social copy optimized for professional feeds.",
    benefits: [
      "Scroll-stopping hook generation",
      "A/B tone testing",
      "Automated profile scheduling"
    ],
    category: "Marketing",
    free: false
  },
  {
    id: "yt-predictor",
    icon: "🎥",
    name: "Creator Vision Pro",
    desc: "Vision AI analysis to predict YouTube thumbnail performance and CTR.",
    benefits: [
      "Eye-tracking Heatmap simulation",
      "A/B test concept scoring",
      "Contrast & emotion analysis"
    ],
    category: "Marketing",
    free: false
  },
  {
    id: "stripe-invoice",
    icon: "💳",
    name: "Stripe Invoicer Pro",
    desc: "Instantly generate professional invoices and real payment links from a chat prompt.",
    benefits: [
      "Stripe Connect integration",
      "Automated receipt generation",
      "Multi-currency support"
    ],
    category: "Finance",
    free: false
  },
  {
    id: "telegram-connector-free",
    icon: "📲",
    name: "Telegram Connector (Free)",
    desc: "Basic Telegram bot actions and webhooks for small projects.",
    benefits: [
      "Send messages",
      "Simple webhooks",
      "Command replies"
    ],
    category: "Communications",
    free: true
  },
  {
    id: "slack-lite",
    icon: "💬",
    name: "Slack Lite (Free)",
    desc: "Lightweight Slack automation for notifications and quick replies.",
    benefits: [
      "Post messages",
      "Slash command handlers",
      "Webhook triggers"
    ],
    category: "Marketing",
    free: true
  },
  {
    id: "rss-aggregator-free",
    icon: "📰",
    name: "RSS Aggregator (Free)",
    desc: "Aggregate RSS feeds into digestible summaries.",
    benefits: [
      "Feed consolidation",
      "Daily digests",
      "Simple tagging"
    ],
    category: "Communications",
    free: true
  },
  {
    id: "public-announcer-free",
    icon: "📣",
    name: "Public Announcer (Free)",
    desc: "Post public announcements across channels.",
    benefits: [
      "One-click broadcast",
      "Scheduled posts",
      "Basic analytics"
    ],
    category: "Marketing",
    free: true
  },
  {
    id: "calendar-sync-free",
    icon: "📆",
    name: "Calendar Sync (Free)",
    desc: "Two-way calendar syncing for personal use.",
    benefits: [
      "Read/write events",
      "Basic conflict detection",
      "Timezone handling"
    ],
    category: "Operations & HR",
    free: true
  },
  {
    id: "office-ops-coordinator",
    icon: "🏢",
    name: "Office Ops Coordinator",
    desc: "Facilities, desk bookings and service request orchestration.",
    benefits: [
      "Ticketing",
      "Visitor coordination",
      "Resource reservations"
    ],
    category: "Operations & HR",
    free: false
  },
  {
    id: "meeting-minutes-manager",
    icon: "📝",
    name: "Meeting Minutes Manager",
    desc: "Summarize meetings and extract action items automatically.",
    benefits: [
      "Transcript summarization",
      "Action item extraction",
      "Distribution"
    ],
    category: "Operations & HR",
    free: false
  },
  {
    id: "expense-reporting-bot",
    icon: "🧾",
    name: "Expense Reporting Bot",
    desc: "Expense validation, policy checks and finance-ready reports.",
    benefits: [
      "Receipt matching",
      "Policy enforcement",
      "Export to accounting"
    ],
    category: "Finance",
    free: false
  },
  {
    id: "project-status-dashboard",
    icon: "📈",
    name: "Project Status Dashboard",
    desc: "Executive project health, milestones and risk reporting.",
    benefits: [
      "Risk matrix",
      "Milestone tracking",
      "Executive summaries"
    ],
    category: "Operations & HR",
    free: false
  },
  {
    id: "hr-onboarding-assistant",
    icon: "🎓",
    name: "HR Onboarding Assistant",
    desc: "Onboarding plans, compliance checklists, and follow-ups for new hires.",
    benefits: [
      "Custom plans",
      "Document tracking",
      "Mentor assignments"
    ],
    category: "Operations & HR",
    free: false
  },
  {
    id: "contract-draft-assistant",
    icon: "📜",
    name: "Contract Draft Assistant",
    desc: "Draft contracts, redlines and negotiation notes.",
    benefits: [
      "Draft templates",
      "Risk callouts",
      "Negotiation suggestions"
    ],
    category: "Legal & Compliance",
    free: false
  },
  {
    id: "invoice-payments-manager",
    icon: "🧾",
    name: "Invoice Payments Manager",
    desc: "Track invoices, payments, and collections workflows.",
    benefits: [
      "Reconciliation",
      "Overdue alerts",
      "Collection plans"
    ],
    category: "Finance",
    free: false
  },
  {
    id: "knowledge-hub-curator",
    icon: "📚",
    name: "Knowledge Hub Curator",
    desc: "Curate internal docs and create summaries for teams.",
    benefits: [
      "Searchable summaries",
      "Update plan",
      "Content map"
    ],
    category: "Operations & HR",
    free: false
  },
  {
    id: "task-prioritization-engine",
    icon: "⚡",
    name: "Task Prioritization Engine",
    desc: "Rank tasks by impact, urgency and effort to generate delivery plans.",
    benefits: [
      "Priority scoring",
      "Resource plan",
      "Risk notes"
    ],
    category: "Operations & HR",
    free: false
  },
  {
    id: "procurement-bid-coordinator",
    icon: "🧾",
    name: "Procurement Bid Coordinator",
    desc: "Compare vendor bids and recommend purchase decisions.",
    benefits: [
      "Vendor scoring",
      "Risk assessment",
      "PO generation"
    ],
    category: "Procurement & Supply",
    free: false
  },
  {
    id: "board-room-advisor",
    icon: "🏛️",
    name: "Board Room Advisor",
    desc: "Professional enterprise agent for Board Room Advisor within the Corporate Strategy sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Corporate Strategy",
    free: false
  },
  {
    id: "competitor-intelligence-scout",
    icon: "🏛️",
    name: "Competitor Intelligence Scout",
    desc: "Professional enterprise agent for Competitor Intelligence Scout within the Corporate Strategy sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Corporate Strategy",
    free: false
  },
  {
    id: "ma-due-diligence-specialist",
    icon: "🏛️",
    name: "Ma Due Diligence Specialist",
    desc: "Professional enterprise agent for Ma Due Diligence Specialist within the Corporate Strategy sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Corporate Strategy",
    free: false
  },
  {
    id: "corporate-risk-radar",
    icon: "🏛️",
    name: "Corporate Risk Radar",
    desc: "Professional enterprise agent for Corporate Risk Radar within the Corporate Strategy sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Corporate Strategy",
    free: false
  },
  {
    id: "okr-alignment-engine",
    icon: "🏛️",
    name: "Okr Alignment Engine",
    desc: "Professional enterprise agent for Okr Alignment Engine within the Corporate Strategy sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Corporate Strategy",
    free: false
  },
  {
    id: "esg-compliance-auditor",
    icon: "🏛️",
    name: "Esg Compliance Auditor",
    desc: "Professional enterprise agent for Esg Compliance Auditor within the Corporate Strategy sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Corporate Strategy",
    free: false
  },
  {
    id: "crisis-response-simulator",
    icon: "🏛️",
    name: "Crisis Response Simulator",
    desc: "Professional enterprise agent for Crisis Response Simulator within the Corporate Strategy sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Corporate Strategy",
    free: false
  },
  {
    id: "annual-report-synthesizer",
    icon: "🏛️",
    name: "Annual Report Synthesizer",
    desc: "Professional enterprise agent for Annual Report Synthesizer within the Corporate Strategy sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Corporate Strategy",
    free: false
  },
  {
    id: "quarterly-business-reviewer",
    icon: "🏛️",
    name: "Quarterly Business Reviewer",
    desc: "Professional enterprise agent for Quarterly Business Reviewer within the Corporate Strategy sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Corporate Strategy",
    free: false
  },
  {
    id: "cap-table-scenario-planner",
    icon: "🏛️",
    name: "Cap Table Scenario Planner",
    desc: "Professional enterprise agent for Cap Table Scenario Planner within the Corporate Strategy sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Corporate Strategy",
    free: false
  },
  {
    id: "talent-sourcing-engine",
    icon: "👥",
    name: "Talent Sourcing Engine",
    desc: "Professional enterprise agent for Talent Sourcing Engine within the Operations & HR sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Operations & HR",
    free: false
  },
  {
    id: "performance-review-synthesizer",
    icon: "👥",
    name: "Performance Review Synthesizer",
    desc: "Professional enterprise agent for Performance Review Synthesizer within the Operations & HR sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Operations & HR",
    free: false
  },
  {
    id: "compliance-policy-alignment-bot",
    icon: "👥",
    name: "Compliance Policy Alignment Bot",
    desc: "Professional enterprise agent for Compliance Policy Alignment Bot within the Operations & HR sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Operations & HR",
    free: false
  },
  {
    id: "onboarding-workflow-automator",
    icon: "👥",
    name: "Onboarding Workflow Automator",
    desc: "Professional enterprise agent for Onboarding Workflow Automator within the Operations & HR sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Operations & HR",
    free: false
  },
  {
    id: "payroll-anomaly-detector",
    icon: "👥",
    name: "Payroll Anomaly Detector",
    desc: "Professional enterprise agent for Payroll Anomaly Detector within the Operations & HR sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Operations & HR",
    free: false
  },
  {
    id: "employee-sentiment-tracker",
    icon: "👥",
    name: "Employee Sentiment Tracker",
    desc: "Professional enterprise agent for Employee Sentiment Tracker within the Operations & HR sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Operations & HR",
    free: false
  },
  {
    id: "training-curriculum-builder",
    icon: "👥",
    name: "Training Curriculum Builder",
    desc: "Professional enterprise agent for Training Curriculum Builder within the Operations & HR sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Operations & HR",
    free: false
  },
  {
    id: "benefits-package-optimizer",
    icon: "👥",
    name: "Benefits Package Optimizer",
    desc: "Professional enterprise agent for Benefits Package Optimizer within the Operations & HR sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Operations & HR",
    free: false
  },
  {
    id: "interview-question-generator",
    icon: "👥",
    name: "Interview Question Generator",
    desc: "Professional enterprise agent for Interview Question Generator within the Operations & HR sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Operations & HR",
    free: false
  },
  {
    id: "workplace-safety-auditor",
    icon: "👥",
    name: "Workplace Safety Auditor",
    desc: "Professional enterprise agent for Workplace Safety Auditor within the Operations & HR sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Operations & HR",
    free: false
  },
  {
    id: "omnichannel-campaign-planner",
    icon: "🚀",
    name: "Omnichannel Campaign Planner",
    desc: "Professional enterprise agent for Omnichannel Campaign Planner within the Marketing sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Marketing",
    free: false
  },
  {
    id: "competitor-ad-audit-bot",
    icon: "🚀",
    name: "Competitor Ad Audit Bot",
    desc: "Professional enterprise agent for Competitor Ad Audit Bot within the Marketing sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Marketing",
    free: false
  },
  {
    id: "pr-distribution-optimizer",
    icon: "🚀",
    name: "Pr Distribution Optimizer",
    desc: "Professional enterprise agent for Pr Distribution Optimizer within the Marketing sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Marketing",
    free: false
  },
  {
    id: "seo-semantic-cluster-builder",
    icon: "🚀",
    name: "Seo Semantic Cluster Builder",
    desc: "Professional enterprise agent for Seo Semantic Cluster Builder within the Marketing sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Marketing",
    free: false
  },
  {
    id: "social-hook-generator",
    icon: "🚀",
    name: "Social Hook Generator",
    desc: "Professional enterprise agent for Social Hook Generator within the Marketing sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Marketing",
    free: false
  },
  {
    id: "brand-voice-validator",
    icon: "🚀",
    name: "Brand Voice Validator",
    desc: "Professional enterprise agent for Brand Voice Validator within the Marketing sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Marketing",
    free: false
  },
  {
    id: "influencer-roster-vetter",
    icon: "🚀",
    name: "Influencer Roster Vetter",
    desc: "Professional enterprise agent for Influencer Roster Vetter within the Marketing sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Marketing",
    free: false
  },
  {
    id: "newsletter-editorial-planner",
    icon: "🚀",
    name: "Newsletter Editorial Planner",
    desc: "Professional enterprise agent for Newsletter Editorial Planner within the Marketing sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Marketing",
    free: false
  },
  {
    id: "conversion-rate-copy-optimizer",
    icon: "🚀",
    name: "Conversion Rate Copy Optimizer",
    desc: "Professional enterprise agent for Conversion Rate Copy Optimizer within the Marketing sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Marketing",
    free: false
  },
  {
    id: "utm-funnel-analyzer",
    icon: "🚀",
    name: "Utm Funnel Analyzer",
    desc: "Professional enterprise agent for Utm Funnel Analyzer within the Marketing sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Marketing",
    free: false
  },
  {
    id: "inventory-predictive-replenisher",
    icon: "📦",
    name: "Inventory Predictive Replenisher",
    desc: "Professional enterprise agent for Inventory Predictive Replenisher within the Logistics sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Logistics",
    free: false
  },
  {
    id: "tariff-custom-compliance-scan",
    icon: "📦",
    name: "Tariff Custom Compliance Scan",
    desc: "Professional enterprise agent for Tariff Custom Compliance Scan within the Logistics sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Logistics",
    free: false
  },
  {
    id: "vendor-contract-renegotiator",
    icon: "📦",
    name: "Vendor Contract Renegotiator",
    desc: "Professional enterprise agent for Vendor Contract Renegotiator within the Logistics sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Logistics",
    free: false
  },
  {
    id: "route-efficiency-optimizer",
    icon: "📦",
    name: "Route Efficiency Optimizer",
    desc: "Professional enterprise agent for Route Efficiency Optimizer within the Logistics sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Logistics",
    free: false
  },
  {
    id: "cold-chain-anomaly-monitor",
    icon: "📦",
    name: "Cold Chain Anomaly Monitor",
    desc: "Professional enterprise agent for Cold Chain Anomaly Monitor within the Logistics sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Logistics",
    free: false
  },
  {
    id: "warehouse-space-utilizer",
    icon: "📦",
    name: "Warehouse Space Utilizer",
    desc: "Professional enterprise agent for Warehouse Space Utilizer within the Logistics sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Logistics",
    free: false
  },
  {
    id: "supplier-risk-indexer",
    icon: "📦",
    name: "Supplier Risk Indexer",
    desc: "Professional enterprise agent for Supplier Risk Indexer within the Logistics sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Logistics",
    free: false
  },
  {
    id: "carbon-footprint-ledger",
    icon: "📦",
    name: "Carbon Footprint Ledger",
    desc: "Professional enterprise agent for Carbon Footprint Ledger within the Logistics sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Logistics",
    free: false
  },
  {
    id: "last-mile-delivery-tracker",
    icon: "📦",
    name: "Last Mile Delivery Tracker",
    desc: "Professional enterprise agent for Last Mile Delivery Tracker within the Logistics sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Logistics",
    free: false
  },
  {
    id: "procurement-price-benchmarker",
    icon: "📦",
    name: "Procurement Price Benchmarker",
    desc: "Professional enterprise agent for Procurement Price Benchmarker within the Logistics sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Logistics",
    free: false
  },
  {
    id: "sentiment-escalation-triage",
    icon: "🤝",
    name: "Sentiment Escalation Triage",
    desc: "Professional enterprise agent for Sentiment Escalation Triage within the Customer Success sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Customer Success",
    free: false
  },
  {
    id: "product-knowledgebase-sync",
    icon: "🤝",
    name: "Product Knowledgebase Sync",
    desc: "Professional enterprise agent for Product Knowledgebase Sync within the Customer Success sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Customer Success",
    free: false
  },
  {
    id: "upsell-trigger-assistant",
    icon: "🤝",
    name: "Upsell Trigger Assistant",
    desc: "Professional enterprise agent for Upsell Trigger Assistant within the Customer Success sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Customer Success",
    free: false
  },
  {
    id: "churn-risk-forecaster",
    icon: "🤝",
    name: "Churn Risk Forecaster",
    desc: "Professional enterprise agent for Churn Risk Forecaster within the Customer Success sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Customer Success",
    free: false
  },
  {
    id: "nps-feedback-categorizer",
    icon: "🤝",
    name: "Nps Feedback Categorizer",
    desc: "Professional enterprise agent for Nps Feedback Categorizer within the Customer Success sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Customer Success",
    free: false
  },
  {
    id: "onboarding-friction-locator",
    icon: "🤝",
    name: "Onboarding Friction Locator",
    desc: "Professional enterprise agent for Onboarding Friction Locator within the Customer Success sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Customer Success",
    free: false
  },
  {
    id: "sla-breach-predictor",
    icon: "🤝",
    name: "Sla Breach Predictor",
    desc: "Professional enterprise agent for Sla Breach Predictor within the Customer Success sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Customer Success",
    free: false
  },
  {
    id: "customer-advocacy-identifier",
    icon: "🤝",
    name: "Customer Advocacy Identifier",
    desc: "Professional enterprise agent for Customer Advocacy Identifier within the Customer Success sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Customer Success",
    free: false
  },
  {
    id: "frequently-asked-questions-builder",
    icon: "🤝",
    name: "Frequently Asked Questions Builder",
    desc: "Professional enterprise agent for Frequently Asked Questions Builder within the Customer Success sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Customer Success",
    free: false
  },
  {
    id: "multilingual-support-translator",
    icon: "🤝",
    name: "Multilingual Support Translator",
    desc: "Professional enterprise agent for Multilingual Support Translator within the Customer Success sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Customer Success",
    free: false
  },
  {
    id: "invoice-anomaly-detector",
    icon: "💰",
    name: "Invoice Anomaly Detector",
    desc: "Professional enterprise agent for Invoice Anomaly Detector within the Finance sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Finance",
    free: false
  },
  {
    id: "contract-risk-analyzer",
    icon: "💰",
    name: "Contract Risk Analyzer",
    desc: "Professional enterprise agent for Contract Risk Analyzer within the Finance sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Finance",
    free: false
  },
  {
    id: "tax-deductions-finder",
    icon: "💰",
    name: "Tax Deductions Finder",
    desc: "Professional enterprise agent for Tax Deductions Finder within the Finance sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Finance",
    free: false
  },
  {
    id: "expense-policy-enforcer",
    icon: "💰",
    name: "Expense Policy Enforcer",
    desc: "Professional enterprise agent for Expense Policy Enforcer within the Finance sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Finance",
    free: false
  },
  {
    id: "cashflow-runway-forecaster",
    icon: "💰",
    name: "Cashflow Runway Forecaster",
    desc: "Professional enterprise agent for Cashflow Runway Forecaster within the Finance sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Finance",
    free: false
  },
  {
    id: "nda-clause-validator",
    icon: "💰",
    name: "Nda Clause Validator",
    desc: "Professional enterprise agent for Nda Clause Validator within the Finance sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Finance",
    free: false
  },
  {
    id: "procurement-auditor",
    icon: "💰",
    name: "Procurement Auditor",
    desc: "Professional enterprise agent for Procurement Auditor within the Finance sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Finance",
    free: false
  },
  {
    id: "subscription-seat-pruner",
    icon: "💰",
    name: "Subscription Seat Pruner",
    desc: "Professional enterprise agent for Subscription Seat Pruner within the Finance sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Finance",
    free: false
  },
  {
    id: "patent-landscape-explorer",
    icon: "💰",
    name: "Patent Landscape Explorer",
    desc: "Professional enterprise agent for Patent Landscape Explorer within the Finance sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Finance",
    free: false
  },
  {
    id: "debt-collection-prioritizer",
    icon: "💰",
    name: "Debt Collection Prioritizer",
    desc: "Professional enterprise agent for Debt Collection Prioritizer within the Finance sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Finance",
    free: false
  },
  {
    id: "lead-qualifier-bant",
    icon: "🎯",
    name: "Lead Qualifier Bant",
    desc: "Professional enterprise agent for Lead Qualifier Bant within the Sales sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Sales",
    free: false
  },
  {
    id: "objection-handling-playbook",
    icon: "🎯",
    name: "Objection Handling Playbook",
    desc: "Professional enterprise agent for Objection Handling Playbook within the Sales sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Sales",
    free: false
  },
  {
    id: "rfp-response-builder",
    icon: "🎯",
    name: "Rfp Response Builder",
    desc: "Professional enterprise agent for Rfp Response Builder within the Sales sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Sales",
    free: false
  },
  {
    id: "deal-slippage-diagnostic",
    icon: "🎯",
    name: "Deal Slippage Diagnostic",
    desc: "Professional enterprise agent for Deal Slippage Diagnostic within the Sales sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Sales",
    free: false
  },
  {
    id: "competitor-battlecard-generator",
    icon: "🎯",
    name: "Competitor Battlecard Generator",
    desc: "Professional enterprise agent for Competitor Battlecard Generator within the Sales sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Sales",
    free: false
  },
  {
    id: "email-outreach-sequencer",
    icon: "🎯",
    name: "Email Outreach Sequencer",
    desc: "Professional enterprise agent for Email Outreach Sequencer within the Sales sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Sales",
    free: false
  },
  {
    id: "pricing-tier-optimizer",
    icon: "🎯",
    name: "Pricing Tier Optimizer",
    desc: "Professional enterprise agent for Pricing Tier Optimizer within the Sales sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Sales",
    free: false
  },
  {
    id: "demo-feedback-analyzer",
    icon: "🎯",
    name: "Demo Feedback Analyzer",
    desc: "Professional enterprise agent for Demo Feedback Analyzer within the Sales sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Sales",
    free: false
  },
  {
    id: "account-expansion-scout",
    icon: "🎯",
    name: "Account Expansion Scout",
    desc: "Professional enterprise agent for Account Expansion Scout within the Sales sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Sales",
    free: false
  },
  {
    id: "sales-commission-calculator",
    icon: "🎯",
    name: "Sales Commission Calculator",
    desc: "Professional enterprise agent for Sales Commission Calculator within the Sales sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Sales",
    free: false
  },
  {
    id: "aws-cost-optimizer-v2",
    icon: "⚙️",
    name: "Aws Cost Optimizer V2",
    desc: "Professional enterprise agent for Aws Cost Optimizer V2 within the Product Engineering sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Product Engineering",
    free: false
  },
  {
    id: "jira-ticket-refiner",
    icon: "⚙️",
    name: "Jira Ticket Refiner",
    desc: "Professional enterprise agent for Jira Ticket Refiner within the Product Engineering sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Product Engineering",
    free: false
  },
  {
    id: "api-documentation-generator",
    icon: "⚙️",
    name: "Api Documentation Generator",
    desc: "Professional enterprise agent for Api Documentation Generator within the Product Engineering sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Product Engineering",
    free: false
  },
  {
    id: "code-security-vulnerability-scanner",
    icon: "⚙️",
    name: "Code Security Vulnerability Scanner",
    desc: "Professional enterprise agent for Code Security Vulnerability Scanner within the Product Engineering sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Product Engineering",
    free: false
  },
  {
    id: "release-notes-compiler",
    icon: "⚙️",
    name: "Release Notes Compiler",
    desc: "Professional enterprise agent for Release Notes Compiler within the Product Engineering sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Product Engineering",
    free: false
  },
  {
    id: "ux-friction-analyzer",
    icon: "⚙️",
    name: "Ux Friction Analyzer",
    desc: "Professional enterprise agent for Ux Friction Analyzer within the Product Engineering sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Product Engineering",
    free: false
  },
  {
    id: "database-query-tuner",
    icon: "⚙️",
    name: "Database Query Tuner",
    desc: "Professional enterprise agent for Database Query Tuner within the Product Engineering sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Product Engineering",
    free: false
  },
  {
    id: "localization-string-validator",
    icon: "⚙️",
    name: "Localization String Validator",
    desc: "Professional enterprise agent for Localization String Validator within the Product Engineering sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Product Engineering",
    free: false
  },
  {
    id: "technical-debt-prioritizer",
    icon: "⚙️",
    name: "Technical Debt Prioritizer",
    desc: "Professional enterprise agent for Technical Debt Prioritizer within the Product Engineering sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Product Engineering",
    free: false
  },
  {
    id: "feature-flag-dependency-mapper",
    icon: "⚙️",
    name: "Feature Flag Dependency Mapper",
    desc: "Professional enterprise agent for Feature Flag Dependency Mapper within the Product Engineering sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Product Engineering",
    free: false
  },
  {
    id: "phishing-vector-assessor",
    icon: "🛡️",
    name: "Phishing Vector Assessor",
    desc: "Professional enterprise agent for Phishing Vector Assessor within the Security sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Security",
    free: false
  },
  {
    id: "iam-privilege-audit",
    icon: "🛡️",
    name: "Iam Privilege Audit",
    desc: "Professional enterprise agent for Iam Privilege Audit within the Security sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Security",
    free: false
  },
  {
    id: "log-anomaly-hunter-v2",
    icon: "🛡️",
    name: "Log Anomaly Hunter V2",
    desc: "Professional enterprise agent for Log Anomaly Hunter V2 within the Security sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Security",
    free: false
  },
  {
    id: "disaster-recovery-checker",
    icon: "🛡️",
    name: "Disaster Recovery Checker",
    desc: "Professional enterprise agent for Disaster Recovery Checker within the Security sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Security",
    free: false
  },
  {
    id: "mdm-compliance-verifier",
    icon: "🛡️",
    name: "Mdm Compliance Verifier",
    desc: "Professional enterprise agent for Mdm Compliance Verifier within the Security sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Security",
    free: false
  },
  {
    id: "soc2-readiness-helper",
    icon: "🛡️",
    name: "Soc2 Readiness Helper",
    desc: "Professional enterprise agent for Soc2 Readiness Helper within the Security sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Security",
    free: false
  },
  {
    id: "hardware-lifecycle-planner",
    icon: "🛡️",
    name: "Hardware Lifecycle Planner",
    desc: "Professional enterprise agent for Hardware Lifecycle Planner within the Security sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Security",
    free: false
  },
  {
    id: "network-topology-analyzer",
    icon: "🛡️",
    name: "Network Topology Analyzer",
    desc: "Professional enterprise agent for Network Topology Analyzer within the Security sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Security",
    free: false
  },
  {
    id: "patch-vulnerability-prioritizer",
    icon: "🛡️",
    name: "Patch Vulnerability Prioritizer",
    desc: "Professional enterprise agent for Patch Vulnerability Prioritizer within the Security sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Security",
    free: false
  },
  {
    id: "api-rate-limit-tuner",
    icon: "🛡️",
    name: "Api Rate Limit Tuner",
    desc: "Professional enterprise agent for Api Rate Limit Tuner within the Security sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Security",
    free: false
  },
  {
    id: "sql-query-generator-v2",
    icon: "📊",
    name: "Sql Query Generator V2",
    desc: "Professional enterprise agent for Sql Query Generator V2 within the Data Science sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Data Science",
    free: false
  },
  {
    id: "anomaly-data-point-finder",
    icon: "📊",
    name: "Anomaly Data Point Finder",
    desc: "Professional enterprise agent for Anomaly Data Point Finder within the Data Science sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Data Science",
    free: false
  },
  {
    id: "dashboard-wireframe-planner",
    icon: "📊",
    name: "Dashboard Wireframe Planner",
    desc: "Professional enterprise agent for Dashboard Wireframe Planner within the Data Science sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Data Science",
    free: false
  },
  {
    id: "ab-test-significance-calculator",
    icon: "📊",
    name: "Ab Test Significance Calculator",
    desc: "Professional enterprise agent for Ab Test Significance Calculator within the Data Science sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Data Science",
    free: false
  },
  {
    id: "cohort-retention-modeler",
    icon: "📊",
    name: "Cohort Retention Modeler",
    desc: "Professional enterprise agent for Cohort Retention Modeler within the Data Science sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Data Science",
    free: false
  },
  {
    id: "data-lineage-tracer",
    icon: "📊",
    name: "Data Lineage Tracer",
    desc: "Professional enterprise agent for Data Lineage Tracer within the Data Science sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Data Science",
    free: false
  },
  {
    id: "missing-value-imputer",
    icon: "📊",
    name: "Missing Value Imputer",
    desc: "Professional enterprise agent for Missing Value Imputer within the Data Science sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Data Science",
    free: false
  },
  {
    id: "outlier-diagnostic-engine",
    icon: "📊",
    name: "Outlier Diagnostic Engine",
    desc: "Professional enterprise agent for Outlier Diagnostic Engine within the Data Science sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Data Science",
    free: false
  },
  {
    id: "customer-lifetime-value-predictor",
    icon: "📊",
    name: "Customer Lifetime Value Predictor",
    desc: "Professional enterprise agent for Customer Lifetime Value Predictor within the Data Science sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Data Science",
    free: false
  },
  {
    id: "multi-touch-attribution-modeler",
    icon: "📊",
    name: "Multi Touch Attribution Modeler",
    desc: "Professional enterprise agent for Multi Touch Attribution Modeler within the Data Science sector.",
    benefits: [
      "Strategic Alignment",
      "Efficiency Gains",
      "Accuracy & Compliance"
    ],
    category: "Data Science",
    free: false
  }
];

// Combine both lists so every single skill and autonomous agent is available across the clearinghouse
const transformedAgents: SkillItem[] = autonomousAgents.map((agent) => ({
  id: agent.id,
  icon: agent.icon,
  name: agent.name,
  desc: agent.desc,
  benefits: agent.capabilities,
  category: agent.category,
  free: agent.free
}));

// Export the complete merged catalog (Zero skills dropped)
export const skills: SkillItem[] = [...transformedAgents, ...baseSkills];

export default skills;