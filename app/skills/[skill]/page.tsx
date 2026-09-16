import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import Link from 'next/link';
import SkillViewer from './SkillViewer';
import skills from '@/app/lib/skillsData';

type Props = {
  params: Promise<{ skill: string }>;
  searchParams: Promise<{ key?: string }>;
};

export default async function SkillPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const skillId = resolvedParams.skill;
  const keyParam = resolvedSearchParams.key;

  const skill = skills.find((s) => s.id === skillId);
  const displayName = skill ? skill.name : decodeURIComponent(skillId).replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-[#070c14] text-[#f8fafc] font-sans antialiased selection:bg-[#00ff9d] selection:text-[#070c14]">
      <SiteHeader />

      <main className="max-w-[1240px] mx-auto px-6 md:px-12 py-12">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-8">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <span>/</span>
          <Link href="/#test-online" className="hover:text-white transition">Skills</Link>
          <span>/</span>
          <span className="text-[#00ff9d]">{displayName}</span>
        </nav>

        <SkillViewer skillId={skillId} keyParam={keyParam} />
      </main>

      <SiteFooter />
    </div>
  );
}