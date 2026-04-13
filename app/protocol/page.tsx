import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import Link from 'next/link';

export default function ProtocolPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans antialiased overflow-x-hidden">
      <SiteHeader />

      <header className="relative max-w-[1400px] mx-auto pt-20 pb-12 px-6 md:px-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00ff9d]/30 bg-[#00ff9d]/10 text-[11px] font-bold uppercase tracking-widest text-[#00ff9d] mb-6">
           MCP Protocol v2.4 Live
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold mb-4">MCP Protocol</h1>
        <p className="text-slate-400 text-lg max-w-2xl">Protocol documentation and versioned changelog for MCP integrations. This page mirrors landing layout for consistent UX.</p>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-6">
        <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 text-slate-300">
          <h2 className="text-xl font-medium mb-2">v2.4 — Live</h2>
          <p className="text-sm text-slate-400">Add protocol details, JSON schemas, and examples here. Link to full docs below.</p>
          <div className="mt-4">
            <Link href="/docs" className="text-[#00ff9d]">Open full docs</Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
