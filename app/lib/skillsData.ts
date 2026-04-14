const skills = [
  // FREE SKILLS (First 5 available to all users)
  { id: 'lead-qualifier', icon: '🎯', name: 'Lead Qualifier', desc: 'BANT/MEDDIC lead scoring and qualification.', benefits: ['Composite score', 'Next actions', 'CRM triggers'], category: 'Marketing', free: true },
  { id: 'meeting-scheduler', icon: '📅', name: 'Meeting Scheduler', desc: 'Calendar sync, proposals, and reminders.', benefits: ['Google/Outlook sync', 'Auto-agenda', 'Reminders'], free: true },
  { id: 'negotiation-engine', icon: '🤝', name: 'Negotiation Engine', desc: 'Objection handling and counter-offer strategies.', benefits: ['Concession sequencing','ROI impact','Audit trail'], free: true },
  { id: 'email-orchestrator', icon: '✉️', name: 'Email Orchestrator', desc: 'Multi-step email sequences with personalization.', benefits: ['A/B testing','Liquid templates','Reply triggers'], free: true },
  { id: 'analytics-hub', icon: '📊', name: 'Analytics Hub', desc: 'Pipeline analytics and forecasting.', benefits: ['Funnel metrics','Forecasts','Custom dashboards'], free: true },

  // PAID SKILLS (Require Pro tier or individual purchase)
  { id: 'bidding-engine', icon: '🏷️', name: 'Bidding Engine', desc: 'Dynamic pricing and RFQ responses.', benefits: ['Margin optimization','Scenario analysis','Proposal generation'], category: 'Finance', free: false },
  { id: 'crm-sync', icon: '🔗', name: 'CRM Sync', desc: 'Universal CRM integration hub.', benefits: ['Salesforce/HubSpot connectors','Conflict resolution','Audit logs'], free: false },
  { id: 'crypto', icon: '📈', name: 'Crypto Quant Pro', desc: 'Institutional-grade quantitative analysis for crypto options and volatility signals.', benefits: ['Real-time GREEKS tracking','Delta-Neutral hedging','Exchange API integration'], free: false },
  { id: 'real-estate', icon: '🏠', name: 'Real Estate Pro', desc: 'High-precision commercial investment underwriting, calculating Cap Rate and IRR.', benefits: ['Multi-year IRR projections','Market comp analysis','Automated memorandums'], free: false },
  { id: 'whatsapp', icon: '💬', name: 'WhatsApp CRM Pro', desc: 'Scalable CRM orchestration and high-conversion automation for enterprise communication.', benefits: ['High-deliverability routing','Liquid-template personalization','Webhook integration'], free: false },
  { id: 'b2b-leads', icon: '🔍', name: 'LeadScraper Pro', desc: 'Extract verified decision-maker contact data from any company domain.', benefits: ['Direct-dial phone numbers','98% Email verification','Salesforce/HubSpot export'], free: false },
  { id: 'github-review', icon: '🛡️', name: 'Security Code Pro', desc: 'Comprehensive security review for pull requests, identifying vulnerabilities.', benefits: ['SOC2 compliance scanning','Static & Dynamic analysis','Auto-Fix CLI commands'], free: false },
  { id: 'aws-cost', icon: '☁️', name: 'AWS Cost Optimizer', desc: 'Automated cloud infrastructure scanning to detect idle resources and anomalies.', benefits: ['Idle EC2/EBS detection','One-click cost reduction scripts','IAM-secured read access'], category: 'Finance', free: false },
  { id: 'legal-risk', icon: '⚖️', name: 'Legal Counsel Pro', desc: 'High-liability risk assessment for NDAs and enterprise vendor agreements.', benefits: ['IP trap detection','Enforceability risk scoring','Redlined counter-offers'], free: false },
  { id: 'seo-audit', icon: '🚀', name: 'SEO Technical Pro', desc: 'Instant technical health checks, crawling sites for ranking bottlenecks.', benefits: ['Core Web Vitals audit','H1/Meta tag optimization','White-label PDF reporting'], category: 'Marketing', free: false },
  { id: 'linkedin-pro', icon: '👔', name: 'LinkedIn Ghostwriter', desc: 'Generate viral, high-converting social copy optimized for professional feeds.', benefits: ['Scroll-stopping hook generation','A/B tone testing','Automated profile scheduling'], category: 'Marketing', free: false },
  { id: 'yt-predictor', icon: '🎥', name: 'Creator Vision Pro', desc: 'Vision AI analysis to predict YouTube thumbnail performance and CTR.', benefits: ['Eye-tracking Heatmap simulation','A/B test concept scoring','Contrast & emotion analysis'], category: 'Marketing', free: false },
  { id: 'stripe-invoice', icon: '💳', name: 'Stripe Invoicer Pro', desc: 'Instantly generate professional invoices and real payment links from a chat prompt.', benefits: ['Stripe Connect integration','Automated receipt generation','Multi-currency support'], category: 'Finance', free: false },

  // ALWAYS FREE TIER SKILLS
  { id: 'telegram-connector-free', icon: '📲', name: 'Telegram Connector (Free)', desc: 'Basic Telegram bot actions and webhooks for small projects.', benefits: ['Send messages','Simple webhooks','Command replies'], free: true },
  { id: 'slack-lite', icon: '💬', name: 'Slack Lite (Free)', desc: 'Lightweight Slack automation for notifications and quick replies.', benefits: ['Post messages','Slash command handlers','Webhook triggers'], category: 'Marketing', free: true },
  { id: 'rss-aggregator-free', icon: '📰', name: 'RSS Aggregator (Free)', desc: 'Aggregate RSS feeds into digestible summaries.', benefits: ['Feed consolidation','Daily digests','Simple tagging'], free: true },
  { id: 'public-announcer-free', icon: '📣', name: 'Public Announcer (Free)', desc: 'Post public announcements across channels.', benefits: ['One-click broadcast','Scheduled posts','Basic analytics'], category: 'Marketing', free: true },
  { id: 'calendar-sync-free', icon: '📆', name: 'Calendar Sync (Free)', desc: 'Two-way calendar syncing for personal use.', benefits: ['Read/write events','Basic conflict detection','Timezone handling'], free: true },
  
  // ADDITIONAL SKILLS
  { id: 'office-ops-coordinator', icon: '🏢', name: 'Office Ops Coordinator', desc: 'Facilities, desk bookings and service request orchestration.', benefits: ['Ticketing','Visitor coordination','Resource reservations'], free: false },
  { id: 'meeting-minutes-manager', icon: '📝', name: 'Meeting Minutes Manager', desc: 'Summarize meetings and extract action items automatically.', benefits: ['Transcript summarization','Action item extraction','Distribution'], free: false },
  { id: 'expense-reporting-bot', icon: '🧾', name: 'Expense Reporting Bot', desc: 'Expense validation, policy checks and finance-ready reports.', benefits: ['Receipt matching','Policy enforcement','Export to accounting'], category: 'Finance', free: false },
  { id: 'project-status-dashboard', icon: '📈', name: 'Project Status Dashboard', desc: 'Executive project health, milestones and risk reporting.', benefits: ['Risk matrix','Milestone tracking','Executive summaries'], free: false },
  { id: 'hr-onboarding-assistant', icon: '🎓', name: 'HR Onboarding Assistant', desc: 'Onboarding plans, compliance checklists, and follow-ups for new hires.', benefits: ['Custom plans','Document tracking','Mentor assignments'], free: false },
  { id: 'contract-draft-assistant', icon: '📜', name: 'Contract Draft Assistant', desc: 'Draft contracts, redlines and negotiation notes.', benefits: ['Draft templates','Risk callouts','Negotiation suggestions'], free: false },
  { id: 'invoice-payments-manager', icon: '🧾', name: 'Invoice Payments Manager', desc: 'Track invoices, payments, and collections workflows.', benefits: ['Reconciliation','Overdue alerts','Collection plans'], category: 'Finance', free: false },
  { id: 'knowledge-hub-curator', icon: '📚', name: 'Knowledge Hub Curator', desc: 'Curate internal docs and create summaries for teams.', benefits: ['Searchable summaries','Update plan','Content map'], free: false },
  { id: 'task-prioritization-engine', icon: '⚡', name: 'Task Prioritization Engine', desc: 'Rank tasks by impact, urgency and effort to generate delivery plans.', benefits: ['Priority scoring','Resource plan','Risk notes'], free: false },
  { id: 'procurement-bid-coordinator', icon: '🧾', name: 'Procurement Bid Coordinator', desc: 'Compare vendor bids and recommend purchase decisions.', benefits: ['Vendor scoring','Risk assessment','PO generation'], free: false }
];

export default skills;
