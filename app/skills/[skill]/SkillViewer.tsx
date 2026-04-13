"use client";

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function SkillViewer({ skillId }: { skillId: string }) {
  const [md, setMd] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/skill-md?id=${encodeURIComponent(skillId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (data.content) setMd(data.content);
        else setErr('SKILL.md not found');
      })
      .catch(() => {
        if (!mounted) return;
        setErr('Failed to load');
      });
    return () => { mounted = false; };
  }, [skillId]);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-[#0b1220] border border-slate-800 rounded-lg p-6 text-slate-200">
        {md ? (
          <article className="prose prose-invert max-w-none">
            <ReactMarkdown>{md}</ReactMarkdown>
          </article>
        ) : err ? (
          <p className="text-slate-400">{err}</p>
        ) : (
          <p className="text-slate-500">Loading...</p>
        )}
      </div>

      <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-3">Demo</h3>
        <p className="text-slate-400 text-sm mb-4">Open the demo in a new tab to interact with this skill's webview.</p>
        <a href={`/skills/${skillId}/scripts/index.html`} target="_blank" rel="noreferrer" className="inline-block px-4 py-3 bg-[#00ff9d] text-[#0f172a] rounded font-semibold">Open Demo</a>
      </div>
    </div>
  );
}
