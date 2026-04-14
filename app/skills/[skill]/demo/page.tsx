'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import skills from '@/app/lib/skillsData';

export default function DemoPage({ params }: { params: Promise<{ skill: string }> }) {
  const [skillId, setSkillId] = useState('');
  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setSkillId(resolvedParams.skill);
      
      const foundSkill = skills.find(s => s?.id === resolvedParams.skill);
      setSkill(foundSkill);
      setLoading(false);
    };
    
    resolveParams();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00ff9d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 font-semibold mb-4">Skill not found</p>
          <Link href="/dashboard" className="text-[#00ff9d] hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans antialiased">
      {/* Header */}
      <div className="border-b border-slate-800 bg-[#1e293b]/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">{skill.icon} {skill.name} Demo</h1>
            <Link href={`/skills/${skillId}`} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-sm hover:bg-slate-700 transition">
              ← Back to Docs
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-slate-700 rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">{skill.name}</h2>
          <p className="text-slate-400 text-lg mb-6">{skill.desc}</p>
          
          {skill.category && (
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-[#00ff9d] text-[#0f172a] text-sm font-semibold rounded">
                {skill.category}
              </span>
            </div>
          )}

          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
            <ul className="space-y-2">
              {skill.benefits?.map((benefit: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-[#00ff9d] font-bold mt-1">✓</span>
                  <span className="text-slate-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Interactive Demo Section */}
        <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">🎮 Interactive Demo</h2>
          
          <div className="bg-[#0f172a] border border-slate-700 rounded-lg p-6 mb-6">
            <p className="text-slate-400 mb-4">
              This is a demonstration of the <strong>{skill.name}</strong> skill. 
            </p>
            
            <div className="bg-slate-800/50 border border-slate-700 rounded p-4 mb-4">
              <p className="text-slate-300 text-sm font-mono mb-3">
                Sample Input:
              </p>
              <div className="bg-[#0f172a] rounded p-3 text-slate-300 text-xs font-mono overflow-x-auto">
                <pre>{`{
  "company_name": "Acme Corp",
  "company_size": "500-1000",
  "industry": "SaaS",
  "contact_title": "VP Sales",
  "estimated_budget": 50000,
  "budget_confidence": "high",
  "decision_authority": "C-suite"
}`}</pre>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded p-4">
              <p className="text-slate-300 text-sm font-mono mb-3">
                Expected Output:
              </p>
              <div className="bg-[#0f172a] rounded p-3 text-slate-300 text-xs font-mono overflow-x-auto">
                <pre>{`{
  "qualification_score": 92,
  "bant_breakdown": {
    "budget": "Strong",
    "authority": "Decision Maker",
    "need": "High Priority",
    "timeline": "Immediate"
  },
  "recommendation": "QUALIFIED - Proceed to demo",
  "next_actions": [
    "Schedule product demo",
    "Prepare ROI analysis",
    "Identify stakeholders"
  ]
}`}</pre>
              </div>
            </div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 text-sm">
              <strong>✓ Ready to Use:</strong> This skill is ready for production integration. 
              Head back to the documentation to learn how to implement it in OpenClaw or access it via API.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <Link 
            href={`/skills/${skillId}`} 
            className="inline-block px-6 py-3 bg-[#00ff9d] text-[#0f172a] rounded font-semibold hover:bg-emerald-400 transition-all"
          >
            View Full Documentation
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 bg-[#1e293b]/50 mt-12 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center text-slate-400 text-sm">
          <p>Want to use {skill.name} in production? <Link href="/dashboard" className="text-[#00ff9d] hover:underline">Go to Dashboard</Link></p>
        </div>
      </div>
    </div>
  );
}
