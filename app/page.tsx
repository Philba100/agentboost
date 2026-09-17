"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import RegistryGrid from './components/RegistryGrid';
import skills from './lib/skillsData';
import { isTauri } from '@/lib/tauri';

const MSI_INSTALLER_URL =
  'https://lewgsyjntzsqfxdtkcin.supabase.co/storage/v1/object/public/installers/AgentBoost_0.1.0_x64_en-US.msi';

export default function Home() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    isTauri().then((inTauri) => {
      if (inTauri) {
        router.replace('/desktop');
      }
    });
  }, [router]);

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

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans antialiased overflow-x-hidden selection:bg-[#00ff9d] selection:text-[#0f172a]">
      <SiteHeader />

      {/* Balanced 2-Column Hero */}
      <header className="relative max-w-[1400px] mx-auto pt-20 pb-28 px-6 md:px-12 grid lg:grid-cols-2 gap-16 items-center">
        {/* Ambient Depth Glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full -z-10 pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#00ff9d]/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

        {/* Left Column: Typography & Direct Action Buttons */}
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00ff9d]/30 bg-[#00ff9d]/10 text-[11px] font-bold uppercase tracking-widest text-[#00ff9d] mb-8">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff9d] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00ff9d]"></span>
            </span>
            MCP Protocol v2.4 Live
          </div>

          <h1 className="text-5xl md:text-[75px] font-semibold mb-8 leading-[1.05] tracking-tighter text-white">
            Extend your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
              Agent&apos;s Context.
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-xl leading-relaxed font-light">
            The institutional registry for MCP tooling and Mobile AI Webviews. Equip your autonomous fleet with verified, high-fidelity deterministic skills in seconds.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#registry"
              style={{ color: '#0f172a' }}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#00ff9d] px-7 py-4 text-sm font-bold uppercase tracking-wider !text-[#0f172a] shadow-[0_0_20px_rgba(0,255,157,0.2)] transition-all hover:bg-emerald-300 cursor-pointer"
            >
              Explore Registry <span aria-hidden="true">→</span>
            </a>

            {/* Direct MSI Installer Download */}
            <a
              href={MSI_INSTALLER_URL}
              download="AgentBoost_0.1.0_x64_en-US.msi"
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-[#1e293b] px-6 py-4 text-sm font-mono text-slate-300 transition-colors hover:border-slate-500 hover:text-white cursor-pointer"
            >
              <span className="text-[#00ff9d]">💻</span> download_desktop (.msi)
            </a>
          </div>
        </div>

        {/* Right Column: Runtime Terminal Card */}
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

              <button
                onClick={handleCopy}
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded border border-slate-700 text-xs font-mono cursor-pointer"
              >
                {copied ? (
                  <>
                    <span className="text-[#00ff9d]">✓</span> Copied
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="p-6 font-mono text-[13px] leading-relaxed overflow-x-auto text-slate-300">
              <span className="text-[#c678dd]">import</span> agentboost <span className="text-[#c678dd]">as</span> ab<br /><br />
              <span className="text-slate-500"># Initialize autonomous fleet</span><br />
              client <span className="text-[#56b6c2]">=</span> ab.Client(api_key<span className="text-[#56b6c2]">=</span><span className="text-[#98c379]">&apos;sk_live_...&apos;</span>)<br /><br />
              <span className="text-slate-500"># Mount institutional tools via MCP</span><br />
              agent.mount(client.skills.get(<span className="text-[#98c379]">&apos;crypto_quant_v2&apos;</span>))<br /><br />
              <span className="text-[#e5c07b]">try</span>:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;response <span className="text-[#56b6c2]">=</span> agent.execute(<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;task<span className="text-[#56b6c2]">=</span><span className="text-[#98c379]">&quot;Optimize delta-neutral portfolio&quot;</span>,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strict_mode<span className="text-[#56b6c2]">=</span><span className="text-[#d19a66]">True</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#56b6c2]">print</span>(response.metrics.sharpe_ratio)<br />
              <span className="text-[#e5c07b]">except</span> ab.errors.ContextLimitExceeded:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;agent.recalibrate_memory()
            </div>
          </div>
        </div>
      </header>

      {/* Solutions / Skill Registry Section */}
      <section id="registry" className="max-w-[1400px] mx-auto py-24 px-6 md:px-12 border-t border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight text-white">Skill Registry</h2>
            <p className="text-slate-400 text-lg leading-relaxed font-light">
              Deterministically evaluated and security-audited capabilities. <br className="hidden md:block" />
              Ready to be injected into your agent&apos;s context window or mobile device.
            </p>
          </div>
          <div className="flex gap-4 border border-slate-800 rounded-md p-1 bg-[#1e293b]">
            <span className="px-5 py-2 rounded text-[13px] font-medium text-slate-400">Filters:</span>
            <span className="px-5 py-2 rounded text-[13px] font-medium text-slate-400">All / Finance / Marketing / Trade</span>
          </div>
        </div>

        <RegistryGrid skills={skills} />
      </section>

      {/* Telemetry Stats */}
      <section className="relative border-y border-slate-800 bg-[#0f172a] py-24 overflow-hidden">
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