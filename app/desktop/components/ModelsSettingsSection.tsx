"use client";

import { useState, useMemo, useEffect } from 'react';

interface ModelsSettingsProps {
  systemRamGb: number;
  pushAuditLog: (system: string, operation: string, status: 'VERIFIED' | 'COMPLIANT' | 'FLAGGED') => void;
}

export default function ModelsSettingsSection({
  systemRamGb,
  pushAuditLog
}: ModelsSettingsProps) {
  const [ollamaUrl, setOllamaUrl] = useState('http://127.0.0.1:11434');
  const [ollamaOnline, setOllamaOnline] = useState(false);
  const [lmStudioUrl, setLmStudioUrl] = useState('http://192.168.1.218:1234');
  const [lmStudioOnline, setLmStudioOnline] = useState(false);
  const [detectedLmModel, setDetectedLmModel] = useState<string | null>(null);
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [isPinging, setIsPinging] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLm = localStorage.getItem('agentboost_lmstudio_url');
      const savedOllama = localStorage.getItem('agentboost_ollama_url');
      const savedOpenai = localStorage.getItem('agentboost_openai_key');
      const savedAnthropic = localStorage.getItem('agentboost_anthropic_key');

      if (savedLm) setLmStudioUrl(savedLm);
      if (savedOllama) setOllamaUrl(savedOllama);
      if (savedOpenai) setOpenaiKey(savedOpenai);
      if (savedAnthropic) setAnthropicKey(savedAnthropic);
    }
  }, []);

  const checkConnections = async () => {
    setIsPinging(true);
    try {
      // Ping LM Studio via server bridge
      const res = await fetch('/api/lmstudio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ping',
          targetUrl: lmStudioUrl.trim()
        })
      });

      const data = await res.json();
      if (data.online) {
        setLmStudioOnline(true);
        setDetectedLmModel(data.model);
        pushAuditLog('LM Studio Bridge', `Connected to ${data.model} on ${lmStudioUrl}`, 'VERIFIED');
      } else {
        setLmStudioOnline(false);
        setDetectedLmModel(null);
      }
    } catch {
      setLmStudioOnline(false);
      setDetectedLmModel(null);
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    checkConnections();
    const interval = setInterval(checkConnections, 8000);
    return () => clearInterval(interval);
  }, [lmStudioUrl]);

  const saveSettings = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('agentboost_lmstudio_url', lmStudioUrl.trim());
      localStorage.setItem('agentboost_ollama_url', ollamaUrl.trim());
      localStorage.setItem('agentboost_openai_key', openaiKey.trim());
      localStorage.setItem('agentboost_anthropic_key', anthropicKey.trim());
      setSaveMessage('✓ Configuration Saved');
      setTimeout(() => setSaveMessage(''), 2500);
      checkConnections();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-700/80 pb-4 flex justify-between items-center select-none">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Local Models &amp; AI Provider Settings
          </h2>
          <p className="text-sm text-slate-300 mt-0.5 font-light">
            Connect local inference runtimes (LM Studio, Ollama) and configure model addresses.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className="text-xs font-mono text-[#00ff9d] font-bold">{saveMessage}</span>
          )}
          <button
            onClick={saveSettings}
            style={{ color: '#0f172a' }}
            className="px-5 py-2.5 bg-[#00ff9d] hover:bg-emerald-300 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-[0_0_15px_rgba(0,255,157,0.2)] !text-[#0f172a]"
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* Local Inference Bridges */}
      <div className="bg-[#1e293b] p-7 rounded-2xl border border-slate-700 space-y-6 shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Local AI Inference Bridges
            </h3>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              Enter your LM Studio address. The server bridge validates connectivity every 8 seconds.
            </p>
          </div>
          <button
            onClick={checkConnections}
            disabled={isPinging}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            {isPinging ? 'Pinging...' : '🔄 Ping Endpoints'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-5 text-xs font-mono">
          {/* 1. LM Studio Server */}
          <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white flex items-center gap-2">
                <span>🤖</span> LM Studio Server
              </span>
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                  lmStudioOnline
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/10 text-red-400 border border-red-500/30'
                }`}
              >
                {lmStudioOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>

            <input
              type="text"
              value={lmStudioUrl}
              onChange={(e) => setLmStudioUrl(e.target.value)}
              placeholder="http://192.168.1.218:1234"
              className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-[#00ff9d]"
            />

            <div className="text-[11px] text-slate-400 space-y-1">
              {detectedLmModel ? (
                <p className="text-[#00ff9d] font-bold truncate">
                  Active Model: {detectedLmModel}
                </p>
              ) : (
                <p className="text-slate-500">
                  Target: <code>http://192.168.1.218:1234</code> or <code>http://127.0.0.1:1234</code>
                </p>
              )}
            </div>
          </div>

          {/* 2. Ollama Daemon */}
          <div className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white flex items-center gap-2">
                <span>🦙</span> Ollama Daemon
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-500">
                OFFLINE
              </span>
            </div>

            <input
              type="text"
              value={ollamaUrl}
              onChange={(e) => setOllamaUrl(e.target.value)}
              placeholder="http://127.0.0.1:11434"
              className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-[#00ff9d]"
            />

            <p className="text-[11px] text-slate-500">Default: <code>http://127.0.0.1:11434</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}