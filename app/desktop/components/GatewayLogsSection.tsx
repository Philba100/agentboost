"use client";

type AuditLog = {
  id: string;
  timestamp: string;
  system: string;
  operation: string;
  status: 'VERIFIED' | 'COMPLIANT' | 'FLAGGED';
};

interface GatewayLogsSectionProps {
  auditLogs: AuditLog[];
  connectedClients?: number;
}

export default function GatewayLogsSection({
  auditLogs,
  connectedClients = 3
}: GatewayLogsSectionProps) {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-700/80 pb-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">Gateway &amp; Audit Trail</h2>
        <p className="text-sm text-slate-300 mt-0.5">
          Real-time status of local daemon listening on port 8765 and structured event log history.
        </p>
      </div>

      {/* Status Summary */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase font-bold">Local Daemon Port</span>
          <p className="text-3xl font-bold text-white font-mono">127.0.0.1:8765</p>
          <p className="text-sm text-[#00ff9d]">✓ REST / Webhook Active</p>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase font-bold">Connected AI Hosts</span>
          <p className="text-3xl font-bold text-white font-mono">{connectedClients} Active</p>
          <p className="text-sm text-slate-300">Claude Desktop • Cursor • CRM</p>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase font-bold">Audit Compliance</span>
          <p className="text-3xl font-bold text-emerald-400 font-mono">100% Passed</p>
          <p className="text-sm text-slate-300">Zero data leaks</p>
        </div>
      </div>

      {/* Structured Audit Table with Clean Alignment */}
      <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-700 bg-[#0f172a] flex justify-between items-center">
          <span className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider">
            Recent Enterprise Event Stream
          </span>
          <span className="text-xs font-mono text-slate-400">90-day retention verified</span>
        </div>

        <div className="divide-y divide-slate-700/80 text-sm font-mono">
          {auditLogs.map((log) => (
            <div key={log.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#0f172a]/40 transition">
              <div className="flex items-center gap-6">
                <span className="text-slate-400 text-xs w-20 shrink-0">{log.timestamp}</span>
                <span className="text-white font-semibold min-w-[160px] shrink-0">{log.system}</span>
                <span className="text-slate-300 font-light truncate">{log.operation}</span>
              </div>
              <span className="px-2.5 py-1 rounded text-xs bg-emerald-500/10 text-[#00ff9d] border border-emerald-500/20 font-bold shrink-0">
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}