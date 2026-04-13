import fs from 'fs';
import path from 'path';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import Link from 'next/link';

type Props = { params: { skill: string } };

export default async function SkillPage({ params }: Props) {
  const skillId = params.skill;
  const mdPath = path.join(process.cwd(), 'skills', skillId, 'SKILL.md');
  let mdContent: string | null = null;
  try {
    mdContent = await fs.promises.readFile(mdPath, 'utf8');
  } catch (err) {
    mdContent = null;
  }

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

        <div className="bg-[#0b1220] border border-slate-800 rounded-lg p-6 text-slate-200 font-mono">
          {mdContent ? (
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">{mdContent}</pre>
          ) : (
            <p className="text-slate-400">SKILL.md not found for this skill.</p>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
