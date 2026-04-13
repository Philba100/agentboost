import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import Link from 'next/link';

export default function ProtocolPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans antialiased">
      <SiteHeader />
      <main className="max-w-[1100px] mx-auto px-6 md:px-12 py-24">
        <h1 className="text-4xl font-semibold mb-6">MCP Protocol</h1>
        <p className="text-slate-400 mb-6">Protocol documentation and versioned changelog for MCP integrations.</p>
        <div className="bg-[#0f172a] border border-slate-700 rounded-md p-6 text-slate-300">
          <h2 className="text-xl font-medium mb-2">v2.4 — Live</h2>
          <p className="text-sm text-slate-400">This page is a lightweight placeholder that mirrors the landing layout. Add protocol docs here or link to internal docs.</p>
        </div>
        <div className="mt-8">
          <Link href="/docs" className="text-[#00ff9d]">Open full docs</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
