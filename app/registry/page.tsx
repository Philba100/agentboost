import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import RegistryGrid from '../components/RegistryGrid';
import skills from '../lib/skillsData';

export default function RegistryPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans antialiased overflow-x-hidden">
      <SiteHeader />

      <header className="relative max-w-[1400px] mx-auto pt-20 pb-12 px-6 md:px-12">
        <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-white">Skill Registry</h1>
        <p className="text-slate-400 text-lg max-w-2xl">Deterministically evaluated and security-audited capabilities. Ready to be injected into your agent's context window or mobile device.</p>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-6">
        <RegistryGrid skills={skills} />
      </main>

      <SiteFooter />
    </div>
  );
}
