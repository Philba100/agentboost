import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import Link from 'next/link';
import SkillViewer from './SkillViewer';

type Props = { params: { skill: string }, searchParams: { token?: string } };

export default function SkillPage({ params, searchParams }: Props) {
  const skillId = params.skill;
  const token = searchParams.token;

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans antialiased">
      <SiteHeader />
      <main className="max-w-[1100px] mx-auto px-6 md:px-12 py-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold">{skillId.replace(/-/g, ' ')}</h1>
          <div className="flex gap-3">
            <Link href={`/skills/${skillId}/scripts/index.html`} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-sm">Open Demo</Link>
            <a href={`/skills/${skillId}/SKILL.md`} className="px-4 py-2 bg-transparent border border-slate-700 rounded text-sm">Raw SKILL.md</a>
          </div>
        </div>

        <SkillViewer skillId={skillId} shareToken={token} />
      </main>
      <SiteFooter />
    </div>
  );
}
