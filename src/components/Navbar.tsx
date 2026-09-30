import React from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Bell, 
  Settings, 
  Code2, 
  Lock,
  RefreshCw
} from 'lucide-react';
import { PracticeMgmtStatus, ChecklistItem } from '../types/vera';

interface NavbarProps {
  activeScreen: number;
  setActiveScreen: (screen: number) => void;
  practiceStatus: PracticeMgmtStatus;
  checklist: ChecklistItem[];
  onOpenArchitecture: () => void;
  isSyncingPractice: boolean;
  onRefreshPractice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  setActiveScreen,
  practiceStatus,
  checklist,
  onOpenArchitecture,
  isSyncingPractice,
  onRefreshPractice,
}) => {
  const missingCount = checklist.filter((item) => item.status === 'missing').length;

  const navItems = [
    { id: 1, label: 'Onboard & E-Sign', icon: UserCheck },
    { id: 2, label: 'Dashboard', icon: Clock },
    { 
      id: 3, 
      label: 'Document Checklist', 
      icon: FileText,
      badge: missingCount > 0 ? `${missingCount} missing` : undefined,
      badgeUrgent: missingCount > 0,
    },
    { id: 4, label: 'Companion Chat', icon: MessageSquare, aiBadge: true },
    { id: 5, label: 'Book a Call', icon: Calendar },
    { id: 6, label: 'Filing Status', icon: RefreshCw },
    { id: 7, label: 'Notifications', icon: Bell },
    { id: 8, label: 'Settings & Security', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#E8E2EE]">
      {/* Top Authority & Security Bar */}
      <div className="bg-[#2E2438] text-white text-xs px-4 sm:px-6 py-1.5 flex items-center justify-between border-b border-[#3F344F]">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-0.5">
          <span className="flex items-center gap-1.5 text-[#C9982F] font-medium tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9982F]" />
            IRS Pub 4557 & FTC Safeguards Compliant
          </span>
          <span className="hidden md:inline text-white/30">•</span>
          <span className="hidden md:flex items-center gap-1 text-white/80">
            <Lock className="w-3 h-3 text-[#4E9C86]" />
            AES-256 at Rest • TLS 1.3 in Transit
          </span>
          <span className="hidden lg:inline text-white/30">•</span>
          <span className="hidden lg:inline text-white/80">
            Client ID: <code className="text-[#C9982F]">{practiceStatus.clientId}</code>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefreshPractice}
            disabled={isSyncingPractice}
            className="flex items-center gap-1 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Refresh practice management connection"
          >
            <RefreshCw className={`w-3 h-3 text-[#4E9C86] ${isSyncingPractice ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline text-[11px]">
              {isSyncingPractice ? 'Syncing...' : `Bridge: ${practiceStatus.systemProvider}`}
            </span>
          </button>

          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1 bg-[#5B3E8E] hover:bg-[#7353A8] text-white px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer"
          >
            <Code2 className="w-3 h-3 text-[#C9982F]" />
            <span>Blueprint & APIs</span>
          </button>
        </div>
      </div>

      {/* Main Firm Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Mark: 'V' for Veritas & Vera */}
            <div className="w-10 h-10 rounded-xl bg-[#5B3E8E] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md shadow-[#5B3E8E]/20 border border-[#7353A8]">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold tracking-tight text-[#2E2438]">
                  VERA
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#F3EEF9] text-[#5B3E8E] px-2 py-0.5 rounded border border-[#5B3E8E]/20">
                  Client Companion
                </span>
              </div>
              <p className="text-xs text-[#6E637B]">
                Sterling & Vance CPAs LLP • Tax Year {practiceStatus.taxYear}
              </p>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenArchitecture}
              className="p-2 text-[#5B3E8E] hover:bg-[#F3EEF9] rounded-lg border border-[#E8E2EE]"
              aria-label="View technical specifications"
            >
              <Code2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Assigned Preparer & Client Profile Card */}
        <div className="flex items-center gap-3 bg-[#F7F5FA] p-2 rounded-xl border border-[#E8E2EE] text-xs">
          <div className="flex items-center gap-2 pr-3 border-r border-[#E8E2EE]">
            <div className="w-7 h-7 rounded-full bg-[#5B3E8E]/10 border border-[#5B3E8E]/30 flex items-center justify-center font-semibold text-[#5B3E8E]">
              MV
            </div>
            <div>
              <p className="text-[#6E637B] text-[10px]">Assigned Preparer</p>
              <p className="font-semibold text-[#2E2438] leading-tight">
                {practiceStatus.assignedPreparer.name}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[#6E637B] text-[10px]">Client File</p>
            <p className="font-semibold text-[#2E2438] leading-tight">
              {practiceStatus.clientName}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Navigation Rails / Tabs (Sections 1-8) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#5B3E8E] text-white shadow-sm font-semibold'
                    : 'text-[#6E637B] hover:text-[#2E2438] hover:bg-[#F3EEF9]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C9982F]' : 'text-current'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      isActive
                        ? 'bg-[#C9982F] text-[#2E2438]'
                        : 'bg-[#FDF9F0] text-[#B48523] border border-[#C9982F]/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.aiBadge && (
                  <span
                    className={`text-[9px] uppercase tracking-wider px-1 py-0.5 rounded font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#5B3E8E]/10 text-[#5B3E8E]'
                    }`}
                  >
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
