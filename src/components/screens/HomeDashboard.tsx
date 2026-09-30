import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  UploadCloud, 
  AlertCircle, 
  Calendar, 
  MessageSquare, 
  FileCheck2, 
  Phone, 
  Mail, 
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ChecklistItem, PracticeMgmtStatus } from '../../types/vera';

interface HomeDashboardProps {
  checklist: ChecklistItem[];
  practiceStatus: PracticeMgmtStatus;
  onNavigateToScreen: (screenId: number) => void;
  onTriggerUploadModal: (itemId?: string) => void;
  onRefreshPractice: () => void;
  isSyncingPractice: boolean;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  checklist,
  practiceStatus,
  onNavigateToScreen,
  onTriggerUploadModal,
  onRefreshPractice,
  isSyncingPractice,
}) => {
  // Target filing deadline: April 15, 2026
  const deadlineDate = new Date('2026-04-15T23:59:59');
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 23, hours: 14, minutes: 32, seconds: 10 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = deadlineDate.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute checklist stats
  const totalItems = checklist.length;
  const uploadedOrVerified = checklist.filter((i) => i.status !== 'missing').length;
  const completionPercentage = Math.round((uploadedOrVerified / totalItems) * 100);
  const missingItems = checklist.filter((i) => i.status === 'missing');
  const firstMissingItem = missingItems[0] || null;

  // Strict Rule from master prompt:
  // --deadline-red (#D64545) is RESERVED for actual approaching/missed deadline alerts ONLY.
  // We only show deadline-red when days <= 7. Otherwise, we use classic violet/gold/slate.
  const isUrgentDeadline = timeLeft.days <= 7;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-6 sm:space-y-8">
      {/* Hero Welcome & Live Practice Sync Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8E2EE] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5B3E8E] bg-[#F3EEF9] px-2.5 py-0.5 rounded border border-[#5B3E8E]/20">
              Tax Season {practiceStatus.taxYear}
            </span>
            <span className="text-xs text-[#6E637B] flex items-center gap-1">
              • Connected to <strong>{practiceStatus.systemProvider}</strong>
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E2438] mt-1.5">
            Good morning, {practiceStatus.clientName}
          </h1>
          <p className="text-sm text-[#6E637B] mt-1">
            Marcus Vance, CPA is actively reviewing your file. You are <strong>{completionPercentage}% complete</strong> with your intake.
          </p>
        </div>

        {/* Live Practice Sync Action */}
        <div className="flex items-center gap-3 bg-[#F7F5FA] p-3 rounded-xl border border-[#E8E2EE] shrink-0">
          <div className="text-right">
            <p className="text-[11px] text-[#6E637B]">Live Practice Bridge</p>
            <p className="text-xs font-semibold text-[#2E2438]">{practiceStatus.lastSyncedAt}</p>
          </div>
          <button
            onClick={onRefreshPractice}
            disabled={isSyncingPractice}
            className="p-2 bg-white hover:bg-gray-50 border border-[#E8E2EE] rounded-lg text-[#5B3E8E] cursor-pointer shadow-xs transition-colors"
            title="Refresh from firm practice management system"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingPractice ? 'animate-spin text-[#4E9C86]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Countdown + Checklist Completion + Single Next Action */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Countdown Card (Col 4) */}
        <div
          className={`md:col-span-4 rounded-2xl p-6 border shadow-sm flex flex-col justify-between ${
            isUrgentDeadline
              ? 'bg-[#FDF2F2] border-[#D64545]/40 text-[#2E2438]'
              : 'bg-white border-[#E8E2EE] text-[#2E2438]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded flex items-center gap-1.5 ${
                  isUrgentDeadline
                    ? 'bg-[#D64545] text-white font-bold'
                    : 'bg-[#F3EEF9] text-[#5B3E8E]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {isUrgentDeadline ? 'CRITICAL DEADLINE' : 'IRS Statutory Deadline'}
              </span>
              <span className="text-xs text-[#6E637B]">April 15, 2026</span>
            </div>

            <h3 className="font-serif text-xl font-bold mt-4 text-[#2E2438]">
              Form 1040 Filing Due Date
            </h3>
            <p className="text-xs text-[#6E637B] mt-1">
              Time remaining to submit finalized paperwork for timely electronic filing.
            </p>
          </div>

          {/* Countdown Numbers */}
          <div className="grid grid-cols-4 gap-2 my-6 text-center">
            <div className="bg-[#F7F5FA] p-2.5 rounded-xl border border-[#E8E2EE]">
              <span className={`text-2xl font-bold font-serif ${isUrgentDeadline ? 'text-[#D64545]' : 'text-[#5B3E8E]'}`}>
                {timeLeft.days}
              </span>
              <p className="text-[10px] text-[#6E637B] font-medium uppercase mt-0.5">Days</p>
            </div>
            <div className="bg-[#F7F5FA] p-2.5 rounded-xl border border-[#E8E2EE]">
              <span className={`text-2xl font-bold font-serif ${isUrgentDeadline ? 'text-[#D64545]' : 'text-[#5B3E8E]'}`}>
                {timeLeft.hours}
              </span>
              <p className="text-[10px] text-[#6E637B] font-medium uppercase mt-0.5">Hours</p>
            </div>
            <div className="bg-[#F7F5FA] p-2.5 rounded-xl border border-[#E8E2EE]">
              <span className={`text-2xl font-bold font-serif ${isUrgentDeadline ? 'text-[#D64545]' : 'text-[#5B3E8E]'}`}>
                {timeLeft.minutes}
              </span>
              <p className="text-[10px] text-[#6E637B] font-medium uppercase mt-0.5">Mins</p>
            </div>
            <div className="bg-[#F7F5FA] p-2.5 rounded-xl border border-[#E8E2EE]">
              <span className={`text-2xl font-bold font-serif ${isUrgentDeadline ? 'text-[#D64545]' : 'text-[#5B3E8E]'}`}>
                {timeLeft.seconds}
              </span>
              <p className="text-[10px] text-[#6E637B] font-medium uppercase mt-0.5">Secs</p>
            </div>
          </div>

          <div className="text-xs text-[#6E637B] flex items-center justify-between pt-2 border-t border-[#E8E2EE]">
            <span>Extension Form 4868:</span>
            <span className="font-semibold text-[#2E2438]">Available until April 15</span>
          </div>
        </div>

        {/* Checklist Completion % (Col 4) */}
        <div className="md:col-span-4 bg-white rounded-2xl p-6 border border-[#E8E2EE] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5B3E8E] bg-[#F3EEF9] px-2.5 py-0.5 rounded">
                Intake Progress
              </span>
              <button
                onClick={() => onNavigateToScreen(3)}
                className="text-xs text-[#5B3E8E] hover:underline font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({totalItems})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <h3 className="font-serif text-xl font-bold mt-4 text-[#2E2438]">
              Document Checklist
            </h3>
            <p className="text-xs text-[#6E637B] mt-1">
              Personalized for your 1040 and freelance Schedule C advisory income.
            </p>
          </div>

          {/* Meter / Ring */}
          <div className="my-4 flex items-center gap-5">
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#E8E2EE]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#4E9C86]"
                  strokeDasharray={`${completionPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="font-serif text-xl font-bold text-[#2E2438]">
                  {completionPercentage}%
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#4E9C86]" />
                <span className="text-[#2E2438] font-medium">
                  {uploadedOrVerified} Uploaded & Verified
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#C9982F]" />
                <span className="text-[#6E637B]">
                  {missingItems.length} Missing / Pending
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToScreen(3)}
            className="w-full bg-[#F3EEF9] hover:bg-[#EAE1F4] text-[#5B3E8E] text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Open Document Checklist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* SINGLE CLEAR NEXT ACTION (Col 4) */}
        <div className="md:col-span-4 bg-gradient-to-br from-[#5B3E8E] to-[#472F70] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
          {/* Subtle gold accent border */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9982F]/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C9982F] bg-white/10 px-2.5 py-0.5 rounded border border-white/15">
                Single Clear Next Action
              </span>
              <span className="text-[10px] text-white/70 font-mono">Priority: High</span>
            </div>

            <h3 className="font-serif text-xl font-bold mt-4 text-white">
              {firstMissingItem ? firstMissingItem.title : 'All Checklist Items Received!'}
            </h3>
            <p className="text-xs text-white/80 mt-1.5 leading-relaxed">
              {firstMissingItem
                ? firstMissingItem.description
                : 'Your documents are fully submitted. Marcus Vance, CPA is completing the draft 1040.'}
            </p>
          </div>

          <div className="my-4 p-3 bg-white/10 rounded-xl border border-white/15 text-xs text-white/90">
            <p className="italic text-[11px] text-white/70">Preparer Note:</p>
            <p className="font-medium mt-0.5">
              "{practiceStatus.notesFromPreparer || 'Please upload the pending item so we can finalize the review.'}"
            </p>
          </div>

          {firstMissingItem ? (
            <button
              onClick={() => onTriggerUploadModal(firstMissingItem.id)}
              className="w-full bg-[#C9982F] hover:bg-[#B48523] text-[#2E2438] text-xs font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-[#2E2438]" />
              <span>Upload {firstMissingItem.title.split(':')[0]}</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigateToScreen(6)}
              className="w-full bg-[#4E9C86] text-white text-xs font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Check Filing Status Tracker</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Status Stepper Summary (Direct Pull from Practice System) */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E2EE] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5B3E8E] bg-[#F3EEF9] px-2.5 py-0.5 rounded">
              Practice Management System Status
            </span>
            <h3 className="font-serif text-lg font-bold text-[#2E2438] mt-1">
              Filing Pipeline Milestone Tracker
            </h3>
          </div>
          <button
            onClick={() => onNavigateToScreen(6)}
            className="text-xs text-[#5B3E8E] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Full Filing Breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4-Step Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {practiceStatus.milestones.map((milestone, idx) => {
            return (
              <div
                key={milestone.id}
                className={`p-4 rounded-xl border transition-all ${
                  milestone.completed
                    ? 'bg-[#EEF8F5] border-[#4E9C86]/30 text-[#2E2438]'
                    : milestone.current
                    ? 'bg-[#FDF9F0] border-[#C9982F]/50 shadow-xs'
                    : 'bg-[#F7F5FA] border-[#E8E2EE] text-[#6E637B]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Step 0{idx + 1}
                  </span>
                  {milestone.completed ? (
                    <span className="text-[10px] bg-[#4E9C86] text-white px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </span>
                  ) : milestone.current ? (
                    <span className="text-[10px] bg-[#C9982F] text-[#2E2438] px-1.5 py-0.5 rounded font-bold">
                      In Progress
                    </span>
                  ) : (
                    <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">
                      Queued
                    </span>
                  )}
                </div>

                <h4 className="font-semibold text-sm text-[#2E2438]">{milestone.shortLabel}</h4>
                <p className="text-xs text-[#6E637B] mt-1 line-clamp-2">{milestone.description}</p>
                {milestone.completedAt && (
                  <p className="text-[10px] text-[#4E9C86] font-medium mt-2">
                    Verified {new Date(milestone.completedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Assigned Preparer + Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Assigned Preparer Card (Col 6) */}
        <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-[#E8E2EE] shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5B3E8E] bg-[#F3EEF9] px-2.5 py-0.5 rounded">
              Your Professional Tax Preparer
            </span>
            <div className="flex items-start gap-4 mt-4">
              <img
                src={practiceStatus.assignedPreparer.avatarUrl}
                alt={practiceStatus.assignedPreparer.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#5B3E8E]/20 shadow-xs"
              />
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2E2438]">
                  {practiceStatus.assignedPreparer.name}
                </h3>
                <p className="text-xs text-[#6E637B]">{practiceStatus.assignedPreparer.title}</p>
                <p className="text-[11px] font-mono text-[#5B3E8E] mt-0.5">
                  CA License: {practiceStatus.assignedPreparer.licenseNumber}
                </p>
                <div className="flex flex-wrap gap-2 mt-2 text-xs text-[#6E637B]">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#5B3E8E]" />
                    {practiceStatus.assignedPreparer.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#5B3E8E]" />
                    {practiceStatus.assignedPreparer.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-[#E8E2EE]">
            <button
              onClick={() => onNavigateToScreen(5)}
              className="bg-[#5B3E8E] hover:bg-[#4C3278] text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C9982F]" />
              <span>Book Calendar Call</span>
            </button>
            <button
              onClick={() => onNavigateToScreen(4)}
              className="bg-[#F7F5FA] hover:bg-[#EAE1F4] text-[#2E2438] text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-2 border border-[#E8E2EE] cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#5B3E8E]" />
              <span>Ask Vera (AI Companion)</span>
            </button>
          </div>
        </div>

        {/* Security & Audit Summary (Col 6) */}
        <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-[#E8E2EE] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#4E9C86] bg-[#EEF8F5] px-2.5 py-0.5 rounded flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4E9C86]" />
                IRS Pub 4557 Audit Active
              </span>
              <button
                onClick={() => onNavigateToScreen(8)}
                className="text-xs text-[#5B3E8E] hover:underline cursor-pointer"
              >
                Security Center
              </button>
            </div>

            <h3 className="font-serif text-lg font-bold text-[#2E2438] mt-3">
              Taxpayer Safeguards & Verification
            </h3>
            <p className="text-xs text-[#6E637B] mt-1">
              Every document uploaded is encrypted with AES-256-GCM. Client data is strictly segregated under GLBA standards.
            </p>

            <div className="space-y-2 mt-4 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F7F5FA] border border-[#E8E2EE]">
                <span className="text-[#6E637B]">Multi-Factor Authentication (MFA):</span>
                <span className="text-[#4E9C86] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Enforced (TOTP App)
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F7F5FA] border border-[#E8E2EE]">
                <span className="text-[#6E637B]">Section 7216 Taxpayer Consent:</span>
                <span className="text-[#4E9C86] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Cryptographically Sealed
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#F7F5FA] border border-[#E8E2EE]">
                <span className="text-[#6E637B]">AI Model Training Policy:</span>
                <span className="text-[#2E2438] font-semibold">
                  Zero Data Retention (Scrubbed PII)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E8E2EE] flex justify-between items-center text-[11px] text-[#6E637B]">
            <span>Session ID: <code className="text-[#5B3E8E]">ses_98f...12</code></span>
            <span>Idle Timeout: 15 mins</span>
          </div>
        </div>
      </div>
    </div>
  );
};
