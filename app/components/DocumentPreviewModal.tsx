"use client";

import { useState } from 'react';
import { GeneratedDocument } from '@/lib/documents/generator';

interface PreviewProps {
  document: GeneratedDocument;
  onClose: () => void;
}

export default function DocumentPreviewModal({ document, onClose }: PreviewProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');

  const copyContent = () => {
    navigator.clipboard.writeText(document.content_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (format: 'md' | 'html') => {
    const isHtml = format === 'html';
    const content = isHtml ? document.content_html : document.content_markdown;
    const mime = isHtml ? 'text/html' : 'text/markdown';
    const filename = isHtml
      ? document.filename.replace(/\.md$/, '.html')
      : document.filename;

    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = filename;
    window.document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/95 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative z-10 bg-[#1e293b] border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700 bg-[#0f172a] flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[#00ff9d] font-mono text-xs font-bold uppercase tracking-wider">
                Official Synthesized Document
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {document.audit_hash}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">{document.title}</h3>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white w-7 h-7 rounded-lg flex items-center justify-center bg-slate-800 hover:bg-slate-700 transition text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* View Toggle Bar */}
        <div className="px-6 py-2.5 border-b border-slate-700/80 bg-[#0f172a]/50 flex justify-between items-center text-xs font-mono">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('formatted')}
              className={`px-3 py-1 rounded transition cursor-pointer ${
                viewMode === 'formatted'
                  ? 'bg-slate-800 text-[#00ff9d] font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Print View
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1 rounded transition cursor-pointer ${
                viewMode === 'raw'
                  ? 'bg-slate-800 text-[#00ff9d] font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Markdown Source
            </button>
          </div>

          <span className="text-[10px] text-slate-400">
            Generated: {document.generated_at.split('T')[0]}
          </span>
        </div>

        {/* Document Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#0b1220] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {viewMode === 'formatted' ? (
            <div
              className="bg-white text-slate-900 p-8 rounded-xl shadow-inner text-xs leading-relaxed max-w-2xl mx-auto font-sans"
              dangerouslySetInnerHTML={{ __html: document.content_html }}
            />
          ) : (
            <pre className="text-[#00ff9d] font-mono text-xs whitespace-pre-wrap leading-relaxed">
              {document.content_markdown}
            </pre>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-700 bg-[#0f172a] flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-[10px] font-mono text-slate-400">
            Cryptographic Audit Stamp: <span className="text-[#00ff9d]">{document.audit_hash}</span>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={copyContent}
              className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition cursor-pointer"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
            <button
              onClick={() => downloadFile('md')}
              className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition cursor-pointer"
            >
              Export .MD
            </button>
            <button
              onClick={() => downloadFile('html')}
              style={{ color: '#0f172a' }}
              className="flex-1 sm:flex-none px-4 py-1.5 bg-[#00ff9d] hover:bg-emerald-300 font-bold rounded-lg text-xs uppercase tracking-wider transition cursor-pointer !text-[#0f172a] shadow-[0_0_12px_rgba(0,255,157,0.25)]"
            >
              Export Print / PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}