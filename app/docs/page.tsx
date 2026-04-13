import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0b0e14] text-white font-sans selection:bg-[#00ff9d] selection:text-black">
      
      {/* Simple Nav */}
      <nav className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0b0e14]/50 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="text-xl font-black tracking-tighter hover:opacity-80 transition">
          Agent<span className="text-[#00ff9d]">Boost</span> <span className="text-gray-600 text-xs ml-2 uppercase font-mono">Docs</span>
        </Link>
        <Link href="/dashboard" className="text-xs font-bold text-[#00ff9d] hover:underline uppercase tracking-widest">
          Go to Dashboard →
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto py-20 px-6">
        <h1 className="text-5xl font-black mb-4 tracking-tighter">Setup Guide</h1>
        <p className="text-gray-400 text-lg mb-16">Connect AgentBoost to your favorite AI environments in minutes.</p>

        <div className="space-y-24">
          
          {/* SECTION 1: MOBILE */}
          <section id="mobile">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-[#00ff9d] text-black flex items-center justify-center rounded-xl font-black">01</div>
              <h2 className="text-2xl font-bold">Google AI Edge Gallery (Mobile)</h2>
            </div>
            <div className="bg-[#151a22] border border-gray-800 p-8 rounded-3xl">
              <p className="text-gray-300 mb-6 leading-relaxed">
                Unlock visual dashboards on your Android device. AgentBoost skills use the <code className="text-[#00ff9d]">run_js</code> tool to render premium data UIs.
              </p>
              <ol className="space-y-4 text-sm text-gray-400 list-decimal list-inside">
                <li>Go to the <Link href="/#skills" className="text-[#00ff9d] underline">Marketplace</Link> and find a skill.</li>
                <li>Copy the <strong className="text-white text-xs font-mono">Mobile Install Link</strong> (SKILL.md URL).</li>
                <li>Open <strong>AI Edge Gallery</strong> on your phone.</li>
                <li>Tap <strong>Manage Skills</strong> → <strong>(+)</strong> → <strong>Import from URL</strong>.</li>
                <li>Paste the URL and chat with your AI to trigger the dashboard.</li>
              </ol>
            </div>
          </section>

          {/* SECTION 2: CLAUDE / CURSOR */}
          <section id="mcp">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-[#00ff9d] text-black flex items-center justify-center rounded-xl font-black">02</div>
              <h2 className="text-2xl font-bold">Claude Desktop & Cursor (MCP)</h2>
            </div>
            <div className="bg-[#151a22] border border-gray-800 p-8 rounded-3xl">
              <p className="text-gray-300 mb-6 leading-relaxed">
                AgentBoost supports the <strong>Model Context Protocol (MCP)</strong> standard. Connect our server to use all skills as native tools inside your desktop AI.
              </p>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Configuration Snippet</p>
                  <pre className="bg-black p-6 rounded-2xl border border-gray-800 text-xs font-mono text-blue-300 overflow-x-auto leading-relaxed">
{`"mcpServers": {
  "agentboost": {
    "command": "npx",
    "args": [
      "-y", 
      "@modelcontextprotocol/server-http", 
      "https://agentboost-seven.vercel.app/api/mcp"
    ],
    "env": {
      "AGENTBOOST_KEY": "YOUR_SK_KEY_HERE"
    }
  }
}`}
                  </pre>
                </div>
                
                <div className="bg-[#00ff9d]/5 border border-[#00ff9d]/20 p-4 rounded-xl">
                  <p className="text-xs text-[#00ff9d] leading-relaxed">
                    <strong>Note:</strong> Replace <code className="bg-black px-1 rounded text-white">YOUR_SK_KEY_HERE</code> with the key generated in your <Link href="/dashboard" className="underline">Dashboard</Link>.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: PYTHON / OPENCLAW */}
          <section id="api">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-[#00ff9d] text-black flex items-center justify-center rounded-xl font-black">03</div>
              <h2 className="text-2xl font-bold">OpenClaw & Python Automation</h2>
            </div>
            <div className="bg-[#151a22] border border-gray-800 p-8 rounded-3xl">
              <p className="text-gray-300 mb-6 leading-relaxed">
                Build your own agents or use OpenClaw by calling our headless execution API directly.
              </p>
              
              <pre className="bg-black p-6 rounded-2xl border border-gray-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
{`import requests

def call_agentboost(skill, params):
    res = requests.post(
        "https://agentboost-seven.vercel.app/api/v1/execute",
        headers={"Authorization": "Bearer sk_your_key_here"},
        json={"skill": skill, "data": params}
    )
    return res.json()

# Example: Run a B2B lead search
data = call_agentboost("b2b-leads", {
    "domain": "stripe.com", 
    "role": "CEO"
})

print(data['data']['verified_leads'][0]['email'])`}
              </pre>
            </div>
          </section>

        </div>

        {/* Support CTA */}
        <div className="mt-32 text-center border-t border-gray-800 pt-20">
          <h3 className="text-xl font-bold mb-4">Need help with integration?</h3>
          <p className="text-gray-500 text-sm mb-8">Our technical team is available for Enterprise support.</p>
          <a href="mailto:support@agentboost.com" className="bg-white text-black font-bold py-3 px-8 rounded-xl hover:bg-gray-200 transition">
            Contact Support
          </a>
        </div>

      </div>

      <footer className="py-20 text-center text-gray-700 text-[10px] font-mono uppercase tracking-[0.4em]">
        Documentation v1.0 • AgentBoost Global Edge
      </footer>
    </div>
  );
}