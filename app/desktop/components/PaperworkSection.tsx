"use client";

import { useState } from 'react';
import { executeSkill } from '@/lib/executor';
import { generateCorporateDocument, GeneratedDocument } from '@/lib/documents/generator';

interface PaperworkSectionProps {
  onOpenDocument: (doc: GeneratedDocument) => void;
  pushAuditLog: (system: string, operation: string, status: 'VERIFIED' | 'COMPLIANT' | 'FLAGGED') => void;
}

export default function PaperworkSection({
  onOpenDocument,
  pushAuditLog
}: PaperworkSectionProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('trade-lc-auditor');
  const [paperworkInput, setPaperworkInput] = useState<Record<string, any>>({
    lc_number: 'LC-2026-DXB-9841',
    lc_amount: 300000,
    invoice_total: 298500,
    tolerance_percent: 5,
    shipment_date: '2026-05-10',
    lc_expiry_date: '2026-05-25',
    bl_date: '2026-05-08',
    po_number: 'PO-88412',
    vendor_name: 'Global Industrial Logistics FZE',
    po_amount: 45000,
    grn_quantity: 100,
    invoice_quantity: 100,
    invoice_amount: 45000,
    entity_name: 'Apex Holdings International LLC',
    authorized_director: 'Tariq Mansoor Al-Hashemi',
    capital_limit_usd: 500000,
    property_name: 'Al-Reem Financial Tower, Commercial Floor 14',
    current_annual_rent: 240000,
    proposed_annual_rent: 250000,
    basic_salary: 12000,
    allowances: 6000,
    years_of_service: 4.5
  });
  const [paperworkResult, setPaperworkResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRunPaperwork = async (engineId: string) => {
    setIsProcessing(true);
    setPaperworkResult(null);

    try {
      const result = await executeSkill(engineId, paperworkInput);
      setPaperworkResult(result.data);

      let doc: GeneratedDocument | null = null;
      if (engineId === 'corporate-governance-bot') {
        doc = generateCorporateDocument('board-resolution', result.data);
      } else if (engineId === 'lease-contract-generator') {
        doc = generateCorporateDocument('lease-agreement', result.data);
      } else if (engineId === 'ap-three-way-match') {
        doc = generateCorporateDocument('three-way-match', result.data);
      } else if (engineId === 'bidding-engine' || engineId === 'trade-lc-auditor') {
        doc = generateCorporateDocument('tender-proposal', result.data);
      }

      if (doc) onOpenDocument(doc);
      pushAuditLog(engineId, `Deterministic execution complete (${result.latency_ms}ms)`, 'VERIFIED');
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-6 select-none">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Corporate Paperwork Desk</h2>
          <p className="text-sm sm:text-base text-slate-300 mt-1 font-light">
            Automated drafting and calculation for Trade LC, 3-Way Match, Board Resolutions, Leases, and WPS Payroll.
          </p>
        </div>
        <button
          onClick={() => handleRunPaperwork(selectedTemplate)}
          disabled={isProcessing}
          style={{ color: '#0f172a' }}
          className="px-6 py-3 bg-[#00ff9d] hover:bg-emerald-300 font-black text-sm uppercase tracking-wider rounded-xl transition !text-[#0f172a] cursor-pointer shadow-[0_0_15px_rgba(0,255,157,0.2)] shrink-0"
        >
          {isProcessing ? 'Executing...' : 'Run Verification & Compile Draft ⚡'}
        </button>
      </div>

      {/* Template Tabs */}
      <div className="grid grid-cols-5 gap-3 select-none">
        {[
          { id: 'trade-lc-auditor', label: 'Trade LC Audit' },
          { id: 'ap-three-way-match', label: '3-Way AP Match' },
          { id: 'corporate-governance-bot', label: 'Board Resolution' },
          { id: 'lease-contract-generator', label: 'Commercial Lease' },
          { id: 'payroll-wps-auditor', label: 'WPS Payroll SIF' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setSelectedTemplate(tab.id);
              setPaperworkResult(null);
            }}
            className={`py-3 rounded-xl text-sm font-semibold transition cursor-pointer text-center ${
              selectedTemplate === tab.id
                ? 'bg-[#00ff9d]/15 border border-[#00ff9d]/50 text-[#00ff9d] shadow-sm'
                : 'bg-[#1e293b] border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Parameter Inputs Area */}
      <div className="bg-[#1e293b] p-7 rounded-2xl border border-slate-700 shadow-xl space-y-3">
        <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300 block">
          Active Parameter Inputs:
        </span>
        <textarea
          rows={8}
          value={JSON.stringify(paperworkInput, null, 2)}
          onChange={(e) => {
            try {
              setPaperworkInput(JSON.parse(e.target.value));
            } catch {
              // Ignore invalid JSON while typing
            }
          }}
          className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-4 font-mono text-sm leading-relaxed text-[#00ff9d] focus:outline-none focus:border-[#00ff9d]"
        />
      </div>

      {/* Output Results Preview */}
      {paperworkResult && (
        <div className="p-7 rounded-2xl bg-[#1e293b] border border-slate-700 space-y-4 animate-in fade-in">
          <div className="flex justify-between items-center text-sm font-mono">
            <span className="text-slate-300 font-bold uppercase">Verification Result:</span>
            <span className="text-[#00ff9d] font-bold">✓ 200 OK (Calculated in-process)</span>
          </div>
          <pre className="bg-[#0b1220] border border-slate-700 rounded-xl p-5 font-mono text-sm leading-relaxed text-[#00ff9d] overflow-x-auto max-h-64 no-scrollbar">
            {JSON.stringify(paperworkResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}