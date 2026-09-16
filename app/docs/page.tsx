"use client";

import Link from 'next/link';
import { useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

export default function DocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const claudeConfig = `{
  "mcpServers": {
    "agentboost": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-fetch",
        "https://agentboost-seven.vercel.app/api/mcp?key=YOUR_API_KEY"
      ]
    }
  }
}`;

  const pythonCode = `import requests

# Direct headless invocation of any AgentBoost skill
response = requests.post(
    "https://agentboost-seven.vercel.app/api/v1/execute",
    headers={
        "Authorization": "Bearer sk_live_YOUR_KEY",
        "Content-Type": "application/json"
    },
    json={
        "skill": "crypto",
        "data": {"asset": "BTC", "timeframe": "7D"}
    }
)

data = response.json()
print("Strategy:", data['data']['strategy'])
print("Greeks:", data['data']['greeks'])`;

  return (
    <div className="min-h-screen bg-[#070c14] text-[#f8fafc] font-sans antialiased selection:bg-[#00ff9d] selection:text-[#070c14]">
      <SiteHeader />

      <div className="max-w-[1080px] mx-auto py-16 px-6 md:px-12">
        <header className="mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00ff9d] block mb-2">
            Developer Documentation
          </span>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">AgentBoost Integration Guide</h1>
          <p className="text-slate-400 text-base mt-2 max-w-2xl font-light">
            Connect production skills to your desktop AI tools, headless backend services, or offline mobile devices in minutes.
          </p>
        </header>

        <div className="space-y-16">
          {/* Section 1: Claude Desktop & Cursor */}
          <section className="bg-[#0c131f] border border-slate-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-[#00ff9d] text-[#070c14] font-mono font-bold flex items-center justify-center text-sm">
                01
              </span>
              <h2 className="text-xl font-bold text-white">Claude Desktop & Cursor (MCP Setup)</h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-light">
              AgentBoost natively implements the <strong>Model Context Protocol (MCP)</strong>. By pointing Claude Desktop to our production endpoint, Claude automatically mounts all 60+ deterministic skills into its context window.
            </p>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-slate-400">claude_desktop_config.json</span>
                <button
                  onClick={() => copy(claudeConfig, 'claude')}
                  className="text-xs font-mono px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
                >
                  {copiedId === 'claude' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-[#070c14] border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto">
                {claudeConfig}
              </pre>
            </div>
          </section>

          {/* Section 2: Headless Python & REST API */}
          <section className="bg-[#0c131f] border border-slate-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-[#00ff9d] text-[#070c14] font-mono font-bold flex items-center justify-center text-sm">
                02
              </span>
              <h2 className="text-xl font-bold text-white">Headless Client API (Python / REST)</h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-6 font-light">
              Automate tasks from external client machines, internal CRMs, or server workers. Submit input parameters and receive validated, deterministic returns in sub-5ms.
            </p>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-slate-400">test_execution.py</span>
                <button
                  onClick={() => copy(pythonCode, 'py')}
                  className="text-xs font-mono px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
                >
                  {copiedId === 'py' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-[#070c14] border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto">
                {pythonCode}
              </pre>
            </div>
          </section>

          {/* Section 3: Mobile Edge Gallery */}
          <section className="bg-[#0c131f] border border-slate-800 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-lg bg-[#00ff9d] text-[#070c14] font-mono font-bold flex items-center justify-center text-sm">
                03
              </span>
              <h2 className="text-xl font-bold text-white">Google AI Edge Gallery (Mobile)</h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4 font-light">
              Run skills completely offline on iOS or Android using on-device models like Gemma 4:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-400 font-light">
              <li>Open Google AI Edge Gallery on your mobile device.</li>
              <li>Navigate to <strong>Manage Skills</strong> → <strong>Import from URL</strong>.</li>
              <li>
                Paste any skill link formatted as: <br />
                <code className="text-[#00ff9d] font-mono text-[11px]">
                  https://agentboost-seven.vercel.app/api/edge-gallery/skill-md?skillId=[skill-id]
                </code>
              </li>
              <li>Execute tasks offline with zero data leakage.</li>
            </ol>
          </section>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}