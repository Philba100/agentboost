export default function SiteFooter() {
  return (
    <footer className="py-16 bg-[#0f172a] border-t border-slate-800">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-slate-800 rounded flex items-center justify-center">
            <div className="w-2 h-2 border border-[#00ff9d] rotate-45"></div>
          </div>
          <span className="text-sm font-bold tracking-tight text-white">AGENTBOOST</span>
        </div>
        
        <div className="flex gap-8 text-[12px] font-medium text-slate-500">
           <a href="#" className="hover:text-white transition">API Status</a>
           <a href="/docs" className="hover:text-white transition">Documentation</a>
           <a href="#" className="hover:text-white transition">Security</a>
        </div>
        
        <p className="text-slate-600 text-[10px] font-mono">
          &copy; {new Date().getFullYear()} AgentBoost Infrastructure
        </p>
      </div>
    </footer>
  );
}
