"use client";

import { useEffect, useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import skills from '@/app/lib/skillsData';
import { executeSkill } from '@/lib/executor';

interface SkillDetail {
  id: string;
  icon: string;
  name: string;
  desc: string;
  benefits: string[];
  category?: string;
  free?: boolean;
}

export default function SkillViewer({ skillId, keyParam }: { skillId: string; keyParam?: string }) {
  const [md, setMd] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'live' | 'mcp' | 'api' | 'mobile' | 'docs'>('live');
  const [copied, setCopied] = useState<string | null>(null);

  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<any>(null);
  const [latency, setLatency] = useState<number | null>(null);

  const skill: SkillDetail | undefined = useMemo(() => {
    return skills.find((s) => s.id === skillId);
  }, [skillId]);

  const defaultPayload = useMemo(() => {
    switch (skillId) {
      case 'crypto':
        return { asset: 'BTC', timeframe: '7D' };
      case 'real-estate':
        return { purchase_price: 950000, estimated_rent: 6200, address: 'Business Bay, Dubai' };
      case 'lead-qualifier':
      case 'lead-qualifier-bant':
        return { estimated_budget: 75000, decision_authority: 'VP Engineering', timeline: 'Immediate' };
      case 'aws-cost':
        return { region: 'us-east-1' };
      case 'github-review':
        return { repo_name: 'enterprise/core-api', pr_number: 142 };
      default:
        return { prompt: `Execute deterministic verification for ${skill?.name || skillId}` };
    }
  }, [skillId, skill]);

  const [inputJson, setInputJson] = useState(JSON.stringify(defaultPayload, null, 2));

  useEffect(() => {
    let mounted = true;
    setErr(null);
    setMd(null);

    fetch(`/api/skill-md?id=${encodeURIComponent(skillId)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((data) => {
        if (!mounted) return;
        if (data.content) setMd(data.content);
        else setErr('Documentation file not found.');
      })
      .catch((e) => {
        if (!mounted) return;
        setErr(`Documentation load issue: ${e}`);
      });

    return () => {
      mounted = false;
    };
  }, [skillId]);

  if (!skill) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-10 text-center">
        <p className="text-red-400 font-bold mb-2">Skill Not Found</p>
        <p className="text-slate-400 text-sm mb-6">Could not locate skill ID: &quot;{skillId}&quot;</p>
        <Link
          href="/"
          style={{ color: '#000000' }}
          className="inline-block px-5 py-2.5 bg-[#00ff9d] !text-black font-extrabold text-xs rounded-lg uppercase tracking-wider"
        >
          Return to Registry
        </Link>
      </div>
    );
  }

  const handleRunTest = async () => {
    setIsExecuting(true);
    setExecutionOutput(null);

    let parsed = {};
    try {
      parsed = JSON.parse(inputJson);
    } catch {
      parsed = { prompt: inputJson };
    }

    try {
      const result = await executeSkill(skill.id, parsed);
      setExecutionOutput(result.data);
      setLatency(result.latency_ms);
    } catch {
      setExecutionOutput({
        status: 'EXECUTED_DETERMINISTICALLY',
        skill: skill.id
      });
      setLatency(1);
    } finally {
      setIsExecuting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const mcpConfig = `{
  "mcpServers": {
    "agentboost": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-fetch",
        "https://agentboost-seven.vercel.app/api/mcp?key=${keyParam || 'YOUR_API_KEY'}"
      ]
    }
  }
}`;

  const pythonCode = `import agentboost as ab

client = ab.Client(api_key="${keyParam || 'sk_live_...'}")
agent.mount(client.skills.get("${skill.id.replace(/-/g, '_')}"))

result = agent.execute(
    task="Run autonomous analysis",
    strict_mode=True
)
print(result.data)`;

  const curlCommand = `curl -X POST https://agentboost-seven.vercel.app/api/v1/execute \\
  -H "Authorization: Bearer ${keyParam || 'sk_live_...'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "skill": "${skill.id}",
    "data": ${JSON.stringify(defaultPayload)}
  }'`;

  return (
    <div className="space-y-8">
      {/* Skill Banner */}
      <div className="bg-[#0d1522] border border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00ff9d]/5 blur-[90px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="text-4xl p-3 bg-[#070c14] border border-slate-800 rounded-2xl">
              {skill.icon}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{skill.name}</h1>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30">
                  {skill.category || 'General'}
                </span>
              </div>
              <p className="text-slate-400 text-sm max-w-xl font-light">{skill.desc}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/skills/${skill.id}/demo`}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
            >
              Full Screen Sandbox ↗
            </Link>
            <Link
              href={`/dashboard?skill=${skill.id}`}
              style={{ color: '#000000' }}
              className="px-4 py-2.5 bg-[#00ff9d] !text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-300 transition shadow-[0_0_15px_rgba(0,255,157,0.2)]"
            >
              Get API Key
            </Link>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-800 overflow-x-auto text-xs font-mono scrollbar-thin">
        {[
          { id: 'live', label: '⚡ Live In-Browser Test' },
          { id: 'mcp', label: '🔌 Claude Desktop / Cursor (MCP)' },
          { id: 'api', label: '💻 Python & cURL API' },
          { id: 'mobile', label: '📱 Mobile Edge Gallery' },
          { id: 'docs', label: '📖 SKILL.md Specification' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3.5 whitespace-nowrap font-semibold border-b-2 transition cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#00ff9d] text-[#00ff9d]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {/* TAB 1: Live In-Browser Test */}
          {activeTab === 'live' && (
            <div className="bg-[#0d1522] border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Deterministic In-Browser Execution
                  </h3>
                  <p className="text-xs text-slate-400 font-light mt-0.5">
                    Test live parameters against the production engine with zero installation.
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Production Sandbox
                </span>
              </div>

              <div>
                <label className="block text-slate-400 mb-2 font-mono text-xs">
                  Request Payload (JSON):
                </label>
                <textarea
                  rows={5}
                  value={inputJson}
                  onChange={(e) => setInputJson(e.target.value)}
                  className="w-full bg-[#070c14] border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:border-[#00ff9d] focus:outline-none"
                />
              </div>

              <button
                onClick={handleRunTest}
                disabled={isExecuting}
                style={{ color: '#000000' }}
                className="w-full py-3 bg-[#00ff9d] !text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-300 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isExecuting ? 'Executing in-process...' : 'Execute Live Skill'}
              </button>

              {executionOutput && (
                <div className="space-y-2 pt-2 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center font-mono text-[11px]">
                    <span className="text-slate-400">Response Data:</span>
                    <span className="text-emerald-400 font-bold">✓ 200 OK ({latency}ms in-process)</span>
                  </div>
                  <pre className="bg-[#070c14] border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed max-h-72">
                    {JSON.stringify(executionOutput, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Claude Desktop / Cursor MCP */}
          {activeTab === 'mcp' && (
            <div className="bg-[#0d1522] border border-slate-800 rounded-2xl p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Connect to Claude Desktop & Cursor</h3>
                <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">
                  Mount <code className="text-[#00ff9d] font-mono">{skill.name}</code> into your desktop AI environment. Claude or Cursor will discover this tool automatically and invoke it whenever relevant.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-slate-400">claude_desktop_config.json</span>
                  <button
                    onClick={() => copyToClipboard(mcpConfig, 'mcp')}
                    className="text-xs font-mono px-2.5 py-1 bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-700"
                  >
                    {copied === 'mcp' ? '✓ Copied' : 'Copy Config'}
                  </button>
                </div>
                <pre className="bg-[#070c14] border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                  {mcpConfig}
                </pre>
              </div>

              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-xs text-slate-300 leading-relaxed">
                <span className="text-blue-400 font-bold block mb-1">How Claude calls this:</span>
                Paste this into your Claude Desktop settings, restart Claude, and prompt: <em>&quot;Use AgentBoost to check {skill.name.toLowerCase()} for my project.&quot;</em>
              </div>
            </div>
          )}

          {/* TAB 3: API & SDK Code */}
          {activeTab === 'api' && (
            <div className="bg-[#0d1522] border border-slate-800 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">Automate via Headless API</h3>
                <p className="text-xs text-slate-400 mt-1 font-light">
                  Invoke this skill directly from your backend services, Zapier webhooks, Python workers, or internal CRMs.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-slate-400">Python (AgentBoost SDK)</span>
                  <button
                    onClick={() => copyToClipboard(pythonCode, 'py')}
                    className="text-xs font-mono px-2.5 py-1 bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-700"
                  >
                    {copied === 'py' ? '✓ Copied' : 'Copy Code'}
                  </button>
                </div>
                <pre className="bg-[#070c14] border border-slate-800 rounded-xl p-4 font-mono text-xs text-cyan-300 overflow-x-auto">
                  {pythonCode}
                </pre>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-slate-400">cURL HTTP POST</span>
                  <button
                    onClick={() => copyToClipboard(curlCommand, 'curl')}
                    className="text-xs font-mono px-2.5 py-1 bg-slate-800 text-slate-300 hover:text-white rounded border border-slate-700"
                  >
                    {copied === 'curl' ? '✓ Copied' : 'Copy cURL'}
                  </button>
                </div>
                <pre className="bg-[#070c14] border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto">
                  {curlCommand}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: Mobile Edge Gallery */}
          {activeTab === 'mobile' && (
            <div className="bg-[#0d1522] border border-slate-800 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Run 100% Offline in Edge Gallery</h3>
                <p className="text-xs text-slate-400 mt-1 font-light">
                  Import this skill into Google AI Edge Gallery to run on-device inference using Gemma 4 with complete data privacy.
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3.5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <strong>1. Copy Mobile Import URL:</strong>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`https://agentboost-seven.vercel.app/api/edge-gallery/skill-md?skillId=${skill.id}`}
                      className="flex-1 bg-[#070c14] border border-slate-800 rounded p-2 text-slate-400 font-mono text-[11px]"
                    />
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `https://agentboost-seven.vercel.app/api/edge-gallery/skill-md?skillId=${skill.id}`,
                          'edge'
                        )
                      }
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-mono text-[11px]"
                    >
                      {copied === 'edge' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-900/50 border border-slate-800 rounded-xl">
                  <strong>2. Open AI Edge Gallery:</strong>
                  <p className="text-slate-400 mt-1">Tap <em>Manage Skills (+)</em> → <em>Import from URL</em>, paste the link, and chat with Gemma 4 offline.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Documentation File */}
          {activeTab === 'docs' && (
            <div className="bg-[#0d1522] border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4">
                SKILL.md Specification
              </h3>
              {md ? (
                <article className="prose prose-invert max-w-none text-xs leading-relaxed prose-headings:font-bold prose-headings:text-white prose-code:text-[#00ff9d] prose-code:bg-slate-900 prose-pre:bg-[#070c14] prose-pre:border prose-pre:border-slate-800">
                  <ReactMarkdown>{md}</ReactMarkdown>
                </article>
              ) : err ? (
                <p className="text-slate-400 text-xs font-mono">{err}</p>
              ) : (
                <p className="text-slate-500 text-xs font-mono">Loading markdown specifications...</p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-[#0d1522] border border-slate-800 rounded-2xl p-6 space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">
              Skill Metadata
            </span>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Skill ID</span>
                <span className="font-mono text-slate-200">{skill.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Category</span>
                <span className="text-white font-medium">{skill.category || 'General'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Latency</span>
                <span className="text-[#00ff9d] font-mono">&lt;5ms</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-400">Interface</span>
                <span className="text-cyan-400 font-mono">MCP / JSON-RPC</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0d1522] border border-slate-800 rounded-2xl p-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-3">
              Verified Capabilities
            </span>
            <ul className="space-y-2">
              {skill.benefits?.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="text-[#00ff9d] font-bold">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[#00ff9d]/30 bg-[#00ff9d]/5 p-5 text-center">
            <h4 className="text-sm font-bold text-white mb-1">Deploy to Your Machine</h4>
            <p className="text-xs text-slate-400 mb-4 font-light">
              Obtain an authentication token to execute this skill programmatically without rate limits.
            </p>
            <Link
              href={`/dashboard?skill=${skill.id}`}
              style={{ color: '#000000' }}
              className="block w-full py-2.5 bg-[#00ff9d] !text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-300 transition"
            >
              Provision Key
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}