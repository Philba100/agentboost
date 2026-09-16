"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import skills from '@/app/lib/skillsData';
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
}

export default function AiChatSection({
  onOpenDocument,
  pushAuditLog,
  activeModel = 'In-Process Deterministic Core (Fastpath)'
}: AiChatSectionProps) {
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [activeToolSearch, setActiveToolSearch] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'agent',
      text: 'AgentBoost Autonomous Operations Workstation online. I am equipped with verified deterministic calculation engines and institutional paperwork compilers across 60+ business skills. You can speak with me naturally, ask questions about our capabilities, or provide data to trigger sub-millisecond audits.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiThinking]);

  const systemPrompt = useMemo(() => {
    return `You are the AI Intelligence Layer of AgentBoost, an enterprise autonomous OS.
You understand business, trade finance, legal compliance, real estate underwriting, and HR operations.
When the user asks conversational questions, greetings, or explanations, answer directly, professionally, and insightfully.
When the user wants to execute an action (e.g. audit an LC, score a lead, draft a resolution, check 3-way match, underwrite property), specify the action and parameters clearly.`;
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

    if (isLmStudio) {
      try {
        const savedLm = (typeof window !== 'undefined' ? localStorage.getItem('agentboost_lmstudio_url') : null) || 'http://192.168.1.218:1234';

        const conversation = [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-4).map(m => ({
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
        const replyContent = data?.choices?.[0]?.message?.content;

        if (replyContent) {
          setMessages((prev) => [
            ...prev,
            {
              id: `agt-${Date.now()}`,
              role: 'agent',
              text: replyContent,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          setIsAiThinking(false);
          return;
        }
      } catch (err) {
        console.warn('LM Studio bridge error:', err);
      }
    }

    // Deterministic Fallback if not conversational
    const qLower = query.toLowerCase();
    const greetings = ['hi', 'hello', 'hie', 'hey', 'greetings', 'who are you', 'help', 'what can you do'];
    if (greetings.some(g => qLower === g || qLower.startsWith(`${g} `))) {
      setMessages((prev) => [
        ...prev,
        {
          id: `agt-${Date.now()}`,
          role: 'agent',
          text: `Hello! I am the AgentBoost Operations Core. I can assist you with:
1. 🚢 **Trade Finance**: Letter of Credit & B/L demurrage audits.
2. 📑 **Accounts Payable**: 3-Way matching across POs and invoices.
3. 🏛️ **Corporate Governance**: Board resolutions & UBO registers.
4. 🏢 **Commercial Real Estate**: Rent index caps & lease drafting.
5. 💼 **WPS Payroll**: SIF pre-flight audits & statutory gratuity calculations.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsAiThinking(false);
      return;
    }

    // Keyword Tool Execution
    let matchedSkill = skills.find((s) => qLower.includes(s.id) || qLower.includes(s.name.toLowerCase()));
    if (!matchedSkill) {
      if (qLower.includes('credit') || qLower.includes('lc') || qLower.includes('lading')) matchedSkill = skills.find(s => s.id === 'trade-lc-auditor');
      else if (qLower.includes('po') || qLower.includes('invoice') || qLower.includes('match')) matchedSkill = skills.find(s => s.id === 'ap-three-way-match');
      else if (qLower.includes('board') || qLower.includes('resolution')) matchedSkill = skills.find(s => s.id === 'corporate-governance-bot');
      else if (qLower.includes('lease') || qLower.includes('rent')) matchedSkill = skills.find(s => s.id === 'lease-contract-generator');
      else if (qLower.includes('payroll') || qLower.includes('wps') || qLower.includes('gratuity')) matchedSkill = skills.find(s => s.id === 'payroll-wps-auditor');
      else if (qLower.includes('tender') || qLower.includes('bid')) matchedSkill = skills.find(s => s.id === 'bidding-engine');
      else if (qLower.includes('real estate') || qLower.includes('property')) matchedSkill = skills.find(s => s.id === 'real-estate');
    }

    if (matchedSkill) {
      const execResult = await executeSkill(matchedSkill.id, { prompt: query });
      let generatedDoc: GeneratedDocument | undefined;
      if (matchedSkill.id === 'corporate-governance-bot') generatedDoc = generateCorporateDocument('board-resolution', execResult.data);
      else if (matchedSkill.id === 'lease-contract-generator') generatedDoc = generateCorporateDocument('lease-agreement', execResult.data);
      else if (matchedSkill.id === 'ap-three-way-match') generatedDoc = generateCorporateDocument('three-way-match', execResult.data);
      else if (matchedSkill.id === 'bidding-engine' || matchedSkill.id === 'trade-lc-auditor') generatedDoc = generateCorporateDocument('tender-proposal', execResult.data);

      const toolCall: ToolCallExecution = {
        skillId: matchedSkill.id,
        skillName: matchedSkill.name,
        category: matchedSkill.category || 'General',
        latency_ms: execResult.latency_ms,
        input: { task_prompt: query },
        output: execResult.data,
        generatedDoc
      };

      setMessages((prev) => [
        ...prev,
        {
          id: `agt-${Date.now()}`,
          role: 'agent',
          text: `Executed ${matchedSkill!.name} deterministically in ${execResult.latency_ms}ms.`,
          toolCall,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      pushAuditLog(matchedSkill.name, `Executed in ${execResult.latency_ms}ms`, 'VERIFIED');
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `agt-${Date.now()}`,
          role: 'agent',
          text: `Query received: "${query}". Provide operational data or connect LM Studio for free-form conversation.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
    setIsAiThinking(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-between max-w-5xl mx-auto h-full w-full">
      <div className="border-b border-slate-700/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Autonomous AI Chat &amp; Tool Calling
          </h2>
          <p className="text-sm text-slate-300 mt-0.5 font-light">
            Inference Target: <strong className="text-[#00ff9d]">{activeModel}</strong>
          </p>
        </div>

        <input
          type="text"
          placeholder="Filter 60+ tools..."
          value={activeToolSearch}
          onChange={(e) => setActiveToolSearch(e.target.value)}
          className="bg-[#1e293b] border border-slate-700 rounded-lg px-3.5 py-1.5 text-xs text-white placeholder-slate-500 font-mono outline-none w-56 focus:border-[#00ff9d]"
        />
      </div>

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

            <p className="text-slate-200 whitespace-pre-wrap">{msg.text}</p>

            {msg.toolCall && (
              <div className="mt-4 p-4 rounded-xl bg-[#0f172a] border border-[#00ff9d]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase font-mono">
                    ⚡ Tool Invocation: {msg.toolCall.skillName}
                  </span>
                  <span className="text-xs text-emerald-400 font-bold font-mono">
                    ✓ {msg.toolCall.latency_ms}ms Latency
                  </span>
                </div>

                <pre className="p-3 bg-[#070c14] border border-slate-800 rounded-lg text-xs text-[#00ff9d] overflow-x-auto max-h-48 leading-relaxed no-scrollbar">
                  {JSON.stringify(msg.toolCall.output, null, 2)}
                </pre>

                {msg.toolCall.generatedDoc && (
                  <div className="pt-1 flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-sans">
                      Document compiled: <strong>{msg.toolCall.generatedDoc.title}</strong>
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
            <span>Reasoning across system topology with Gemma 4...</span>
          </div>
        )}
        <div ref={chatScrollRef} />
      </div>

      <div className="py-2 flex items-center gap-2 overflow-x-auto no-scrollbar select-none shrink-0">
        <span className="text-xs font-mono text-slate-500 whitespace-nowrap">Suggested:</span>
        {[
          'Audit Trade LC for demurrage risk',
          'Underwrite commercial property $850k rent $5400',
          'BANT score lead: VP Sales $65k budget Q3',
          'Draft Board Resolution for Tariq Al-Hashemi',
          'Reconcile PO-88412 3-Way Match'
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

      <form onSubmit={(e) => { e.preventDefault(); handleSendChat(); }} className="pt-3 border-t border-slate-700 flex gap-3 shrink-0">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask a question or provide parameters for deterministic execution..."
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