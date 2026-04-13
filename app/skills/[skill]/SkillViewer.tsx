"use client";

import { useEffect, useState } from 'react';

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
    <div className="bg-[#0b1220] border border-slate-800 rounded-lg p-6 text-slate-200 font-mono">
      {md ? (
        <pre className="whitespace-pre-wrap text-sm leading-relaxed">{md}</pre>
      ) : err ? (
        <p className="text-slate-400">{err}</p>
      ) : (
        <p className="text-slate-500">Loading...</p>
      )}
    </div>
  );
}
