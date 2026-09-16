"use client";

import { useState } from 'react';
import { processAutonomousTender, TenderRequirements, TenderEvaluation } from '@/lib/pipelines/tenderPipeline';
import { GeneratedDocument } from '@/lib/documents/generator';

interface TendersSectionProps {
  onOpenDocument: (doc: GeneratedDocument) => void;
  pushAuditLog: (system: string, operation: string, status: 'VERIFIED' | 'COMPLIANT' | 'FLAGGED') => void;
}

export default function TendersSection({
  onOpenDocument,
  pushAuditLog
}: TendersSectionProps) {
  const [tenderRfq, setTenderRfq] = useState('TENDER-2026-DXB-551');
  const [tenderClient, setTenderClient] = useState('Municipal Infrastructure Authority');
  const [tenderScope, setTenderScope] = useState('Enterprise Cloud Migration, Deterministic Tooling & 24/7 SLA Guarantee');
  const [tenderCeiling, setTenderCeiling] = useState('220000');
  const [tenderCostBasis, setTenderCostBasis] = useState('75000');
  const [tenderWeeks, setTenderWeeks] = useState('8');
  const [tenderEvaluation, setTenderEvaluation] = useState<TenderEvaluation | null>(null);
  const [isEvaluatingTender, setIsEvaluatingTender] = useState(false);

  const handleRunTender = () => {
    setIsEvaluatingTender(true);
    const req: TenderRequirements = {
      rfq_id: tenderRfq,
      client_organization: tenderClient,
      scope_summary: tenderScope,
      submission_deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      budget_ceiling_usd: Number(tenderCeiling) || 200000,
      mandatory_criteria: [
        '99.95% Deterministic Availability SLA',
        'SOC-2 Type II & ISO-27001 Certification',
        '5% Bank Tender Performance Bond Guarantee',
        'On-Premise / Hybrid Deployment Clearance'
      ],
      bond_required_percent: 5,
      delivery_timeline_weeks: Number(tenderWeeks) || 8
    };

    const res = processAutonomousTender(req, Number(tenderCostBasis) || 75000);
    setTenderEvaluation(res);
    setIsEvaluatingTender(false);
    pushAuditLog('Tender Pipeline', `${tenderRfq} evaluated. Fit score: ${res.fit_score}/100`, 'COMPLIANT');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-6 select-none">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Tender &amp; RFQ Command Desk</h2>
          <p className="text-sm sm:text-base text-slate-300 mt-1 font-light">
            Autonomous requirement ingestion, compliance matrix checks, and 3-tier bid calculations.
          </p>
        </div>
        <button
          onClick={handleRunTender}
          disabled={isEvaluatingTender}
          style={{ color: '#0f172a' }}
          className="px-6 py-3 bg-[#00ff9d] hover:bg-emerald-300 font-black text-sm uppercase tracking-wider rounded-xl transition shadow-[0_0_15px_rgba(0,255,157,0.2)] cursor-pointer !text-[#0f172a] shrink-0"
        >
          {isEvaluatingTender ? 'Evaluating Matrix...' : 'Run Tender Intake & Bidding ⚡'}
        </button>
      </div>

      {/* Input Parameters Card */}
      <div className="grid md:grid-cols-2 gap-5 bg-[#1e293b] p-7 rounded-2xl border border-slate-700 shadow-xl">
        <div>
          <label className="block text-sm font-mono text-slate-300 mb-1.5 font-semibold">Tender / RFQ Reference:</label>
          <input
            type="text"
            value={tenderRfq}
            onChange={(e) => setTenderRfq(e.target.value)}
            className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#00ff9d]"
          />
        </div>

        <div>
          <label className="block text-sm font-mono text-slate-300 mb-1.5 font-semibold">Issuing Authority / Client:</label>
          <input
            type="text"
            value={tenderClient}
            onChange={(e) => setTenderClient(e.target.value)}
            className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00ff9d]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-mono text-slate-300 mb-1.5 font-semibold">Scope of Work Specification:</label>
          <textarea
            rows={3}
            value={tenderScope}
            onChange={(e) => setTenderScope(e.target.value)}
            className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3.5 text-sm text-white focus:outline-none focus:border-[#00ff9d] resize-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-sm font-mono text-slate-300 mb-1.5 font-semibold">Budget Ceiling ($ USD):</label>
          <input
            type="number"
            value={tenderCeiling}
            onChange={(e) => setTenderCeiling(e.target.value)}
            className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#00ff9d]"
          />
        </div>

        <div>
          <label className="block text-sm font-mono text-slate-300 mb-1.5 font-semibold">Internal Cost Basis ($ USD):</label>
          <input
            type="number"
            value={tenderCostBasis}
            onChange={(e) => setTenderCostBasis(e.target.value)}
            className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-[#00ff9d]"
          />
        </div>
      </div>

      {/* Tender Evaluation Results */}
      {tenderEvaluation && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 flex justify-between items-center shadow-xl">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Intake Verdict</span>
              <h3 className="text-xl font-bold text-white mt-1">
                {tenderEvaluation.go_no_go_recommendation === 'SUBMIT_BID'
                  ? '✅ QUALIFIED: PROCEED TO SUBMIT BID'
                  : '⚠️ QUALIFIED REVIEW REQUIRED'}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-slate-400 uppercase">Fit Score</span>
              <p className="text-3xl font-black text-[#00ff9d]">{tenderEvaluation.fit_score}/100</p>
            </div>
          </div>

          {/* 3-Tier Bid Matrix */}
          <div className="grid md:grid-cols-3 gap-5">
            <div className="p-5 rounded-xl bg-[#1e293b] border border-slate-700 space-y-2">
              <span className="text-xs font-mono text-blue-400 uppercase font-bold">Aggressive Win</span>
              <p className="text-2xl font-bold text-white">
                ${tenderEvaluation.bid_pricing_tiers.aggressive_win_bias.price_usd.toLocaleString()}
              </p>
              <p className="text-sm text-slate-300">Margin: {tenderEvaluation.bid_pricing_tiers.aggressive_win_bias.projected_margin}</p>
            </div>

            <div className="p-5 rounded-xl bg-[#1e293b] border border-[#00ff9d]/40 space-y-2 shadow-[0_0_15px_rgba(0,255,157,0.1)]">
              <span className="text-xs font-mono text-[#00ff9d] font-bold uppercase">Balanced (Recommended)</span>
              <p className="text-2xl font-bold text-white">
                ${tenderEvaluation.bid_pricing_tiers.balanced_optimal.price_usd.toLocaleString()}
              </p>
              <p className="text-sm text-slate-300">
                Margin: {tenderEvaluation.bid_pricing_tiers.balanced_optimal.projected_margin} | Win Rate: {tenderEvaluation.bid_pricing_tiers.balanced_optimal.win_probability}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#1e293b] border border-slate-700 space-y-2">
              <span className="text-xs font-mono text-cyan-400 uppercase font-bold">Premium Margin</span>
              <p className="text-2xl font-bold text-white">
                ${tenderEvaluation.bid_pricing_tiers.premium_margin.price_usd.toLocaleString()}
              </p>
              <p className="text-sm text-slate-300">Margin: {tenderEvaluation.bid_pricing_tiers.premium_margin.projected_margin}</p>
            </div>
          </div>

          {/* Proposal Synthesis Button */}
          <div className="p-5 rounded-xl bg-[#1e293b] border border-[#00ff9d]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="text-base font-bold text-white">Commercial Proposal Document Synthesized</h4>
              <p className="text-sm text-slate-300 font-light mt-0.5">
                Includes compliance checklist, bond terms, and cryptographic verification hash.
              </p>
            </div>
            <button
              onClick={() => onOpenDocument(tenderEvaluation.proposal_document)}
              style={{ color: '#0f172a' }}
              className="px-5 py-2.5 bg-[#00ff9d] hover:bg-emerald-300 font-bold text-sm uppercase tracking-wider rounded-lg transition !text-[#0f172a] cursor-pointer shrink-0"
            >
              Inspect &amp; Export Proposal →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}