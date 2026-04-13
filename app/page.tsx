"use client";

import Link from 'next/link';
import { useState } from 'react';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';

export default function Home() {
  const [copied, setCopied] = useState(false);

  const codeSnippet = `import agentboost as ab

# Initialize autonomous fleet
client = ab.Client(api_key='sk_live_...')

# Mount institutional tools via MCP
agent.mount(client.skills.get('crypto_quant_v2'))

try:
    response = agent.execute(
        task="Optimize delta-neutral portfolio",
        strict_mode=True
    )
    print(response.metrics.sharpe_ratio)
except ab.errors.ContextLimitExceeded:
    agent.recalibrate_memory()`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const skills = [
    // Core enterprise skills
    { id: 'lead-qualifier', icon: '🎯', name: 'Lead Qualifier', desc: 'BANT/MEDDIC lead scoring and qualification.', benefits: ['Composite score', 'Next actions', 'CRM triggers'], url: '/skills/lead-qualifier/SKILL.md', demo: '/skills/lead-qualifier/scripts/index.html' },
    { id: 'meeting-scheduler', icon: '📅', name: 'Meeting Scheduler', desc: 'Calendar sync, proposals, and reminders.', benefits: ['Google/Outlook sync', 'Auto-agenda', 'Reminders'], url: '/skills/meeting-scheduler/SKILL.md', demo: '/skills/meeting-scheduler/scripts/index.html' },
    { id: 'negotiation-engine', icon: '🤝', name: 'Negotiation Engine', desc: 'Objection handling and counter-offer strategies.', benefits: ['Concession sequencing','ROI impact','Audit trail'], url: '/skills/negotiation-engine/SKILL.md', demo: '/skills/negotiation-engine/scripts/index.html' },
    { id: 'bidding-engine', icon: '🏷️', name: 'Bidding Engine', desc: 'Dynamic pricing and RFQ responses.', benefits: ['Margin optimization','Scenario analysis','Proposal generation'], url: '/skills/bidding-engine/SKILL.md', demo: '/skills/bidding-engine/scripts/index.html' },
    { id: 'email-orchestrator', icon: '✉️', name: 'Email Orchestrator', desc: 'Multi-step email sequences with personalization.', benefits: ['A/B testing','Liquid templates','Reply triggers'], url: '/skills/email-orchestrator/SKILL.md', demo: '/skills/email-orchestrator/scripts/index.html' },
    { id: 'crm-sync', icon: '🔗', name: 'CRM Sync', desc: 'Universal CRM integration hub.', benefits: ['Salesforce/HubSpot connectors','Conflict resolution','Audit logs'], url: '/skills/crm-sync/SKILL.md', demo: '/skills/crm-sync/scripts/index.html' },
    { id: 'analytics-hub', icon: '📊', name: 'Analytics Hub', desc: 'Pipeline analytics and forecasting.', benefits: ['Funnel metrics','Forecasts','Custom dashboards'], url: '/skills/analytics-hub/SKILL.md', demo: '/skills/analytics-hub/scripts/index.html' },

    // Existing product skills
    { id: 'crypto', icon: '📈', name: 'Crypto Quant Pro', desc: 'Institutional-grade quantitative analysis for crypto options and volatility signals.', benefits: ['Real-time GREEKS tracking','Delta-Neutral hedging','Exchange API integration'], url: '/skills/crypto/SKILL.md', demo: '/skills/crypto/scripts/index.html' },
    { id: 'real-estate', icon: '🏠', name: 'Real Estate Pro', desc: 'High-precision commercial investment underwriting, calculating Cap Rate and IRR.', benefits: ['Multi-year IRR projections','Market comp analysis','Automated memorandums'], url: '/skills/real-estate/SKILL.md', demo: '/skills/real-estate/scripts/index.html' },
    { id: 'whatsapp', icon: '💬', name: 'WhatsApp CRM Pro', desc: 'Scalable CRM orchestration and high-conversion automation for enterprise communication.', benefits: ['High-deliverability routing','Liquid-template personalization','Webhook integration'], url: '/skills/whatsapp/SKILL.md', demo: '/skills/whatsapp/scripts/index.html' },
    { id: 'b2b-leads', icon: '🔍', name: 'LeadScraper Pro', desc: 'Extract verified decision-maker contact data from any company domain.', benefits: ['Direct-dial phone numbers','98% Email verification','Salesforce/HubSpot export'], url: '/skills/b2b-leads/SKILL.md', demo: '/skills/b2b-leads/scripts/index.html' },
    { id: 'github-review', icon: '🛡️', name: 'Security Code Pro', desc: 'Comprehensive security review for pull requests, identifying vulnerabilities.', benefits: ['SOC2 compliance scanning','Static & Dynamic analysis','Auto-Fix CLI commands'], url: '/skills/github-review/SKILL.md', demo: '/skills/github-review/scripts/index.html' },
    { id: 'aws-cost', icon: '☁️', name: 'AWS Cost Optimizer', desc: 'Automated cloud infrastructure scanning to detect idle resources and anomalies.', benefits: ['Idle EC2/EBS detection','One-click cost reduction scripts','IAM-secured read access'], url: '/skills/aws-cost/SKILL.md', demo: '/skills/aws-cost/scripts/index.html' },
    { id: 'legal-risk', icon: '⚖️', name: 'Legal Counsel Pro', desc: 'High-liability risk assessment for NDAs and enterprise vendor agreements.', benefits: ['IP trap detection','Enforceability risk scoring','Redlined counter-offers'], url: '/skills/legal-risk/SKILL.md', demo: '/skills/legal-risk/scripts/index.htm' },
    { id: 'seo-audit', icon: '🚀', name: 'SEO Technical Pro', desc: 'Instant technical health checks, crawling sites for ranking bottlenecks.', benefits: ['Core Web Vitals audit','H1/Meta tag optimization','White-label PDF reporting'], url: '/skills/seo-audit/SKILL.md', demo: '/skills/seo-audit/scripts/index.html' },
    { id: 'linkedin-pro', icon: '👔', name: 'LinkedIn Ghostwriter', desc: 'Generate viral, high-converting social copy optimized for professional feeds.', benefits: ['Scroll-stopping hook generation','A/B tone testing','Automated profile scheduling'], url: '/skills/linkedin-pro/SKILL.md', demo: '/skills/linkedin-pro/scripts/index.html' },
    { id: 'yt-predictor', icon: '🎥', name: 'Creator Vision Pro', desc: 'Vision AI analysis to predict YouTube thumbnail performance and CTR.', benefits: ['Eye-tracking Heatmap simulation','A/B test concept scoring','Contrast & emotion analysis'], url: '/skills/yt-predictor/SKILL.md', demo: '/skills/yt-predictor/scripts/index.html' },
    { id: 'stripe-invoice', icon: '💳', name: 'Stripe Invoicer Pro', desc: 'Instantly generate professional invoices and real payment links from a chat prompt.', benefits: ['Stripe Connect integration','Automated receipt generation','Multi-currency support'], url: '/skills/stripe-invoice/SKILL.md', demo: '/skills/stripe-invoice/scripts/index.html' },

    // Free / Community skills
    { id: 'telegram-connector-free', icon: '📲', name: 'Telegram Connector (Free)', desc: 'Basic Telegram bot actions and webhooks for small projects.', benefits: ['Send messages','Simple webhooks','Command replies'], url: '/skills/telegram-connector-free/SKILL.md', demo: '/skills/telegram-connector-free/scripts/index.html' },
    { id: 'slack-lite', icon: '💬', name: 'Slack Lite (Free)', desc: 'Lightweight Slack automation for notifications and quick replies.', benefits: ['Post messages','Slash command handlers','Webhook triggers'], url: '/skills/slack-lite/SKILL.md', demo: '/skills/slack-lite/scripts/index.html' },
    { id: 'rss-aggregator-free', icon: '📰', name: 'RSS Aggregator (Free)', desc: 'Aggregate RSS feeds into digestible summaries.', benefits: ['Feed consolidation','Daily digests','Simple tagging'], url: '/skills/rss-aggregator-free/SKILL.md', demo: '/skills/rss-aggregator-free/scripts/index.html' },
    { id: 'public-announcer-free', icon: '📣', name: 'Public Announcer (Free)', desc: 'Post public announcements across channels.', benefits: ['One-click broadcast','Scheduled posts','Basic analytics'], url: '/skills/public-announcer-free/SKILL.md', demo: '/skills/public-announcer-free/scripts/index.html' },
    { id: 'calendar-sync-free', icon: '📆', name: 'Calendar Sync (Free)', desc: 'Two-way calendar syncing for personal use.', benefits: ['Read/write events','Basic conflict detection','Timezone handling'], url: '/skills/calendar-sync-free/SKILL.md', demo: '/skills/calendar-sync-free/scripts/index.html' },

    // New office apps
    { id: 'office-ops-coordinator', icon: '🏢', name: 'Office Ops Coordinator', desc: 'Facilities, desk bookings and service request orchestration.', benefits: ['Ticketing','Visitor coordination','Resource reservations'], url: '/skills/office-ops-coordinator/SKILL.md', demo: '/skills/office-ops-coordinator/scripts/index.html' },
    { id: 'meeting-minutes-manager', icon: '📝', name: 'Meeting Minutes Manager', desc: 'Summarize meetings and extract action items automatically.', benefits: ['Transcript summarization','Action item extraction','Distribution'], url: '/skills/meeting-minutes-manager/SKILL.md', demo: '/skills/meeting-minutes-manager/scripts/index.html' },
    { id: 'expense-reporting-bot', icon: '🧾', name: 'Expense Reporting Bot', desc: 'Expense validation, policy checks and finance-ready reports.', benefits: ['Receipt matching','Policy enforcement','Export to accounting'], url: '/skills/expense-reporting-bot/SKILL.md', demo: '/skills/expense-reporting-bot/scripts/index.html' },
    { id: 'project-status-dashboard', icon: '📈', name: 'Project Status Dashboard', desc: 'Executive project health, milestones and risk reporting.', benefits: ['Risk matrix','Milestone tracking','Executive summaries'], url: '/skills/project-status-dashboard/SKILL.md', demo: '/skills/project-status-dashboard/scripts/index.html' },
    { id: 'hr-onboarding-assistant', icon: '🎓', name: 'HR Onboarding Assistant', desc: 'Onboarding plans, compliance checklists, and follow-ups for new hires.', benefits: ['Custom plans','Document tracking','Mentor assignments'], url: '/skills/hr-onboarding-assistant/SKILL.md', demo: '/skills/hr-onboarding-assistant/scripts/index.html' },
    { id: 'contract-draft-assistant', icon: '📜', name: 'Contract Draft Assistant', desc: 'Draft contracts, redlines and negotiation notes.', benefits: ['Draft templates','Risk callouts','Negotiation suggestions'], url: '/skills/contract-draft-assistant/SKILL.md', demo: '/skills/contract-draft-assistant/scripts/index.html' },
    { id: 'invoice-payments-manager', icon: '🧾', name: 'Invoice Payments Manager', desc: 'Track invoices, payments, and collections workflows.', benefits: ['Reconciliation','Overdue alerts','Collection plans'], url: '/skills/invoice-payments-manager/SKILL.md', demo: '/skills/invoice-payments-manager/scripts/index.html' },
    { id: 'knowledge-hub-curator', icon: '📚', name: 'Knowledge Hub Curator', desc: 'Curate internal docs and create summaries for teams.', benefits: ['Searchable summaries','Update plan','Content map'], url: '/skills/knowledge-hub-curator/SKILL.md', demo: '/skills/knowledge-hub-curator/scripts/index.html' },
    { id: 'task-prioritization-engine', icon: '⚡', name: 'Task Prioritization Engine', desc: 'Rank tasks by impact, urgency and effort to generate delivery plans.', benefits: ['Priority scoring','Resource plan','Risk notes'], url: '/skills/task-prioritization-engine/SKILL.md', demo: '/skills/task-prioritization-engine/scripts/index.html' },
    { id: 'procurement-bid-coordinator', icon: '🧾', name: 'Procurement Bid Coordinator', desc: 'Compare vendor bids and recommend purchase decisions.', benefits: ['Vendor scoring','Risk assessment','PO generation'], url: '/skills/procurement-bid-coordinator/SKILL.md', demo: '/skills/procurement-bid-coordinator/scripts/index.html' }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans selection:bg-[#00ff9d] selection:text-[#0f172a] antialiased overflow-x-hidden">
      
      <SiteHeader />

      {/* Hero Section */}
      <header className="relative max-w-[1400px] mx-auto pt-24 pb-32 px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center">
        {/* Soft Slate Glow */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full -z-10 pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#00ff9d]/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
        
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00ff9d]/30 bg-[#00ff9d]/10 text-[11px] font-bold uppercase tracking-widest text-[#00ff9d] mb-8">
             <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff9d] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00ff9d]"></span>
            </span>
            MCP Protocol v2.4 Live
          </div>
          <h1 className="text-5xl md:text-[75px] font-semibold mb-8 leading-[1.05] tracking-tighter text-white">
            Extend your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Agent's Context.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-xl leading-relaxed font-light">
            The institutional registry for MCP tooling and Mobile AI Webviews. Equip your autonomous fleet with verified, high-fidelity deterministic skills in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/registry" className="bg-[#00ff9d] text-[#0f172a] font-semibold text-sm px-8 py-4 rounded-md hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,157,0.2)]">
              Explore Registry
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link href="/login?next=/dashboard" className="flex items-center gap-3 px-6 py-4 text-slate-300 font-mono text-[13px] border border-slate-700 rounded-md bg-slate-800/50 backdrop-blur-sm hover:border-slate-500 transition-colors justify-center">
              <span className="text-[#00ff9d]">$</span> get_api_key --auth
            </Link>
          </div>
        </div>

        {/* Technical Mockup with COPY BUTTON */}
        <div className="relative z-10 hidden lg:block">
          <div className="bg-[#1e293b] border border-slate-700 rounded-xl overflow-hidden shadow-2xl relative">
            <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-700 flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-500"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-500"></div>
                 </div>
                 <div className="ml-4 text-xs font-mono text-slate-400">agent_runtime.py</div>
               </div>
               
               {/* Copy Button */}
               <button 
                 onClick={handleCopy}
                 className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded border border-slate-700 text-xs"
               >
                 {copied ? (
                   <><span className="text-[#00ff9d]">✓</span> Copied</>
                 ) : (
                   <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copy</>
                 )}
               </button>
            </div>
            
            <div className="p-6 font-mono text-[13px] leading-relaxed overflow-x-auto text-slate-300">
              <span className="text-[#c678dd]">import</span> agentboost <span className="text-[#c678dd]">as</span> ab<br/><br/>
              <span className="text-slate-500"># Initialize autonomous fleet</span><br/>
              client <span className="text-[#56b6c2]">=</span> ab.Client(api_key<span className="text-[#56b6c2]">=</span><span className="text-[#98c379]">'sk_live_...'</span>)<br/><br/>
              <span className="text-slate-500"># Mount institutional tools via MCP</span><br/>
              agent.mount(client.skills.get(<span className="text-[#98c379]">'crypto_quant_v2'</span>))<br/><br/>
              <span className="text-[#e5c07b]">try</span>:<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;response <span className="text-[#56b6c2]">=</span> agent.execute(<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;task<span className="text-[#56b6c2]">=</span><span className="text-[#98c379]">"Optimize delta-neutral portfolio"</span>,<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strict_mode<span className="text-[#56b6c2]">=</span><span className="text-[#d19a66]">True</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;)<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#56b6c2]">print</span>(response.metrics.sharpe_ratio)<br/>
              <span className="text-[#e5c07b]">except</span> ab.errors.ContextLimitExceeded:<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;agent.recalibrate_memory()
            </div>
          </div>
        </div>
      </header>

      {/* Solutions / Registry */}
      <section id="registry" className="max-w-[1400px] mx-auto py-24 px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight text-white">Skill Registry</h2>
            <p className="text-slate-400 text-lg leading-relaxed font-light">
              Deterministically evaluated and security-audited capabilities. <br className="hidden md:block"/>
              Ready to be injected into your agent's context window or mobile device.
            </p>
          </div>
          <div className="flex gap-4 border border-slate-800 rounded-md p-1 bg-[#1e293b]">
             <button className="px-5 py-2 rounded text-[13px] font-medium bg-slate-700 text-white shadow-sm border border-slate-600">All Tools</button>
             <button className="px-5 py-2 rounded text-[13px] font-medium text-slate-400 hover:text-white transition">Finance</button>
             <button className="px-5 py-2 rounded text-[13px] font-medium text-slate-400 hover:text-white transition">Marketing</button>
          </div>
        </div>
        
        {/* 11-Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <div key={skill.id} className="group p-8 rounded-2xl bg-[#1e293b] border border-slate-700 hover:border-[#00ff9d]/40 transition-all duration-300 relative overflow-hidden flex flex-col h-full shadow-lg">
              
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00ff9d]/5 blur-[60px] rounded-full group-hover:bg-[#00ff9d]/15 transition-all duration-500 pointer-events-none"></div>

              <div className="flex items-start mb-6 relative z-10">
                <div className="text-3xl p-3 bg-[#0f172a] border border-slate-700 rounded-xl text-white shadow-inner group-hover:border-[#00ff9d]/30 transition-colors">
                  {skill.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-2 text-white tracking-tight">{skill.name}</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed font-light flex-grow">{skill.desc}</p>
              
              <div className="space-y-2 mb-8 relative z-10">
                {skill.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[12px] text-slate-300 font-light">
                    <svg className="w-4 h-4 text-[#00ff9d]/70 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {benefit}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-700 pt-6 relative z-10">
                  <Link href={`/skills/${skill.id}`} className="text-center w-full bg-slate-800 border border-slate-600 text-slate-300 px-5 py-3 rounded-lg font-medium text-[12px] hover:bg-slate-700 transition-all">
                    View Demo / SKILL.md
                  </Link>
                  <Link href={`/login?next=/${skill.id}`} className="text-center w-full bg-transparent border border-slate-500 text-white px-5 py-3 rounded-lg font-medium text-[12px] hover:bg-[#00ff9d] hover:text-[#0f172a] hover:border-[#00ff9d] transition-all">
                    Provision License
                  </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Network Telemetry / Stats */}
      <section className="relative border-y border-slate-800 bg-[#0f172a] py-24 overflow-hidden mt-10">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
         <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
            <div>
               <p className="text-3xl font-mono text-white mb-2">99.99%</p>
               <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em]">Uptime SLA</p>
            </div>
            <div>
               <p className="text-3xl font-mono text-white mb-2">&lt;45ms</p>
               <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em]">Execution Latency</p>
            </div>
            <div>
              <p className="text-3xl font-mono text-white mb-2">{skills.length}</p>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em]">Native Skills</p>
            </div>
            <div>
               <p className="text-3xl font-mono text-white mb-2">SOC 2</p>
               <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.15em]">Compliant Infra</p>
            </div>
         </div>
      </section>

      <SiteFooter />
    </div>
  );
}