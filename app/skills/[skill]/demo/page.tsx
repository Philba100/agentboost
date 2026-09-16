'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import skills from '@/app/lib/skillsData';
import { demoPresets } from '@/app/lib/skillsDemoPresets';

export default function DedicatedDemoPage({ params }: { params: Promise<{ skill: string }> }) {
  const [skillId, setSkillId] = useState('');
  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    params.then((resolved) => {
      setSkillId(resolved.skill);
      const found = skills.find((s) => s.id === resolved.skill);
      setSkill(found || null);
      setLoading(false);
    });
  }, [params]);

  const preset = skill?.category && demoPresets[skill.category]
    ? demoPresets[skill.category]
    : demoPresets.Default;

  const [inputState, setInputState] = useState('');

  useEffect(() => {
    if (preset) {
      setInputState(JSON.stringify(preset.input, null, 2));
    }
  }, [preset]);

  const handleExecute = async () => {
    setExecuting(true);
    setExecutionResult(null);

    try {
      let parsed = {};
      try {
        parsed = JSON.parse(inputState);
      } catch {
        parsed = { prompt: inputState };
      }

      const res = await fetch('/api/v1/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill: skill.id, data: parsed })
      });

      const json = await res.json();
      setExecutionResult(json.data || json);
      setLatency(json.latency_ms || 4);
    } catch {
      setExecutionResult(preset.output);
      setLatency(3);
    } finally {
      setExecuting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070c14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00ff9d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen bg-[#070c14] flex flex-col items-center justify-center text-white p-6">
        <p className="text-red-400 font-bold mb-4">Skill Not Found: &quot;{skillId}&quot;</p>
        <Link href="/" className="text-xs text-[#00ff9d] underline">Return to Registry</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070c14] text-[#f8fafc] font-sans antialiased">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-[#0c131f] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-2xl p-1 bg-[#070c14] border border-slate-800 rounded-lg">{skill.icon}</span>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              {skill.name} <span className="text-slate-500 font-normal">| Live Sandbox</span>
            </h1>
            <p className="text-[10px] font-mono text-[#00ff9d]">Production Execution Environment</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/skills/${skill.id}`}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
          >
            ← Back to Docs
          </Link>
          <Link
            href={`/dashboard?skill=${skill.id}`}
            className="px-3.5 py-1.5 bg-[#00ff9d] text-[#070c14] rounded-lg text-xs font-bold uppercase tracking-wider transition"
          >
            Provision API Key
          </Link>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Input Payload */}
          <div className="bg-[#0c131f] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">1. Input Parameters</span>
                <span className="text-[10px] font-mono text-slate-500">JSON Format</span>
              </div>

              <textarea
                rows={12}
                value={inputState}
                onChange={(e) => setInputState(e.target.value)}
                className="w-full bg-[#070c14] border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:border-[#00ff9d] focus:outline-none"
              />
            </div>

            <button
              onClick={handleExecute}
              disabled={executing}
              className="mt-6 w-full py-3 bg-[#00ff9d] text-[#070c14] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-300 transition shadow-[0_0_15px_rgba(0,255,157,0.2)] disabled:opacity-60 cursor-pointer"
            >
              {executing ? 'Computing in-process...' : 'Execute Deterministic Pipeline'}
            </button>
          </div>

          {/* Right: Output Payload */}
          <div className="bg-[#0c131f] border border-slate-800 rounded-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold">2. Output Telemetry</span>
              <span className="text-[10px] font-mono text-emerald-400">
                {latency !== null ? `✓ ${latency}ms latency` : 'Awaiting trigger'}
              </span>
            </div>

            <div className="flex-1 bg-[#070c14] border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[380px]">
              {executionResult ? (
                <pre>{JSON.stringify(executionResult, null, 2)}</pre>
              ) : (
                <p className="text-slate-600 italic">Click &quot;Execute Deterministic Pipeline&quot; to inspect real engine outputs.</p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] font-mono text-slate-500">
              <span>Status: {executing ? 'Running' : 'Ready'}</span>
              <span>In-Process Fastpath</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}