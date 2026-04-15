"use client";

import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function RegistryGrid({ skills }: { skills: any[] }) {
  const [filter, setFilter] = useState<'All'|'Finance'|'Marketing'>('All');

  const filtered = useMemo(() => {
    if (filter === 'All') return skills;
    return skills.filter((s) => (s.category || 'Other') === filter);
  }, [filter, skills]);

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <button onClick={() => setFilter('All')} className={`px-5 py-2 rounded text-[13px] font-medium ${filter==='All' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>All Tools</button>
        <button onClick={() => setFilter('Finance')} className={`px-5 py-2 rounded text-[13px] font-medium ${filter==='Finance' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>Finance</button>
        <button onClick={() => setFilter('Marketing')} className={`px-5 py-2 rounded text-[13px] font-medium ${filter==='Marketing' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>Marketing</button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((skill) => (
          <Link key={skill.id} href={`/skills/${skill.id}`} className="block no-underline">
            <div className="group p-8 rounded-2xl bg-[#1e293b] border border-slate-700 hover:border-[#00ff9d]/40 transition-all duration-300 relative overflow-hidden flex flex-col h-full shadow-lg cursor-pointer">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00ff9d]/5 blur-[60px] rounded-full group-hover:bg-[#00ff9d]/15 transition-all duration-500 pointer-events-none"></div>
              <div className="flex items-start mb-6 relative z-10">
                <div className="text-3xl p-3 bg-[#0f172a] border border-slate-700 rounded-xl text-white shadow-inner group-hover:border-[#00ff9d]/30 transition-colors">
                  {skill.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white tracking-tight">{skill.name}</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed font-light flex-grow">{skill.desc}</p>
              <div className="space-y-2 mb-8 relative z-10">
                {skill.benefits.map((benefit: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-[12px] text-slate-300 font-light">
                    <svg className="w-4 h-4 text-[#00ff9d]/70 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {benefit}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-700 pt-6 relative z-10">
                <div className="text-center w-full bg-slate-800 border border-slate-600 text-slate-300 px-5 py-3 rounded-lg font-medium text-[12px] hover:bg-slate-700 transition-all">
                  View Demo / SKILL.md
                </div>
                <Link href={`/login?next=/dashboard?skill=${skill.id}`} onClick={(e) => e.stopPropagation()} className="text-center w-full bg-transparent border border-slate-500 text-white px-5 py-3 rounded-lg font-medium text-[12px] hover:bg-[#00ff9d] hover:text-[#0f172a] hover:border-[#00ff9d] transition-all no-underline">
                  Provision License
                </Link>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
