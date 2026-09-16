"use client";

import Link from 'next/link';
import { useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

export default function ProtocolPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const initJson = `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": { "tools": {} },
    "clientInfo": { "name": "claude-desktop", "version": "1.0.0" }
  }
}`;

  const toolsListJson = `{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "crypto_quant_pro",
        "description": "Calculates options Greeks and volatility hedges.",
        "inputSchema": {
          "type": "object",
          "properties": {
            "asset": { "type": "string", "description": "Ticker symbol (BTC, ETH, SOL)" },
            "timeframe": { "type": "string" }
          },
          "required": ["asset"]
        }
      }
    ]
  }
}`;

  const callToolJson = `{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "crypto_quant_pro",
    "arguments": {
      "asset": "BTC",
      "timeframe": "7D"
    }
  }
}`;

  return (
    <div className="min-h-screen bg-[#070c14] text-[#f8fafc] font-sans antialiased selection:bg-[#00ff9d] selection:text-[#070c14]">
      <SiteHeader />

      <main className="max-w-[1180px] mx-auto px-6 md:px-12 py-16">
        {/* Header */}
        <header className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00ff9d]/30 bg-[#00ff9d]/10 text-[10px] font-mono uppercase tracking-widest text-[#00ff9d] mb-4">
            Protocol Specification
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Model Context Protocol (MCP v2.4)
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-2xl font-light leading-relaxed">
            AgentBoost implements the open Model Context Protocol over HTTP/JSON-RPC 2.0. Any external host—including Claude Desktop, Cursor, and custom enterprise workers—can discover and execute tools deterministically.
          </p>
        </header>

        {/* Protocol Details */}
        <div className="space-y-12">
          {/* Phase 1 */}
          <section className="bg-[#0c131f] border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#00ff9d] block mb-1">
                  Phase 1 • Connection
                </span>
                <h2 className="text-lg font-bold text-white">Client Handshake (initialize)</h2>
              </div>
              <button
                onClick={() => copy(initJson, 'init')}
                className="text-xs font-mono px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
              >
                {copiedSection === 'init' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-slate-300 font-light leading-relaxed mb-4">
              Upon connection, external AI clients dispatch an <code className="text-[#00ff9d] font-mono">initialize</code> method to negotiate protocol capabilities. AgentBoost responds with supported tool schemas and server identity.
            </p>
            <pre className="p-4 rounded-xl bg-[#070c14] border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">
              {initJson}
            </pre>
          </section>

          {/* Phase 2 */}
          <section className="bg-[#0c131f] border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block mb-1">
                  Phase 2 • Reflection
                </span>
                <h2 className="text-lg font-bold text-white">Tool Discovery (tools/list)</h2>
              </div>
              <button
                onClick={() => copy(toolsListJson, 'list')}
                className="text-xs font-mono px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
              >
                {copiedSection === 'list' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-slate-300 font-light leading-relaxed mb-4">
              Hosts request the available capability catalog. AgentBoost exposes all 60+ verified skills formatted with standard JSON Schema input constraints.
            </p>
            <pre className="p-4 rounded-xl bg-[#070c14] border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed">
              {toolsListJson}
            </pre>
          </section>

          {/* Phase 3 */}
          <section className="bg-[#0c131f] border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 block mb-1">
                  Phase 3 • Execution
                </span>
                <h2 className="text-lg font-bold text-white">Tool Invocation (tools/call)</h2>
              </div>
              <button
                onClick={() => copy(callToolJson, 'call')}
                className="text-xs font-mono px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
              >
                {copiedSection === 'call' ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-slate-300 font-light leading-relaxed mb-4">
              When an AI model needs deterministic calculations (e.g., calculating Cap Rates, checking idle EC2 compute, scoring B2B leads), it dispatches a <code className="text-purple-400 font-mono">tools/call</code> request to the AgentBoost endpoint.
            </p>
            <pre className="p-4 rounded-xl bg-[#070c14] border border-slate-800 text-purple-300 font-mono text-xs overflow-x-auto leading-relaxed">
              {callToolJson}
            </pre>
          </section>

          {/* Callout */}
          <div className="rounded-2xl border border-slate-800 bg-[#0c131f] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Ready to connect Claude Desktop to AgentBoost?</h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">
                Generate an API key in your workspace dashboard to start running tools in Claude.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-[#00ff9d] text-[#070c14] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-300 transition shrink-0"
            >
              Get Access Key
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}