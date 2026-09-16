"use client";

import { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { processAutonomousTender, TenderRequirements, TenderEvaluation } from '@/lib/pipelines/tenderPipeline';
import DocumentPreviewModal from '../components/DocumentPreviewModal';

export default function TenderCommandRoom() {
  const [rfqId, setRfqId] = useState('TENDER-2026-DXB-551');
  const [client, setClient] = useState('Municipal Infrastructure Authority');
  const [scope, setScope] = useState('Enterprise Cloud Migration, Deterministic Tooling & 24/7 SLA');
  const [budgetCeiling, setBudgetCeiling] = useState('220000');
  const [costBasis, setCostBasis] = useState('75000');
  const [deliveryWeeks, setDeliveryWeeks] = useState('8');

  const [evaluation, setEvaluation] = useState<TenderEvaluation | null>(null);
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);

  const handleRunTenderIntake = () => {
    const tenderInput: TenderRequirements = {
      rfq_id: rfqId,
      client_organization: client,
      scope_summary: scope,
      submission_deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      budget_ceiling_usd: Number(budgetCeiling) || 200000,
      mandatory_criteria: [
        '99.95% Deterministic Availability SLA',
        'SOC-2 Type II & ISO-27001 Certification',
        '5% Bank Tender Performance Bond Guarantee',
        'On-Premise / Hybrid Deployment Clearance'
      ],
      bond_required_percent: 5,
      delivery_timeline_weeks: Number(deliveryWeeks) || 8
    };

    const result = processAutonomousTender(tenderInput, Number(costBasis) || 75000);
    setEvaluation(result);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] font-sans antialiased selection:bg-[#00ff9d] selection:text-[#0f172a]">
      <SiteHeader />

      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00ff9d]/30 bg-[#00ff9d]/10 text-[10px] font-mono uppercase tracking-widest text-[#00ff9d] mb-3">
              Autonomous Revenue Acquisition
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Tender &amp; RFQ Command Room</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl font-light">
              Ingest client tender documents, evaluate compliance matrices, calculate win-probability pricing tiers, and generate formal bid proposals in seconds.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="px-4 py-2 bg-[#1e293b] hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 text-xs font-mono transition"
          >
            ← Back to Workspace
          </Link>
        </div>

        {/* 2-Column Workflow Layout */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Column 1: Tender Specifications */}
          <div className="lg:col-span-5 bg-[#1e293b] border border-slate-700 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              1. Tender Specifications
            </h2>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Tender / RFQ Reference:</label>
              <input
                type="text"
                value={rfqId}
                onChange={(e) => setRfqId(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00ff9d]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Client Authority:</label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00ff9d]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Scope of Work Summary:</label>
              <textarea
                rows={3}
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#00ff9d] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Budget Ceiling ($):</label>
                <input
                  type="number"
                  value={budgetCeiling}
                  onChange={(e) => setBudgetCeiling(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00ff9d]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Internal Cost Basis ($):</label>
                <input
                  type="number"
                  value={costBasis}
                  onChange={(e) => setCostBasis(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00ff9d]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Delivery Timeframe (Weeks):</label>
              <input
                type="number"
                value={deliveryWeeks}
                onChange={(e) => setDeliveryWeeks(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00ff9d]"
              />
            </div>

            <button
              onClick={handleRunTenderIntake}
              style={{ color: '#0f172a' }}
              className="w-full py-3 bg-[#00ff9d] hover:bg-emerald-300 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-[0_0_20px_rgba(0,255,157,0.2)] cursor-pointer mt-2 !text-[#0f172a]"
            >
              Analyze Tender &amp; Synthesize Bid ⚡
            </button>
          </div>

          {/* Column 2: Autonomous Evaluation & Pricing */}
          <div className="lg:col-span-7 space-y-6">
            {evaluation ? (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Decision Banner */}
                <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-5 flex justify-between items-center shadow-xl">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                      Recommendation
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      {evaluation.go_no_go_recommendation === 'SUBMIT_BID'
                        ? '✅ PROCEED TO SUBMIT BID'
                        : '⚠️ QUALIFIED REVIEW NEEDED'}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Fit Score</span>
                    <p className="text-2xl font-black text-[#00ff9d]">{evaluation.fit_score}/100</p>
                  </div>
                </div>

                {/* 3 Pricing Tiers */}
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-[#1e293b] border border-slate-700 space-y-1">
                    <span className="text-[10px] font-mono text-blue-400 uppercase">Aggressive Win</span>
                    <p className="text-lg font-black text-white">
                      ${evaluation.bid_pricing_tiers.aggressive_win_bias.price_usd.toLocaleString()}
                    </p>
                    <div className="text-[10px] font-mono text-slate-400 space-y-0.5 pt-1">
                      <p>Margin: {evaluation.bid_pricing_tiers.aggressive_win_bias.projected_margin}</p>
                      <p className="text-emerald-400">
                        Win Prob: {evaluation.bid_pricing_tiers.aggressive_win_bias.win_probability}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#1e293b] border border-[#00ff9d]/40 space-y-1 shadow-[0_0_15px_rgba(0,255,157,0.1)]">
                    <span className="text-[10px] font-mono text-[#00ff9d] font-bold uppercase">
                      Balanced (Recommended)
                    </span>
                    <p className="text-lg font-black text-white">
                      ${evaluation.bid_pricing_tiers.balanced_optimal.price_usd.toLocaleString()}
                    </p>
                    <div className="text-[10px] font-mono text-slate-400 space-y-0.5 pt-1">
                      <p>Margin: {evaluation.bid_pricing_tiers.balanced_optimal.projected_margin}</p>
                      <p className="text-[#00ff9d]">
                        Win Prob: {evaluation.bid_pricing_tiers.balanced_optimal.win_probability}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#1e293b] border border-slate-700 space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">Premium Margin</span>
                    <p className="text-lg font-black text-white">
                      ${evaluation.bid_pricing_tiers.premium_margin.price_usd.toLocaleString()}
                    </p>
                    <div className="text-[10px] font-mono text-slate-400 space-y-0.5 pt-1">
                      <p>Margin: {evaluation.bid_pricing_tiers.premium_margin.projected_margin}</p>
                      <p className="text-slate-400">
                        Win Prob: {evaluation.bid_pricing_tiers.premium_margin.win_probability}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Compliance Checklist */}
                <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-5 space-y-3 shadow-xl">
                  <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                    Mandatory Compliance Checkpoints
                  </h3>
                  <div className="space-y-1.5">
                    {evaluation.compliance_matrix.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#0f172a] border border-slate-700 text-xs"
                      >
                        <span className="text-slate-300 font-light">{item.criterion}</span>
                        <span className="text-[10px] font-mono text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-0.5 rounded font-bold">
                          ✓ {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proposal Export CTA */}
                <div className="p-5 rounded-2xl bg-[#1e293b] border border-[#00ff9d]/30 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
                  <div>
                    <h4 className="font-bold text-white text-sm">Official Proposal Generated</h4>
                    <p className="text-xs text-slate-300 font-light mt-0.5">
                      Ready for executive sign-off, client submission, and CRM sync.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreviewDoc(evaluation.proposal_document)}
                    style={{ color: '#0f172a' }}
                    className="px-5 py-2.5 bg-[#00ff9d] hover:bg-emerald-300 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer !text-[#0f172a] shrink-0"
                  >
                    Inspect Document &amp; Export →
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-12 text-center text-slate-500 space-y-3 shadow-xl">
                <span className="text-4xl block">📋</span>
                <p className="text-sm">No tender analyzed yet.</p>
                <p className="text-xs max-w-sm mx-auto font-light">
                  Input tender details on the left and click &quot;Analyze Tender &amp; Synthesize Bid&quot; to formulate compliance matrices and pricing tiers.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Document Modal */}
      {previewDoc && (
        <DocumentPreviewModal
          document={previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}

      <SiteFooter />
    </div>
  );
}