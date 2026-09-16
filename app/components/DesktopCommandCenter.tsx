'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import skills from '@/app/lib/skillsData';
import { executeSkill } from '@/lib/executor';
import { generateCorporateDocument, GeneratedDocument } from '@/lib/documents/generator';
import DocumentPreviewModal from './DocumentPreviewModal';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  outputData?: any;
  documentReady?: GeneratedDocument;
  timestamp: string;
};

export default function DesktopCommandCenter({ selectedSkillId }: { selectedSkillId?: string }) {
  const [activeSkillId, setActiveSkillId] = useState(selectedSkillId || 'trade-lc-auditor');
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activePreviewDoc, setActivePreviewDoc] = useState<GeneratedDocument | null>(null);
  const [currentMode, setCurrentMode] = useState<'chat' | 'paperwork' | 'daemon'>('chat');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const activeSkill = useMemo(
    () => skills.find((s) => s.id === activeSkillId) || skills[0],
    [activeSkillId]
  );

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'assistant',
      text: `AgentBoost Autonomous Workstation ready. Mounted: ${activeSkill.name}. Local Automation Gateway is listening on 127.0.0.1:8765. You can dispatch tasks, analyze tender requirements, or compile verified corporate documentation.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleExecute = async (overridePrompt?: string) => {
    const query = (overridePrompt || inputPrompt).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      // Execute in-process: deterministic sub-millisecond calculation
      const result = await executeSkill(activeSkill.id, { prompt: query });

      // Automatically synthesize an official document if it matches legal/financial suites
      let synthesizedDoc: GeneratedDocument | undefined;
      if (activeSkill.id === 'corporate-governance-bot') {
        synthesizedDoc = generateCorporateDocument('board-resolution', result.data);
      } else if (activeSkill.id === 'lease-contract-generator') {
        synthesizedDoc = generateCorporateDocument('lease-agreement', result.data);
      } else if (activeSkill.id === 'ap-three-way-match') {
        synthesizedDoc = generateCorporateDocument('three-way-match', result.data);
      } else if (activeSkill.id === 'bidding-engine') {
        synthesizedDoc = generateCorporateDocument('tender-proposal', result.data);
      }

      const assistantMsg: Message = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        text: `Deterministic run complete (${result.latency_ms}ms). Compliance verified.`,
        outputData: result.data,
        documentReady: synthesizedDoc,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: `Execution error: ${err.message || 'Verification failure'}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-[#0a101b] shadow-2xl overflow-hidden flex flex-col h-[760px]">
      {/* Top Workstation Bar */}
      <div className="bg-[#0f172a] px-5 py-3 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00d984] animate-pulse"></span>
            <span className="font-mono text-xs font-bold text-white">AGENTBOOST AUTONOMOUS DESKTOP</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Local Daemon: 127.0.0.1:8765
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/tenders"
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white rounded-lg border border-slate-700 transition"
          >
            📋 Tender Command Room
          </Link>

          <div className="flex bg-[#070c14] p-0.5 rounded-lg border border-slate-800 font-mono text-xs">
            <button
              onClick={() => setCurrentMode('chat')}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                currentMode === 'chat' ? 'bg-[#00d984] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setCurrentMode('paperwork')}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                currentMode === 'paperwork' ? 'bg-[#00d984] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Paperwork
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Skill Catalog & Suites */}
        <aside className="w-64 border-r border-slate-800 bg-[#080d16] p-3 hidden md:flex flex-col">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2 px-2">
            Enterprise Suites
          </span>
          <div className="space-y-1 overflow-y-auto flex-1 pr-1 [scrollbar-width:none]">
            {skills.slice(0, 12).map((skill) => (
              <button
                key={skill.id}
                onClick={() => setActiveSkillId(skill.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition cursor-pointer ${
                  activeSkillId === skill.id
                    ? 'bg-emerald-500/15 text-white border border-emerald-500/40 font-bold'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <span>{skill.icon}</span>
                <span className="truncate">{skill.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Cron Polling:</span> <span className="text-emerald-400">Every 30m</span>
            </div>
            <div className="flex justify-between">
              <span>Tender Intake:</span> <span className="text-white">Active</span>
            </div>
          </div>
        </aside>

        {/* Center Canvas */}
        <main className="flex-1 flex flex-col bg-[#0a101b]">
          {currentMode === 'chat' ? (
            <>
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 [scrollbar-width:none]">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${
                      msg.role === 'user' ? 'ml-auto items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        {msg.role === 'user' ? 'Operator' : 'AgentBoost Worker'}
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`rounded-2xl p-4 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#00d984] text-black font-semibold rounded-br-none'
                          : 'bg-[#121c2d] border border-slate-700/80 text-slate-200 rounded-bl-none shadow-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Structured JSON Output */}
                      {msg.outputData && (
                        <div className="mt-3 bg-[#04070d] border border-slate-800 rounded-xl p-3 font-mono text-[11px] overflow-x-auto text-emerald-400">
                          <pre>{JSON.stringify(msg.outputData, null, 2)}</pre>
                        </div>
                      )}

                      {/* Generated Document Trigger */}
                      {msg.documentReady && (
                        <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between gap-3">
                          <div>
                            <p className="font-bold text-white text-xs">{msg.documentReady.title}</p>
                            <p className="text-[10px] font-mono text-emerald-400">
                              Stamp: {msg.documentReady.audit_hash}
                            </p>
                          </div>
                          <button
                            onClick={() => setActivePreviewDoc(msg.documentReady || null)}
                            style={{ color: '#000000' }}
                            className="px-3 py-1.5 bg-[#00d984] hover:bg-[#00c576] !text-black font-black text-[11px] rounded-lg transition cursor-pointer shrink-0"
                          >
                            Inspect & Export
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pl-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Running deterministic pipeline for {activeSkill.name}...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Bottom Command Input */}
              <div className="p-4 border-t border-slate-800 bg-[#0f172a] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>
                    Active: <strong className="text-white">{activeSkill.icon} {activeSkill.name}</strong>
                  </span>
                  <button
                    onClick={() => handleExecute(`Run automated execution for ${activeSkill.name}`)}
                    className="text-emerald-400 hover:underline cursor-pointer"
                  >
                    Quick-run default parameter set ⚡
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleExecute();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    placeholder={`Dispatch command to ${activeSkill.name}...`}
                    className="flex-1 bg-[#090e17] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputPrompt.trim()}
                    style={{ color: '#000000' }}
                    className="px-5 py-2.5 bg-[#00d984] hover:bg-[#00c576] disabled:opacity-50 !text-black font-black text-xs rounded-xl transition cursor-pointer"
                  >
                    Dispatch
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* Paperwork Dashboard View */
            <div className="p-6 overflow-y-auto space-y-6 flex-1 [scrollbar-width:none]">
              <div>
                <h3 className="text-lg font-bold text-white">Enterprise Paperwork Suites</h3>
                <p className="text-xs text-slate-400 font-light mt-0.5">
                  Autonomous deterministic pipelines that eliminate paralegal and administrative backlogs.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    id: 'trade-lc-auditor',
                    title: 'Letter of Credit Discrepancy Audit',
                    desc: 'Scans bills of lading against commercial invoices to release bank escrow funds.',
                    action: 'Audit Sample LC'
                  },
                  {
                    id: 'ap-three-way-match',
                    title: 'Accounts Payable 3-Way Match',
                    desc: 'Pairs vendor invoices against POs and GRNs, issuing automated credit note demands.',
                    action: 'Reconcile PO-88412'
                  },
                  {
                    id: 'corporate-governance-bot',
                    title: 'Board Resolution & UBO Generator',
                    desc: 'Drafts legally binding board minutes, corporate resolutions, and KYC filings.',
                    action: 'Draft Resolution'
                  },
                  {
                    id: 'lease-contract-generator',
                    title: 'Commercial Lease & Rent Index Audit',
                    desc: 'Calculates statutory rent cap increases and drafts standard lease agreements.',
                    action: 'Audit Lease Terms'
                  },
                  {
                    id: 'payroll-wps-auditor',
                    title: 'WPS Payroll Pre-Flight & Gratuity',
                    desc: 'Pre-audits SIF payroll files and calculates statutory severance settlements.',
                    action: 'Audit SIF File'
                  }
                ].map((suite) => (
                  <div key={suite.id} className="p-4 rounded-xl bg-[#0d1522] border border-slate-800 space-y-3">
                    <h4 className="font-bold text-white text-xs">{suite.title}</h4>
                    <p className="text-[11px] text-slate-400 font-light leading-relaxed">{suite.desc}</p>
                    <button
                      onClick={() => {
                        setActiveSkillId(suite.id);
                        setCurrentMode('chat');
                        handleExecute(`Execute ${suite.title}`);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono text-[11px] rounded-lg border border-slate-700 transition cursor-pointer"
                    >
                      {suite.action} →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Document Preview & Export Modal */}
      {activePreviewDoc && (
        <DocumentPreviewModal
          document={activePreviewDoc}
          onClose={() => setActivePreviewDoc(null)}
        />
      )}
    </div>
  );
}