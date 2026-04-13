"use client";

import Link from 'next/link';
import { useState } from 'react';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import RegistryGrid from './components/RegistryGrid';
import skills from './lib/skillsData';

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
            <span className="px-5 py-2 rounded text-[13px] font-medium text-slate-400">Filters:</span>
            <span className="px-5 py-2 rounded text-[13px] font-medium text-slate-400">All / Finance / Marketing</span>
          </div>
        </div>
        
        <RegistryGrid skills={skills} />
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