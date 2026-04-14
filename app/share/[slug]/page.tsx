'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SkillViewer from '@/app/skills/[skill]/SkillViewer';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import skills from '@/app/lib/skillsData';

export default function PublicSharePage({ params }: { params: Promise<{ slug: string }> }) {
  const searchParams = useSearchParams();
  const [skillId, setSkillId] = useState<string | null>(null);
  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      const slug = resolvedParams.slug;
      const sharedById = searchParams.get('shared_by');
      const shareId = searchParams.get('share_id');

      try {
        // Fetch share link info from API
        const response = await fetch(`/api/share-info/${slug}`);
        if (!response.ok) {
          setError('Share link not found or has expired');
          setLoading(false);
          return;
        }

        const data = await response.json();
        const foundSkill = skills.find(s => s?.id === data.skill_id);

        if (!foundSkill) {
          setError('Skill not found');
          setLoading(false);
          return;
        }

        setSkillId(data.skill_id);
        setSkill(foundSkill);
        setLoading(false);
      } catch (err) {
        console.error('Error loading share:', err);
        setError('Failed to load shared skill');
        setLoading(false);
      }
    };

    resolveParams();
  }, [params, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#00ff9d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading shared skill...</p>
        </div>
      </div>
    );
  }

  if (error || !skillId || !skill) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans antialiased">
        <SiteHeader />
        <main className="max-w-4xl mx-auto px-6 py-24">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8 text-center">
            <p className="text-red-400 font-semibold mb-2 text-lg">Share Link Expired or Invalid</p>
            <p className="text-slate-300 mb-6">{error || 'The skill could not be found'}</p>
            <a href="/" className="inline-block px-6 py-2 bg-[#00ff9d] text-[#0f172a] rounded font-semibold hover:bg-emerald-400 transition">
              Go to Home
            </a>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans antialiased">
      <SiteHeader />
      <main className="max-w-[1100px] mx-auto px-6 md:px-12 py-24">
        <div className="mb-8">
          <div className="inline-block px-3 py-1 bg-[#00ff9d]/20 border border-[#00ff9d]/30 rounded text-sm text-[#00ff9d] font-semibold mb-4">
            📤 Shared Skill
          </div>
          <h1 className="text-3xl font-semibold mb-4">{skill.name}</h1>
          <a href="/" className="text-[#00ff9d] hover:underline text-sm">↩ Back to Home</a>
        </div>

        <SkillViewer skillId={skillId} />
      </main>
      <SiteFooter />
    </div>
  );
}
