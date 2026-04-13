'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function RealEstateDashboard() {
  const searchParams = useSearchParams();
  const address = searchParams.get('address') || 'Sample Property';
  const price = parseInt(searchParams.get('price') || '0');
  const rent = parseInt(searchParams.get('rent') || '0');

  // Logic: (Annual Rent / Price) * 100
  const capRate = price > 0 ? ((rent * 12 / price) * 100).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] p-6 font-sans">
      <div className="border-b-2 border-slate-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold truncate">{address}</h1>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-tight">Investment Analysis Report</p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
          <span className="text-slate-500 text-xs font-bold uppercase">Purchase Price</span>
          <span className="text-2xl font-black text-blue-600">${price.toLocaleString()}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Monthly Rent</span>
            <span className="text-xl font-bold">${rent.toLocaleString()}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Cap Rate</span>
            <span className="text-xl font-bold text-emerald-600">{capRate}%</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
        <h3 className="text-lg font-bold mb-2">Investor Insights</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Based on a purchase price of ${price.toLocaleString()}, this property delivers a yield of {capRate}%. 
          {parseFloat(capRate) > 6 ? " This is considered a strong performing asset." : " This may require further value-add to meet market benchmarks."}
        </p>
      </div>

      <div className="mt-10 p-6 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200 text-center">
        <h4 className="font-bold text-blue-900">Unlock Neighborhood Comps</h4>
        <p className="text-blue-700/70 text-sm mb-4">See what similar properties in this zip code actually sold for.</p>
        <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg">
          Upgrade to Investor Pro ($50/mo)
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading Property Data...</div>}>
      <RealEstateDashboard />
    </Suspense>
  );
}