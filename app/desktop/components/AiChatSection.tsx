"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import skills from '@/app/lib/skillsData';
import { autonomousAgents } from '@/app/lib/agentsData';
import { executeSkill } from '@/lib/executor';
import { generateCorporateDocument, GeneratedDocument } from '@/lib/documents/generator';

type ToolCallExecution = {
  skillId: string;
  skillName: string;
  category: string;
  latency_ms: number;
  input: Record<string, any>;
  output: Record<string, any>;
  generatedDoc?: GeneratedDocument;
};

type ChatMessage = {
  id: string;
  role: 'operator' | 'agent';
  text: string;
  toolCall?: ToolCallExecution;
  timestamp: string;
};

interface AiChatSectionProps {
  onOpenDocument: (doc: GeneratedDocument) => void;
  pushAuditLog: (system: string, operation: string, status: 'VERIFIED' | 'COMPLIANT' | 'FLAGGED') => void;
  activeModel?: string;
  onNavigateToSettings?: () => void;
}

export default function AiChatSection({
  onOpenDocument,
  pushAuditLog,
  activeModel = 'In-Process Deterministic Core (Fastpath)',
  onNavigateToSettings
}: AiChatSectionProps) {
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [activeToolSearch, setActiveToolSearch] = useState('');
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);
  const [isLmStudioReachable, setIsLmStudioReachable] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'agent',
      text: 'AgentBoost Autonomous Operations Workstation online. I am equipped with verified deterministic calculation engines and institutional paperwork compilers across our entire suite of 100+ skills and autonomous agents. Ask a question, paste an email or RFQ to process, or provide parameters to execute sub-millisecond audits.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Check first-time onboarding preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('agentboost_welcome_dismissed');
      if (!dismissed) {
        setShowWelcomeGuide(true);
      }
    }
  }, []);

  const dismissWelcomeGuide = () => {
    setShowWelcomeGuide(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agentboost_welcome_dismissed', 'true');
    }
  };

  // Check connectivity of LM Studio when it is selected
  useEffect(() => {
    const isLmStudio = activeModel.toLowerCase().includes('lm studio');
    if (isLmStudio) {
      const savedLm = (typeof window !== 'undefined' ? localStorage.getItem('agentboost_lmstudio_url') : null) || 'http://192.168.1.218:1234';
      fetch('/api/lmstudio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ping', targetUrl: savedLm })
      })
        .then((r) => r.json())
        .then((d) => setIsLmStudioReachable(d?.online === true))
        .catch(() => setIsLmStudioReachable(false));
    } else {
      setIsLmStudioReachable(true);
    }
  }, [activeModel]);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiThinking]);

  // System Prompt explaining the AgentBoost ecosystem to Gemma 4 / LLM
  const systemPrompt = useMemo(() => {
    return `You are the AI Intelligence Layer of AgentBoost, an enterprise autonomous operating system and MCP tooling clearinghouse.

ARCHITECTURE:
- You handle natural language, human context, strategic reasoning, and intent recognition.
- AgentBoost's deterministic execution engines handle mathematical ground truth, statutory compliance formulas, and binding corporate paperwork with zero hallucination in under 5ms.

AUTONOMOUS AGENTS AVAILABLE:
- web-intel-scout: Internet search, corporate filings, sanctions screening, regulatory gazette crawling.
- email-inbox-processor: Ingests email streams, extracts RFQs & invoices, classifies business urgency, drafts multi-channel replies.
- supplier-negotiator: Manages supplier disputes, renegotiates payment terms (Net 30/60/90), enforces delivery SLA penalties.
- task-followup-sentinel: Autonomous accountability agent that tracks milestones, calculates project slippage, inspects deliverables, and alerts managers.
- executive-decision-radar: Synthesizes company-wide data into 1-page C-suite decision memos with quantified financial exposure.
- trade-lc-auditor: Audits Letters of Credit against Bills of Lading for demurrage and tolerance violations.
- ap-three-way-match: Reconciles Invoices, POs, and GRNs; flags overbilling and drafts credit notes.
- corporate-governance-bot: Drafts binding Board Resolutions, UBO declarations, and commercial filings.
- lease-contract-generator: Underwrites commercial rent, checks statutory rent caps, drafts leases.
- payroll-wps-auditor: Pre-flight audits WPS SIF files and calculates statutory gratuity severance.
- bidding-engine: Ingests 50+ page RFQs, evaluates compliance matrices, models 3-tier bid pricing.

BEHAVIOR RULES:
1. CONVERSATIONAL QUERIES: If the user says "hi", "hello", asks general questions, or asks for advice, answer politely, professionally, and insightfully. DO NOT call any tool.
2. OPERATIONAL TASKS: If the user provides operational parameters, asks to check a document, renegotiate a supplier, evaluate a project, or audit data, invoke the matching tool by returning a JSON tag at the start:
TOOL_CALL:{"tool": "<tool_id>", "parameters": {<extracted_parameters>}}
Followed by your briefing.`;
  }, []);

  const handleSendChat = async (overridePrompt?: string) => {
    const query = (overridePrompt || chatInput).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'operator',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsAiThinking(true);

    const isLmStudio = activeModel.toLowerCase().includes('lm studio');

    // 1. Inference via LM Studio (Gemma 4)
    if (isLmStudio) {
      try {
        const savedLm = (typeof window !== 'undefined' ? localStorage.getItem('agentboost_lmstudio_url') : null) || 'http://192.168.1.218:1234';

        const conversation = [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-4).map((m) => ({
            role: m.role === 'operator' ? 'user' : 'assistant',
            content: m.text
          })),
          { role: 'user', content: query }
        ];

        const res = await fetch('/api/lmstudio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'chat',
            targetUrl: savedLm,
            messages: conversation,
            model: 'google/gemma-4-e2b'
          })
        });

        const data = await res.json();
        const replyText = data?.choices?.[0]?.message?.content;

        if (replyText) {
          setIsLmStudioReachable(true);

          // Check if Gemma 4 requested an autonomous tool execution
          if (replyText.includes('TOOL_CALL:')) {
            const toolMatch = replyText.match(/TOOL_CALL:(\{.*?\})/);
            if (toolMatch && toolMatch[1]) {
              try {
                const parsedTool = JSON.parse(toolMatch[1]);
                const toolId = parsedTool.tool;
                const toolParams = parsedTool.parameters || { prompt: query };

                const execResult = await executeSkill(toolId, toolParams);

                let generatedDoc: GeneratedDocument | undefined;
                if (toolId === 'corporate-governance-bot') {
                  generatedDoc = generateCorporateDocument('board-resolution', execResult.data);
                } else if (toolId === 'lease-contract-generator') {
                  generatedDoc = generateCorporateDocument('lease-agreement', execResult.data);
                } else if (toolId === 'ap-three-way-match') {
                  generatedDoc = generateCorporateDocument('three-way-match', execResult.data);
                } else if (toolId === 'bidding-engine' || toolId === 'trade-lc-auditor') {
                  generatedDoc = generateCorporateDocument('tender-proposal', execResult.data);
                }

                const cleanedText = replyText.replace(/TOOL_CALL:\{.*?\}/, '').trim() ||
                  `Autonomous agent completed ${toolId}. Deterministic calculations verified.`;

                const toolCall: ToolCallExecution = {
                  skillId: toolId,
                  skillName: toolId.replace(/-/g, ' ').toUpperCase(),
                  category: 'Autonomous Pipeline',
                  latency_ms: execResult.latency_ms,
                  input: toolParams,
                  output: execResult.data,
                  generatedDoc
                };

                setMessages((prev) => [
                  ...prev,
                  {
                    id: `agt-${Date.now()}`,
                    role: 'agent',
                    text: cleanedText,
                    toolCall,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]);
                pushAuditLog(toolId, `Invoked by Gemma 4 in ${execResult.latency_ms}ms`, 'VERIFIED');
                setIsAiThinking(false);
                return;
              } catch (err) {
                console.warn('Tool call parser notice:', err);
              }
            }
          }

          // Pure conversational response from Gemma 4
          setMessages((prev) => [
            ...prev,
            {
              id: `agt-${Date.now()}`,
              role: 'agent',
              text: replyText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          setIsAiThinking(false);
          return;
        }
      } catch (err) {
        setIsLmStudioReachable(false);
        console.warn('LM Studio bridge offline, falling back to Deterministic Fastpath:', err);
      }
    }

    // 2. Deterministic Fastpath (Local In-Process Logic)
    const qLower = query.toLowerCase();

    // Natural greeting and system intent detection
    const greetings = ['hi', 'hello', 'hie', 'hey', 'greetings', 'who are you', 'help', 'what can you do'];
    if (greetings.some((g) => qLower === g || qLower.startsWith(`${g} `) || qLower.endsWith(` ${g}`))) {
      setMessages((prev) => [
        ...prev,
        {
          id: `agt-${Date.now()}`,
          role: 'agent',
          text: `Hello! I am your AgentBoost Operations Core. I manage verified autonomous agents across our corporate backplane.

Here is what you can ask me to do right now:
1. 🌐 **Web Intelligence**: *"Search commercial registry filings for Apex Holdings International"*
2. 📬 **Email & RFQ Processing**: *"Process this incoming RFQ email: Scope is cloud migration, 48 hours deadline"*
3. 🤝 **Supplier Negotiations**: *"Renegotiate payment terms to Net 60 with Apex Industrial Supplies for invoice $85,000"*
4. ⏱️ **Task & Project Follow-Up**: *"Check project status for Q2 Infrastructure Deployment with 12 days remaining"*
5. 📊 **Executive Decision**: *"Synthesize executive decision memo for $350k capital outlay with Emirates Logistics"*
6. 🚢 **Trade LC & 3-Way Match**: *"Audit LC-2026-DXB-9841"* or *"Reconcile PO-88412"*

How can I assist your workflow today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsAiThinking(false);
      return;
    }

    // Specific Agent Execution Routing
    let matchedSkill = null;
    if (qLower.includes('search') || qLower.includes('web') || qLower.includes('registry') || qLower.includes('sanction')) {
      matchedSkill = skills.find((s) => s.id === 'web-intel-scout');
    } else if (qLower.includes('email') || qLower.includes('inbox') || qLower.includes('parse rfq') || qLower.includes('sender')) {
      matchedSkill = skills.find((s) => s.id === 'email-inbox-processor');
    } else if (qLower.includes('supplier') || qLower.includes('vendor') || qLower.includes('renegotiat') || qLower.includes('net 60')) {
      matchedSkill = skills.find((s) => s.id === 'supplier-negotiator');
    } else if (qLower.includes('follow up') || qLower.includes('sentinel') || qLower.includes('milestone') || qLower.includes('slippage') || qLower.includes('task status')) {
      matchedSkill = skills.find((s) => s.id === 'task-followup-sentinel');
    } else if (qLower.includes('executive decision') || qLower.includes('risk radar') || qLower.includes('memo') || qLower.includes('sign off')) {
      matchedSkill = skills.find((s) => s.id === 'executive-decision-radar');
    } else if (qLower.includes('credit') || qLower.includes('lc') || qLower.includes('lading') || qLower.includes('demurrage')) {
      matchedSkill = skills.find((s) => s.id === 'trade-lc-auditor');
    } else if (qLower.includes('po') || qLower.includes('invoice') || qLower.includes('3-way') || qLower.includes('three way') || qLower.includes('match')) {
      matchedSkill = skills.find((s) => s.id === 'ap-three-way-match');
    } else if (qLower.includes('board') || qLower.includes('resolution') || qLower.includes('ubo')) {
      matchedSkill = skills.find((s) => s.id === 'corporate-governance-bot');
    } else if (qLower.includes('lease') || qLower.includes('rent') || qLower.includes('ejari')) {
      matchedSkill = skills.find((s) => s.id === 'lease-contract-generator');
    } else if (qLower.includes('payroll') || qLower.includes('wps') || qLower.includes('gratuity') || qLower.includes('sif')) {
      matchedSkill = skills.find((s) => s.id === 'payroll-wps-auditor');
    } else if (qLower.includes('tender') || qLower.includes('rfq') || qLower.includes('bid')) {
      matchedSkill = skills.find((s) => s.id === 'bidding-engine');
    } else if (qLower.includes('property') || qLower.includes('cap rate') || qLower.includes('real estate') || qLower.includes('underwrite')) {
      matchedSkill = skills.find((s) => s.id === 'real-estate');
    } else if (qLower.includes('score') || qLower.includes('bant') || qLower.includes('lead')) {
      matchedSkill = skills.find((s) => s.id === 'lead-qualifier');
    }

    if (matchedSkill) {
      try {
        const execResult = await executeSkill(matchedSkill.id, { prompt: query, query });

        let generatedDoc: GeneratedDocument | undefined;
        if (matchedSkill.id === 'corporate-governance-bot') {
          generatedDoc = generateCorporateDocument('board-resolution', execResult.data);
        } else if (matchedSkill.id === 'lease-contract-generator') {
          generatedDoc = generateCorporateDocument('lease-agreement', execResult.data);
        } else if (matchedSkill.id === 'ap-three-way-match') {
          generatedDoc = generateCorporateDocument('three-way-match', execResult.data);
        } else if (matchedSkill.id === 'bidding-engine' || matchedSkill.id === 'trade-lc-auditor') {
          generatedDoc = generateCorporateDocument('tender-proposal', execResult.data);
        }

        const toolCall: ToolCallExecution = {
          skillId: matchedSkill.id,
          skillName: matchedSkill.name,
          category: matchedSkill.category || 'General',
          latency_ms: execResult.latency_ms,
          input: { prompt: query },
          output: execResult.data,
          generatedDoc
        };

        setMessages((prev) => [
          ...prev,
          {
            id: `agt-${Date.now()}`,
            role: 'agent',
            text: `Agent ${matchedSkill!.name} completed evaluation in ${execResult.latency_ms}ms. Deterministic parameters verified.`,
            toolCall,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        pushAuditLog(matchedSkill.name, `Executed in ${execResult.latency_ms}ms`, 'VERIFIED');
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'agent',
            text: `Execution halt: ${err.message || 'Verification failure'}.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `agt-${Date.now()}`,
          role: 'agent',
          text: `Command received: "${query}". You can trigger any of our 100+ skills by entering specific parameters (such as an LC number, supplier name, tender budget, or project deadline), or connect your local LM Studio instance for open-ended conversational reasoning.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }

    setIsAiThinking(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-between max-w-5xl mx-auto h-full w-full relative">
      {/* 1. First-Time Welcome & Onboarding Guide Card */}
      {showWelcomeGuide && (
        <div className="mb-4 bg-gradient-to-r from-[#0d1c2d] to-[#122b40] border border-[#00ff9d]/40 rounded-2xl p-6 shadow-2xl relative animate-in fade-in select-none">
          <button
            onClick={dismissWelcomeGuide}
            className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 cursor-pointer font-mono"
          >
            ✕ Dismiss Guide
          </button>
          <div className="flex items-start gap-4 pr-16">
            <div className="text-3xl p-2.5 bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded-xl text-[#00ff9d]">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Welcome to AgentBoost Autonomous Workstation
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#00ff9d]/20 text-[#00ff9d] font-bold">
                  Institutional Architecture
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                AgentBoost decouples corporate operations into two specialized layers:
              </p>
              <div className="grid sm:grid-cols-3 gap-3 my-3 text-[11px] font-mono">
                <div className="p-3 bg-[#0a1422] rounded-xl border border-slate-700/80">
                  <p className="text-[#00ff9d] font-bold mb-1">1. AI Language Layer</p>
                  <p className="text-slate-300 font-sans text-xs">
                    Handles conversations, intention, and email communications using local Gemma 4 or cloud LLMs.
                  </p>
                </div>
                <div className="p-3 bg-[#0a1422] rounded-xl border border-slate-700/80">
                  <p className="text-cyan-400 font-bold mb-1">2. Deterministic Engines</p>
                  <p className="text-slate-300 font-sans text-xs">
                    Sub-5ms execution of financial math, statutory labor law, and binding legal contracts with 0% hallucination.
                  </p>
                </div>
                <div className="p-3 bg-[#0a1422] rounded-xl border border-slate-700/80">
                  <p className="text-purple-400 font-bold mb-1">3. Tri-Surface Deploy</p>
                  <p className="text-slate-300 font-sans text-xs">
                    Syncs natively across Web clearinghouse, this Desktop workstation (127.0.0.1:8765), and Mobile Edge Gallery.
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Tip: Try one of the suggested prompts below or ask any operational question.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Caution Warning Banner When AI (LM Studio) is Disconnected */}
      {activeModel.toLowerCase().includes('lm studio') && !isLmStudioReachable && (
        <div className="mb-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex items-center justify-between text-xs font-mono text-amber-300 animate-pulse">
          <div className="flex items-center gap-2.5">
            <span className="text-base">⚠️</span>
            <span>
              <strong>Caution: LM Studio is Offline / Unreachable.</strong> Workstation is operating in Deterministic Fastpath mode.
            </span>
          </div>
          <button
            onClick={onNavigateToSettings}
            className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-lg border border-amber-500/40 text-[11px] cursor-pointer transition"
          >
            Configure Endpoint →
          </button>
        </div>
      )}

      {/* 3. Top Command Bar */}
      <div className="border-b border-slate-700/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Autonomous AI Chat &amp; Tool Calling
          </h2>
          <p className="text-sm text-slate-300 mt-0.5 font-light flex items-center gap-2">
            <span>Inference:</span>
            <strong className="text-[#00ff9d]">{activeModel}</strong>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">{skills.length} skills &amp; {autonomousAgents.length} agents active</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search all 100+ tools & agents..."
            value={activeToolSearch}
            onChange={(e) => setActiveToolSearch(e.target.value)}
            className="bg-[#1e293b] border border-slate-700 rounded-lg px-3.5 py-1.5 text-xs text-white placeholder-slate-500 font-mono outline-none w-64 focus:border-[#00ff9d]"
          />
        </div>
      </div>

      {/* 4. Interactive Message Stream */}
      <div className="space-y-4 overflow-y-auto flex-1 my-4 pr-2 no-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-5 rounded-2xl text-sm font-mono leading-relaxed max-w-[92%] ${
              msg.role === 'operator'
                ? 'bg-[#1e293b] border border-slate-700 ml-auto text-slate-100'
                : 'bg-[#0b1220] border border-slate-700/80 mr-auto text-slate-200 shadow-xl'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold text-slate-400">
                {msg.role === 'operator' ? 'Operator' : 'AgentBoost Engine'}
              </span>
              <span className="text-[11px] text-slate-500">{msg.timestamp}</span>
            </div>

            <p className="text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">{msg.text}</p>

            {/* Structured Tool Output Card */}
            {msg.toolCall && (
              <div className="mt-4 p-4 rounded-xl bg-[#0f172a] border border-[#00ff9d]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase font-mono flex items-center gap-2">
                    <span className="text-[#00ff9d]">⚡</span> Agent Execution: {msg.toolCall.skillName}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold font-mono">
                    ✓ {msg.toolCall.latency_ms}ms Latency
                  </span>
                </div>

                <pre className="p-3 bg-[#070c14] border border-slate-800 rounded-lg text-xs text-[#00ff9d] overflow-x-auto max-h-52 leading-relaxed no-scrollbar">
                  {JSON.stringify(msg.toolCall.output, null, 2)}
                </pre>

                {msg.toolCall.generatedDoc && (
                  <div className="pt-1 flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-sans">
                      Synthesized: <strong>{msg.toolCall.generatedDoc.title}</strong>
                    </span>
                    <button
                      onClick={() => onOpenDocument(msg.toolCall!.generatedDoc!)}
                      style={{ color: '#0f172a' }}
                      className="px-3.5 py-1 bg-[#00ff9d] hover:bg-emerald-300 font-bold text-xs rounded-md transition cursor-pointer !text-[#0f172a]"
                    >
                      Inspect Document →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isAiThinking && (
          <div className="p-4 rounded-xl bg-[#0b1220] border border-slate-800 text-xs font-mono text-emerald-400 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-ping"></span>
            <span>Evaluating intent, cross-referencing agents &amp; executing deterministic backplane...</span>
          </div>
        )}
        <div ref={chatScrollRef} />
      </div>

      {/* 5. Suggested Prompts */}
      <div className="py-2 flex items-center gap-2 overflow-x-auto no-scrollbar select-none shrink-0">
        <span className="text-xs font-mono text-slate-500 whitespace-nowrap">Suggested:</span>
        {[
          'Audit Trade LC for demurrage risk',
          'Search corporate registry for Apex Holdings',
          'Process incoming RFQ email attachment',
          'Renegotiate supplier payment terms to Net 60',
          'Follow up on project milestone deadlines',
          'Synthesize executive decision risk memo'
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendChat(prompt)}
            className="whitespace-nowrap px-3.5 py-1.5 bg-[#1e293b] hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition cursor-pointer font-sans"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* 6. Prompt Dispatch Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendChat();
        }}
        className="pt-3 border-t border-slate-700 flex gap-3 shrink-0"
      >
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask a question or instruct an autonomous agent (e.g. 'Renegotiate terms with supplier for invoice $85,000')..."
          className="flex-1 bg-[#1e293b] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 font-sans focus:outline-none focus:border-[#00ff9d]"
        />
        <button
          type="submit"
          disabled={isAiThinking || !chatInput.trim()}
          style={{ color: '#0f172a' }}
          className="px-7 py-3 bg-[#00ff9d] hover:bg-emerald-300 font-black text-sm uppercase tracking-wider rounded-xl transition !text-[#0f172a] cursor-pointer disabled:opacity-50 shrink-0"
        >
          Dispatch
        </button>
      </form>
    </div>
  );
}