"use client";

import { useState, useEffect } from 'react';
import DesktopHeader from './components/DesktopHeader';
import DesktopSidebar from './components/DesktopSidebar';
import AiChatSection from './components/AiChatSection';
import TendersSection from './components/TendersSection';
import PaperworkSection from './components/PaperworkSection';
import ModelsSettingsSection from './components/ModelsSettingsSection';
import GatewayLogsSection from './components/GatewayLogsSection';
import DocumentPreviewModal from '@/app/components/DocumentPreviewModal';
import { GeneratedDocument } from '@/lib/documents/generator';

export type AuditLog = {
  id: string;
  timestamp: string;
  system: string;
  operation: string;
  status: 'VERIFIED' | 'COMPLIANT' | 'FLAGGED';
};

export default function DesktopWorkstation() {
  const [currentScreen, setCurrentScreen] = useState<'terminal' | 'tenders' | 'paperwork' | 'models' | 'gateway'>('terminal');
  const [activeInferenceSource, setActiveInferenceSource] = useState('In-Process Deterministic Core (Fastpath)');
  const [systemRamGb, setSystemRamGb] = useState(16);
  const [previewDoc, setPreviewDoc] = useState<GeneratedDocument | null>(null);

  // Hardware Profiling
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      const detected = (navigator as any).deviceMemory || 8;
      setSystemRamGb(detected);
    }
  }, []);

  // Shared Enterprise Event Audit Stream
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: '1', timestamp: '15:10:44', system: 'Task Follow-Up Sentinel', operation: 'Project deadline check: 12 days remaining. Milestone verified.', status: 'COMPLIANT' },
    { id: '2', timestamp: '14:48:12', system: 'AP 3-Way Match', operation: 'PO-88412 matched against GRN. Zero variance detected.', status: 'VERIFIED' },
    { id: '3', timestamp: '14:20:05', system: 'Trade LC Auditor', operation: 'LC-2026-DXB-9841 checked. Zero demurrage liability confirmed.', status: 'VERIFIED' },
    { id: '4', timestamp: '13:58:30', system: 'WPS Payroll SIF', operation: 'SIF monthly payroll batch passed pre-flight validation.', status: 'COMPLIANT' }
  ]);

  const pushAuditLog = (system: string, operation: string, status: 'VERIFIED' | 'COMPLIANT' | 'FLAGGED') => {
    const entry: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      system,
      operation,
      status
    };
    setAuditLogs((prev) => [entry, ...prev.slice(0, 14)]);
  };

  return (
    <div className="h-full w-full bg-[#0f172a] text-[#f8fafc] font-sans antialiased flex flex-col overflow-hidden select-none selection:bg-[#00ff9d] selection:text-[#0f172a]">
      {/* 1. Global Navigation Header */}
      <DesktopHeader
        activeInferenceSource={activeInferenceSource}
        setActiveInferenceSource={setActiveInferenceSource}
        daemonActive={true}
        connectedClients={3}
        auditLogs={auditLogs}
      />

      {/* 2. Main Workstation Body */}
      <div className="flex-1 flex overflow-hidden min-h-0 w-full">
        <DesktopSidebar
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          systemRamGb={systemRamGb}
        />

        <main className="flex-1 bg-[#0f172a] overflow-y-auto p-6 lg:p-10 no-scrollbar min-h-0 h-full flex flex-col">
          {currentScreen === 'terminal' && (
            <AiChatSection
              onOpenDocument={(doc) => setPreviewDoc(doc)}
              pushAuditLog={pushAuditLog}
              activeModel={activeInferenceSource}
              onNavigateToSettings={() => setCurrentScreen('models')}
            />
          )}

          {currentScreen === 'tenders' && (
            <TendersSection
              onOpenDocument={(doc) => setPreviewDoc(doc)}
              pushAuditLog={pushAuditLog}
            />
          )}

          {currentScreen === 'paperwork' && (
            <PaperworkSection
              onOpenDocument={(doc) => setPreviewDoc(doc)}
              pushAuditLog={pushAuditLog}
            />
          )}

          {currentScreen === 'models' && (
            <ModelsSettingsSection
              systemRamGb={systemRamGb}
              pushAuditLog={pushAuditLog}
            />
          )}

          {currentScreen === 'gateway' && (
            <GatewayLogsSection
              auditLogs={auditLogs}
              connectedClients={3}
            />
          )}
        </main>
      </div>

      {/* 3. Document Synthesis Preview & Print Modal */}
      {previewDoc && (
        <DocumentPreviewModal
          document={previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </div>
  );
}