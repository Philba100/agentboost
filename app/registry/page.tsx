import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import Link from 'next/link';

export default function RegistryPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans antialiased">
      <SiteHeader />
      <main className="max-w-[1200px] mx-auto px-6 md:px-12 py-24">
        <h1 className="text-4xl font-semibold mb-6">Skill Registry</h1>
        <p className="text-slate-400 mb-6">A curated list of skills available to mount into your agents. Each skill page mirrors the landing layout for consistency.</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-medium">Browse Skills</h3>
            <p className="text-sm text-slate-400">Click any skill from the homepage registry to view its demo and SKILL.md content.</p>
          </div>
          <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-medium">Filters</h3>
            <p className="text-sm text-slate-400">Filter by category, product, or free vs paid.</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
