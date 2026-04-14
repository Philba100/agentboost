import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import Link from 'next/link';
import SkillViewer from './SkillViewer';

type Props = { 
  params: Promise<{ skill: string }>;
  searchParams: Promise<{ key?: string }>;
};

export default async function SkillPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const skillId = resolvedParams.skill;
  const keyParam = resolvedSearchParams.key;

  const displayName = skillId ? decodeURIComponent(skillId).replace(/-/g, ' ') : 'Skill';

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans antialiased">
      <SiteHeader />
      <main className="max-w-[1100px] mx-auto px-6 md:px-12 py-24">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-4">{displayName}</h1>
          <div className="flex gap-3">
            <Link href={`/skills/${skillId}/demo`} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-sm hover:bg-slate-700 transition">Open Demo</Link>
            <Link href="/dashboard" className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-sm hover:bg-slate-700 transition">← Back to Dashboard</Link>
          </div>
        </div>

        <SkillViewer skillId={skillId} keyParam={keyParam} />
      </main>
      <SiteFooter />
    </div>
  );
}
