"use client";

import Link from 'next/link';
import { useMemo, useState } from 'react';
import LiveExecutionModal from './LiveExecutionModal';

export default function RegistryGrid({ skills }: { skills: any[] }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [testingSkill, setTestingSkill] = useState<any | null>(null);

  const categories = useMemo(() => {
    const values = new Set<string>();
    skills.forEach((skill) => values.add(skill.category || 'Other'));
    return ['All', ...Array.from(values).sort()];
  }, [skills]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return skills.filter((skill) => {
      const matchesCategory = filter === 'All' || (skill.category || 'Other') === filter;
      const searchable = [
        skill.id,
        skill.name,
        skill.desc,
        ...(skill.benefits || [])
      ].join(' ').toLowerCase();
      return matchesCategory && (!query || searchable.includes(query));
    });
  }, [filter, search, skills]);

  return (
    <div>
      {/* Category Strip and Search */}
      <div className="mb-10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search skills, workflows, or capabilities..."
          className="w-full md:w-80 rounded-lg border border-slate-700 bg-[#1e293b] px-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none transition focus:border-[#00ff9d]"
        />

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 [scrollbar-width:none]">
          {categories.map((category) => {
            const isActive = filter === category;
            return (
              <button
                key={category}
                onClick={() => setFilter(category)}
                style={{ color: isActive ? '#0f172a' : undefined }}
                className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00ff9d] !text-[#0f172a] font-bold shadow-[0_0_12px_rgba(0,255,157,0.2)]'
                    : 'border border-slate-700 bg-[#1e293b] text-slate-400 hover:text-white'
                }`}
              >
                {category === 'All' ? 'All Tools' : category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-[#1e293b]/40 py-16 text-center text-slate-400">
          No skills found matching your search.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((skill) => (
            <div
              key={skill.id}
              className="group p-8 rounded-2xl bg-[#1e293b] border border-slate-700 hover:border-[#00ff9d]/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between shadow-lg"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00ff9d]/5 blur-[60px] rounded-full group-hover:bg-[#00ff9d]/15 transition-all duration-500 pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="text-3xl p-3 bg-[#0f172a] border border-slate-700 rounded-xl text-white shadow-inner group-hover:border-[#00ff9d]/30 transition-colors">
                    {skill.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-[#0f172a] text-slate-400 border border-slate-700">
                    {skill.category || 'General'}
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-2 text-white tracking-tight">{skill.name}</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed font-light">{skill.desc}</p>

                <div className="space-y-2 mb-8 relative z-10">
                  {skill.benefits?.slice(0, 3).map((benefit: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-[12px] text-slate-300 font-light">
                      <svg className="w-4 h-4 text-[#00ff9d]/70 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 border-t border-slate-700 pt-6 relative z-10">
                <button
                  onClick={() => setTestingSkill(skill)}
                  className="w-full text-center bg-slate-800 border border-slate-600 hover:border-[#00ff9d] text-slate-200 hover:text-white px-4 py-2.5 rounded-lg font-medium text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>⚡</span> Test Live in Browser
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/skills/${skill.id}`}
                    className="text-center w-full bg-[#0f172a] border border-slate-700 text-slate-400 hover:text-white py-2 rounded-lg font-medium text-[11px] transition"
                  >
                    View Demo / SKILL.md
                  </Link>

                  <Link
                    href={`/dashboard?skill=${skill.id}`}
                    className="text-center w-full bg-transparent border border-slate-700 hover:border-[#00ff9d] text-slate-300 hover:text-[#00ff9d] py-2 rounded-lg font-medium text-[11px] transition"
                  >
                    Provision Key
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {testingSkill && (
        <LiveExecutionModal
          skill={testingSkill}
          onClose={() => setTestingSkill(null)}
        />
      )}
    </div>
  );
}