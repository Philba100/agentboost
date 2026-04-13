"use client";

import Link from 'next/link';

export default function SiteHeader() {
  return (
    <nav className="flex justify-between items-center px-6 md:px-12 py-5 border-b border-white/[0.08] sticky top-0 bg-[#0f172a]/80 backdrop-blur-xl z-50">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-gradient-to-br from-[#00ff9d] to-[#00b870] rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.3)]">
           <div className="w-2.5 h-2.5 border border-[#0f172a] rotate-45"></div>
        </div>
        <div className="text-lg font-bold tracking-tight text-white">
          AGENT<span className="font-light text-white/50">BOOST</span>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-8 text-[12px] font-semibold text-white/50 uppercase tracking-[0.15em]">
        <Link href="/protocol" className="hover:text-[#00ff9d] transition-colors">Protocol</Link>
        <Link href="/registry" className="hover:text-[#00ff9d] transition-colors">Registry</Link>
        <Link href="/docs" className="hover:text-[#00ff9d] transition-colors">Docs</Link>
        <div className="h-4 w-[1px] bg-white/20"></div>
        <Link href="/login" className="hover:text-white transition-colors lowercase font-mono tracking-normal">auth.init()</Link>
      </div>
      <div>
        <Link href="/login?next=/dashboard" className="bg-white/5 border border-white/10 text-white px-5 py-2 rounded-md text-[13px] font-semibold transition-all hover:bg-[#00ff9d] hover:text-[#0f172a] hover:border-[#00ff9d] hover:shadow-[0_0_20px_rgba(0,255,157,0.2)]">
          Provision Key
        </Link>
      </div>
    </nav>
  );
}
