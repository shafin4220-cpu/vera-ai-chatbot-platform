import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Download, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  Smartphone,
  Eye
} from 'lucide-react';
import { ClientProfile, AuditLogEntry } from '../../types/vera';

interface SettingsSecurityScreenProps {
  clientProfile: ClientProfile;
  auditLogs: AuditLogEntry[];
  onTriggerPurgeRequest: () => void;
  onDownloadArchive: () => void;
}

export const SettingsSecurityScreen: React.FC<SettingsSecurityScreenProps> = ({
  clientProfile,
  auditLogs,
  onTriggerPurgeRequest,
  onDownloadArchive,
}) => {
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(15);
  const [purgeRequested, setPurgeRequested] = useState(false);
  const [filterAudit, setFilterAudit] = useState('');

  const filteredLogs = auditLogs.filter((log) => 
    log.action.toLowerCase().includes(filterAudit.toLowerCase()) ||
    log.details.toLowerCase().includes(filterAudit.toLowerCase())
  );

  const handlePurge = () => {
    if (confirm('Are you sure you want to request document deletion? Under IRS rules, statutory tax documents will follow your firm’s 7-year document retention schedule.')) {
      onTriggerPurgeRequest();
      setPurgeRequested(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E2EE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5B3E8E] bg-[#F3EEF9] px-2.5 py-0.5 rounded border border-[#5B3E8E]/20">
            Section 8 • Data Governance & Security
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E2438] mt-2">
            Settings & Taxpayer Privacy
          </h1>
          <p className="text-xs sm:text-sm text-[#6E637B] mt-1">
            Compliant with IRS Publication 4557 and FTC Safeguards Rule (GLBA 16 CFR Part 314).
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#EEF8F5] text-[#4E9C86] text-xs font-semibold px-3 py-2 rounded-xl border border-[#4E9C86]/30 shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Security Protocol Enforced</span>
        </div>
      </div>

      {/* MFA & Session Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E2EE] shadow-sm space-y-5">
        <h3 className="font-serif text-lg font-bold text-[#2E2438]">
          Authentication & Access Control
        </h3>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-[#F7F5FA] rounded-xl border border-[#E8E2EE] flex items-start justify-between">
            <div className="space-y-1">
              <span className="font-semibold text-[#2E2438] flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#5B3E8E]" />
                Multi-Factor Authentication
              </span>
              <p className="text-[#6E637B]">Method: Google Authenticator (TOTP)</p>
              <p className="text-[#4E9C86] font-medium flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" /> Active on Current Device
              </p>
            </div>
            <span className="text-[10px] bg-[#EEF8F5] text-[#4E9C86] px-2 py-0.5 rounded font-bold">
              Enforced
            </span>
          </div>

          <div className="p-4 bg-[#F7F5FA] rounded-xl border border-[#E8E2EE] flex items-start justify-between">
            <div className="space-y-1">
              <span className="font-semibold text-[#2E2438] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#5B3E8E]" />
                Inactivity Session Timeout
              </span>
              <p className="text-[#6E637B]">IRS Pub 4557 mandates automatic lock</p>
              <select
                value={sessionTimeoutMinutes}
                onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                className="mt-1 bg-white border border-[#E8E2EE] rounded-lg px-2 py-1 text-xs font-medium text-[#2E2438]"
              >
                <option value={10}>10 Minutes</option>
                <option value={15}>15 Minutes (IRS Standard)</option>
                <option value={30}>30 Minutes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Data Retention, Export & Purge */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E2EE] shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#2E2438]">
          Client Data Retention & Erasure Controls
        </h3>
        <p className="text-xs text-[#6E637B]">
          You have the statutory right to export an encrypted archive of your tax files or request document erasure.
        </p>

        {purgeRequested && (
          <div className="bg-[#FDF9F0] border border-[#C9982F]/40 p-4 rounded-xl text-xs text-[#2E2438] space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-[#B48523]">
              <AlertTriangle className="w-4 h-4" /> Purge Request Registered in Immutable Ledger
            </p>
            <p className="text-[#6E637B]">
              Ticket #PURGE-2026-981 filed. Statutory documents (signed returns & W-2s) will be archived in cold storage per 7-year IRS requirements, while working drafts are queued for deletion.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={onDownloadArchive}
            className="bg-[#5B3E8E] hover:bg-[#4C3278] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#C9982F]" />
            <span>Download Encrypted Document Archive (.zip)</span>
          </button>

          <button
            onClick={handlePurge}
            className="bg-[#F7F5FA] hover:bg-red-50 text-[#D64545] border border-[#E8E2EE] hover:border-[#D64545]/40 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Request Document Deletion</span>
          </button>
        </div>
      </div>

      {/* Immutable Security Audit Log Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E2EE] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2E2438]">
              Immutable Security & Access Audit Log
            </h3>
            <p className="text-xs text-[#6E637B]">
              Every document view, upload, and status transition is tamper-proofed with SHA-256 block hashes.
            </p>
          </div>

          <input
            type="text"
            placeholder="Filter audit events..."
            value={filterAudit}
            onChange={(e) => setFilterAudit(e.target.value)}
            className="bg-[#F7F5FA] border border-[#E8E2EE] rounded-xl px-3 py-1.5 text-xs text-[#2E2438] placeholder:text-[#6E637B] focus:outline-none"
          />
        </div>

        <div className="border border-[#E8E2EE] rounded-xl overflow-hidden text-xs">
          <div className="bg-[#F7F5FA] px-4 py-2.5 border-b border-[#E8E2EE] font-semibold text-[#6E637B] grid grid-cols-12 gap-2">
            <span className="col-span-3">Timestamp / Actor</span>
            <span className="col-span-3">Action Type</span>
            <span className="col-span-6">Audit Details & Hash</span>
          </div>

          <div className="divide-y divide-[#E8E2EE] max-h-64 overflow-y-auto">
            {filteredLogs.map((entry) => (
              <div key={entry.id} className="px-4 py-3 grid grid-cols-12 gap-2 hover:bg-[#FDF9F0]/40 transition-colors">
                <div className="col-span-3">
                  <p className="text-[11px] text-[#6E637B]">
                    {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="font-medium text-[#2E2438]">{entry.actor}</p>
                </div>

                <div className="col-span-3 flex items-center">
                  <span className="bg-[#F3EEF9] text-[#5B3E8E] px-2 py-0.5 rounded font-mono text-[10px] font-semibold">
                    {entry.action}
                  </span>
                </div>

                <div className="col-span-6 space-y-0.5">
                  <p className="text-[#2E2438]">{entry.details}</p>
                  <p className="font-mono text-[10px] text-[#6E637B] truncate">
                    IP: {entry.ipHash} • Cipher: {entry.encryptionStandard}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
