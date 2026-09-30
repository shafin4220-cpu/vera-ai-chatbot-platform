import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Building2, 
  FileCheck2, 
  ArrowRight, 
  ShieldCheck, 
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { PracticeMgmtStatus } from '../../types/vera';

interface FilingStatusTrackerScreenProps {
  practiceStatus: PracticeMgmtStatus;
  isSyncing: boolean;
  onRefreshPractice: () => void;
  onNavigateToScreen: (screenId: number) => void;
}

export const FilingStatusTrackerScreen: React.FC<FilingStatusTrackerScreenProps> = ({
  practiceStatus,
  isSyncing,
  onRefreshPractice,
  onNavigateToScreen,
}) => {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E2EE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5B3E8E] bg-[#F3EEF9] px-2.5 py-0.5 rounded border border-[#5B3E8E]/20">
            Section 6 • Practice-Management Live Pull
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E2438] mt-2">
            Filing Status Tracker
          </h1>
          <p className="text-xs sm:text-sm text-[#6E637B] mt-1">
            Authoritative filing progress pulled live from <strong>{practiceStatus.systemProvider}</strong>.
          </p>
        </div>

        <button
          onClick={onRefreshPractice}
          disabled={isSyncing}
          className="bg-[#F7F5FA] hover:bg-[#EAE1F4] text-[#5B3E8E] text-xs font-semibold px-4 py-2.5 rounded-xl border border-[#E8E2EE] transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#4E9C86]' : ''}`} />
          <span>{isSyncing ? 'Querying Practice API...' : 'Pull Live Status'}</span>
        </button>
      </div>

      {/* Main Stepper Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E2EE] shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E2EE] pb-4">
          <div>
            <p className="text-xs text-[#6E637B]">Return Classification</p>
            <h3 className="font-serif text-lg font-bold text-[#2E2438]">
              {practiceStatus.returnType}
            </h3>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-[#6E637B]">IRS MeF Tracking ID</p>
            <code className="text-xs font-mono text-[#5B3E8E] font-semibold">
              {practiceStatus.irsSubmissionId || 'PENDING_TRANSMISSION'}
            </code>
          </div>
        </div>

        {/* 4-Step Pipeline Vertical / Horizontal */}
        <div className="relative border-l-2 border-[#E8E2EE] ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8">
          {practiceStatus.milestones.map((milestone, idx) => {
            return (
              <div key={milestone.id} className="relative group">
                {/* Step Marker on line */}
                <div
                  className={`absolute -left-[37px] sm:-left-[45px] top-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-colors ${
                    milestone.completed
                      ? 'bg-[#4E9C86] text-white'
                      : milestone.current
                      ? 'bg-[#C9982F] text-[#2E2438] ring-4 ring-[#FDF9F0]'
                      : 'bg-gray-100 text-gray-500 border border-gray-300'
                  }`}
                >
                  {milestone.completed ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span>0{idx + 1}</span>
                  )}
                </div>

                <div className={`p-5 rounded-2xl border transition-all ${
                  milestone.completed
                    ? 'bg-[#EEF8F5] border-[#4E9C86]/30'
                    : milestone.current
                    ? 'bg-[#FDF9F0] border-[#C9982F]/40 shadow-xs'
                    : 'bg-[#F7F5FA] border-[#E8E2EE]'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-base text-[#2E2438]">
                        {milestone.title}
                      </h4>
                      {milestone.completed && (
                        <span className="text-[10px] font-bold uppercase bg-[#4E9C86] text-white px-2 py-0.5 rounded">
                          Completed
                        </span>
                      )}
                      {milestone.current && (
                        <span className="text-[10px] font-bold uppercase bg-[#C9982F] text-[#2E2438] px-2 py-0.5 rounded">
                          In Progress
                        </span>
                      )}
                    </div>

                    {milestone.completedAt && (
                      <span className="text-xs text-[#6E637B]">
                        {new Date(milestone.completedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#6E637B] mt-1.5 leading-relaxed">
                    {milestone.description}
                  </p>

                  {milestone.details && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-[#E8E2EE] text-xs text-[#2E2438] font-medium flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#5B3E8E] shrink-0 mt-0.5" />
                      <span>{milestone.details}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Refund / Liability Estimate Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E2EE] shadow-sm grid sm:grid-cols-2 gap-4">
        <div className="p-4 bg-[#F7F5FA] rounded-xl border border-[#E8E2EE]">
          <span className="text-xs text-[#6E637B] uppercase font-bold tracking-wider">
            Estimated Federal 1040 Refund
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-serif text-3xl font-bold text-[#4E9C86]">
              ${practiceStatus.estimatedFederalRefund?.toLocaleString() || '2,840'}
            </span>
            <span className="text-xs text-[#6E637B]">Direct Deposit</span>
          </div>
          <p className="text-[11px] text-[#6E637B] mt-1">
            Subject to final review of pending Form 1098 deduction election.
          </p>
        </div>

        <div className="p-4 bg-[#F7F5FA] rounded-xl border border-[#E8E2EE]">
          <span className="text-xs text-[#6E637B] uppercase font-bold tracking-wider">
            Estimated California State Refund
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-serif text-3xl font-bold text-[#4E9C86]">
              ${practiceStatus.estimatedStateRefund?.toLocaleString() || '620'}
            </span>
            <span className="text-xs text-[#6E637B]">CA Franchise Tax Board</span>
          </div>
          <p className="text-[11px] text-[#6E637B] mt-1">
            Calculated under standard California Schedule CA (540).
          </p>
        </div>
      </div>
    </div>
  );
};
