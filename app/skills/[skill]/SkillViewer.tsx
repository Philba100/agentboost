"use client";

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import skills from '@/app/lib/skillsData';

interface SkillDetail {
  id: string;
  icon: string;
  name: string;
  desc: string;
  benefits: string[];
  category?: string;
}

export default function SkillViewer({ skillId, keyParam }: { skillId: string; keyParam?: string }) {
  const [md, setMd] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'openclaw' | 'mobile'>('overview');
  const [validating, setValidating] = useState(!!keyParam);
  const [keyValid, setKeyValid] = useState(!keyParam);
  
  const skill = skills.find(s => s.id === skillId) as SkillDetail | undefined;

  // Validate key if provided in URL
  useEffect(() => {
    if (!keyParam) {
      setValidating(false);
      setKeyValid(true);
      return;
    }

    const validateKey = async () => {
      try {
        const response = await fetch(`/api/validate-token?key=${encodeURIComponent(keyParam)}&skill=${encodeURIComponent(skillId)}`);
        const data = await response.json();
        if (data.valid) {
          setKeyValid(true);
          setErr(null);
        } else {
          setKeyValid(false);
          setErr(`Access denied: ${data.error || 'Invalid key'}`);
        }
      } catch (e) {
        setKeyValid(false);
        setErr(`Validation error: ${(e as Error).message}`);
      }
      setValidating(false);
    };

    validateKey();
  }, [keyParam, skillId]);

  useEffect(() => {
    if (!keyValid) return;
    
    let mounted = true;
    setErr(null);
    setMd(null);
    
    fetch(`/api/skill-md?id=${encodeURIComponent(skillId)}`)
      .then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP ${r.status}: ${r.statusText}`);
        }
        return r.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (data.content) {
          setMd(data.content);
          setErr(null);
        } else if (data.error) {
          setErr(`Unable to load: ${data.error}`);
        } else {
          setErr('Skill documentation not available');
        }
      })
      .catch((err) => {
        if (!mounted) return;
        console.error('Markdown fetch error:', err);
        setErr(`Failed to load documentation: ${err.message}`);
      });
    return () => { mounted = false; };
  }, [skillId, keyValid]);

  return (
    <div className="space-y-8">
      {/* Validation State */}
      {validating && (
        <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-8 text-center">
          <div className="w-8 h-8 border-2 border-[#00ff9d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Validating access...</p>
        </div>
      )}

      {!validating && !keyValid && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8 text-center">
          <p className="text-red-400 font-semibold mb-2 text-lg">Access Denied</p>
          <p className="text-slate-300 mb-4">{err}</p>
          <a href="/dashboard" className="inline-block px-6 py-2 bg-[#00ff9d] text-[#0f172a] rounded font-semibold hover:bg-emerald-400 transition-all">
            Go to Dashboard
          </a>
        </div>
      )}

      {!validating && keyValid && (
        <>
      {skill && (
        <div className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] border border-slate-700 rounded-lg p-8">
          <div className="flex items-start gap-4">
            <div className="text-5xl">{skill.icon}</div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">{skill.name}</h1>
              <p className="text-slate-400 text-lg mb-4">{skill.desc}</p>
              {skill.category && (
                <span className="inline-block px-3 py-1 bg-[#00ff9d] text-[#0f172a] text-sm font-semibold rounded">
                  {skill.category}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 font-semibold border-b-2 transition ${
            activeTab === 'overview'
              ? 'text-[#00ff9d] border-[#00ff9d]'
              : 'text-slate-400 border-transparent hover:text-slate-300'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('openclaw')}
          className={`px-4 py-3 font-semibold border-b-2 transition ${
            activeTab === 'openclaw'
              ? 'text-[#00ff9d] border-[#00ff9d]'
              : 'text-slate-400 border-transparent hover:text-slate-300'
          }`}
        >
          How to Use in OpenClaw
        </button>
        <button
          onClick={() => setActiveTab('mobile')}
          className={`px-4 py-3 font-semibold border-b-2 transition ${
            activeTab === 'mobile'
              ? 'text-[#00ff9d] border-[#00ff9d]'
              : 'text-slate-400 border-transparent hover:text-slate-300'
          }`}
        >
          Mobile / Edge Gallery
        </button>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Markdown Documentation */}
              <div className="bg-[#0b1220] border border-slate-800 rounded-lg p-6 text-slate-200">
                <h2 className="text-2xl font-bold text-white mb-4">Documentation</h2>
                {md ? (
                  <article className="prose prose-invert max-w-none text-sm prose-headings:text-white prose-headings:font-bold prose-a:text-[#00ff9d] prose-code:bg-[#1e293b] prose-code:text-[#e2e8f0] prose-pre:bg-[#1e293b]">
                    <ReactMarkdown>{md}</ReactMarkdown>
                  </article>
                ) : err ? (
                  <p className="text-slate-400">{err}</p>
                ) : (
                  <p className="text-slate-500">Loading...</p>
                )}
              </div>

              {/* Features */}
              {skill && skill.benefits.length > 0 && (
                <div className="bg-[#0b1220] border border-slate-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
                  <ul className="space-y-2">
                    {skill.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-[#00ff9d] font-bold mt-1">✓</span>
                        <span className="text-slate-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'openclaw' && (
            <div className="bg-[#0b1220] border border-slate-800 rounded-lg p-6 space-y-6 text-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">How to Use in OpenClaw</h2>
                <p className="text-slate-400 mb-6">OpenClaw is a powerful multi-agent orchestration platform. Follow these steps to use this skill:</p>
              </div>

              <div className="space-y-4">
                <div className="bg-[#1e293b] border-l-4 border-[#00ff9d] p-4 rounded">
                  <h4 className="font-bold text-white mb-2">Step 1: Install the Skill</h4>
                  <p className="text-slate-300 text-sm">
                    Navigate to the Agent Registry in your OpenClaw dashboard. Search for "{skill?.name}" and click "Install" to add it to your workspace.
                  </p>
                </div>

                <div className="bg-[#1e293b] border-l-4 border-[#00ff9d] p-4 rounded">
                  <h4 className="font-bold text-white mb-2">Step 2: Configure Parameters</h4>
                  <p className="text-slate-300 text-sm">
                    After installation, go to Settings → Skills → {skill?.name}. Fill in any required API keys, integrations, or configuration parameters specific to your workflow.
                  </p>
                </div>

                <div className="bg-[#1e293b] border-l-4 border-[#00ff9d] p-4 rounded">
                  <h4 className="font-bold text-white mb-2">Step 3: Create a Workflow</h4>
                  <p className="text-slate-300 text-sm">
                    Go to Workflows → Create New. Drag "{skill?.name}" from the skill library into your canvas. Connect it to other agents or input/output nodes as needed.
                  </p>
                </div>

                <div className="bg-[#1e293b] border-l-4 border-[#00ff9d] p-4 rounded">
                  <h4 className="font-bold text-white mb-2">Step 4: Execute</h4>
                  <p className="text-slate-300 text-sm">
                    Click "Run" or activate your workflow. The {skill?.name} skill will execute with your configured parameters and return results in real-time.
                  </p>
                </div>

                <div className="bg-[#1e293b] border-l-4 border-[#00ff9d] p-4 rounded">
                  <h4 className="font-bold text-white mb-2">Step 5: Monitor & Debug</h4>
                  <p className="text-slate-300 text-sm">
                    View execution logs and debug information in the Logs panel. Use breakpoints to step through execution and verify outputs.
                  </p>
                </div>
              </div>

              <div className="bg-[#1a4d2e] p-4 rounded border border-[#00ff9d]">
                <p className="text-slate-200 text-sm">
                  <strong>💡 Tip:</strong> You can chain multiple skills together to create powerful multi-step automation workflows. Use data mapping to pass outputs from one skill as inputs to the next.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'mobile' && (
            <div className="bg-[#0b1220] border border-slate-800 rounded-lg p-6 space-y-6 text-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Using on Mobile & Edge Gallery</h2>
                <p className="text-slate-400 mb-6">Access and use {skill?.name} on mobile devices through the Edge Gallery:</p>
              </div>

              <div className="space-y-4">
                <div className="bg-[#1e293b] border-l-4 border-[#00ff9d] p-4 rounded">
                  <h4 className="font-bold text-white mb-2">📱 Mobile Access</h4>
                  <p className="text-slate-300 text-sm mb-3">
                    Open your mobile browser and navigate to <code className="bg-[#0b1220] px-2 py-1 rounded text-[#e2e8f0]">agentboost-seven.vercel.app</code>. You'll automatically be redirected to the mobile-optimized version.
                  </p>
                  <ul className="text-slate-300 text-sm space-y-2 ml-4">
                    <li>• iOS: Safari, Chrome, or any modern browser</li>
                    <li>• Android: Chrome, Firefox, or any modern browser</li>
                    <li>• Tablet: Full desktop experience available</li>
                  </ul>
                </div>

                <div className="bg-[#1e293b] border-l-4 border-[#00ff9d] p-4 rounded">
                  <h4 className="font-bold text-white mb-2">🛍️ Edge Gallery</h4>
                  <p className="text-slate-300 text-sm mb-3">
                    The Edge Gallery is a curated marketplace of AI agents and skills available on mobile:
                  </p>
                  <ol className="text-slate-300 text-sm space-y-2 ml-4">
                    <li>1. Open Edge Gallery from your mobile home screen</li>
                    <li>2. Search for "{skill?.name}"</li>
                    <li>3. Tap "Add to Home" to create a quick access shortcut</li>
                    <li>4. Use the skill directly from the widget interface</li>
                  </ol>
                </div>

                <div className="bg-[#1e293b] border-l-4 border-[#00ff9d] p-4 rounded">
                  <h4 className="font-bold text-white mb-2">⚡ Quick Actions</h4>
                  <p className="text-slate-300 text-sm mb-3">
                    Set up quick action shortcuts on your mobile home screen:
                  </p>
                  <ul className="text-slate-300 text-sm space-y-2 ml-4">
                    <li>• Long-press the skill widget → "Add to Home Screen"</li>
                    <li>• Create custom voice commands (iOS: Siri Shortcuts, Android: Google Assistant routines)</li>
                    <li>• Share results via SMS, email, or messaging apps</li>
                  </ul>
                </div>

                <div className="bg-[#1e293b] border-l-4 border-[#00ff9d] p-4 rounded">
                  <h4 className="font-bold text-white mb-2">🔔 Notifications</h4>
                  <p className="text-slate-300 text-sm">
                    Enable push notifications to receive alerts when your skill tasks complete. Go to Settings → Notifications → {skill?.name} and toggle "Enable Alerts".
                  </p>
                </div>

                <div className="bg-[#1e293b] border-l-4 border-[#00ff9d] p-4 rounded">
                  <h4 className="font-bold text-white mb-2">📲 Responsive Design</h4>
                  <p className="text-slate-300 text-sm">
                    All features are optimized for touch input. Swipe to navigate, tap buttons for actions, and pinch to zoom for detailed views.
                  </p>
                </div>
              </div>

              <div className="bg-[#1a4d2e] p-4 rounded border border-[#00ff9d]">
                <p className="text-slate-200 text-sm">
                  <strong>💡 Tip:</strong> For the best mobile experience, use the demo button below or save a bookmark to your home screen. Mobile web apps can work offline after the first load!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Demo & Info */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-4">
            {/* Demo Card */}
            <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-3">Try the Demo</h3>
              <p className="text-slate-400 text-sm mb-4">
                Click below to open an interactive demo of this skill in your browser.
              </p>
              <a
                href={`/skills/${skillId}/scripts/index.html`}
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center px-4 py-3 bg-[#00ff9d] text-[#0f172a] rounded font-semibold hover:bg-[#00e085] transition"
              >
                Open Demo
              </a>
            </div>

            {/* Info Card */}
            {skill && (
              <div className="bg-[#0b1220] border border-slate-800 rounded-lg p-6 text-slate-200 text-sm space-y-3">
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">Category</p>
                  <p className="text-white font-semibold">{skill.category || 'General'}</p>
                </div>
                <div className="border-t border-slate-700 pt-3">
                  <p className="text-slate-500 text-xs uppercase tracking-wide">Skill ID</p>
                  <p className="text-slate-300 font-mono text-xs break-all">{skillId}</p>
                </div>
                <div className="border-t border-slate-700 pt-3">
                  <p className="text-slate-500 text-xs uppercase tracking-wide">Type</p>
                  <p className="text-white font-semibold">AI Agent / Workflow Skill</p>
                </div>
              </div>
            )}

            {/* Resources Card */}
            <div className="bg-[#0b1220] border border-slate-800 rounded-lg p-6">
              <h4 className="text-white font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/docs" className="text-[#00ff9d] hover:underline">
                    📖 Full Documentation
                  </a>
                </li>
                <li>
                  <a href="/protocol" className="text-[#00ff9d] hover:underline">
                    🔌 API & Integration Docs
                  </a>
                </li>
                <li>
                  <a href="/" className="text-[#00ff9d] hover:underline">
                    🏠 Back to Home
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
