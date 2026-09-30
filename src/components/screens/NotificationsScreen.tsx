import React, { useState } from 'react';
import { 
  Bell, 
  Clock, 
  FileText, 
  Send, 
  CheckCircle2, 
  Smartphone, 
  Mail, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { NotificationRule, ChecklistItem } from '../../types/vera';

interface NotificationsScreenProps {
  notifications: NotificationRule[];
  checklist: ChecklistItem[];
  onTriggerTestNudge: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications,
  checklist,
  onTriggerTestNudge,
}) => {
  const [channelPush, setChannelPush] = useState(true);
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelSms, setChannelSms] = useState(true);
  const [nudgeSentToast, setNudgeSentToast] = useState(false);

  const missingItems = checklist.filter((i) => i.status === 'missing');

  const handleSendInstantAlert = () => {
    onTriggerTestNudge();
    setNudgeSentToast(true);
    setTimeout(() => setNudgeSentToast(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E2EE] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5B3E8E] bg-[#F3EEF9] px-2.5 py-0.5 rounded border border-[#5B3E8E]/20">
            Section 7 • Automated Reminders & Alerts
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E2438] mt-2">
            Notification Rules & Reminders
          </h1>
          <p className="text-xs sm:text-sm text-[#6E637B] mt-1">
            Automated alerts tied directly to your missing checklist items and IRS statutory deadlines.
          </p>
        </div>

        <button
          onClick={handleSendInstantAlert}
          className="bg-[#5B3E8E] hover:bg-[#4C3278] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0 shadow-xs"
        >
          <Send className="w-3.5 h-3.5 text-[#C9982F]" />
          <span>Send Test Push/SMS Nudge</span>
        </button>
      </div>

      {nudgeSentToast && (
        <div className="bg-[#EEF8F5] border border-[#4E9C86]/30 text-[#2E2438] p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-[#4E9C86] shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-[#2E2438]">Test Nudge Dispatched Successfully!</p>
            <p className="text-[#6E637B]">
              Simulated SMS & Push notification sent to +1 (415) 892-3401 referencing {missingItems.length} missing documents.
            </p>
          </div>
        </div>
      )}

      {/* Channel Delivery Settings */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E2EE] shadow-sm">
        <h3 className="font-serif text-lg font-bold text-[#2E2438] mb-1">
          Delivery Channels & Frequency
        </h3>
        <p className="text-xs text-[#6E637B] mb-4">
          Choose where you receive critical deadline reminders and preparer notes.
        </p>

        <div className="grid sm:grid-cols-3 gap-3">
          <label className="flex items-center justify-between p-3.5 rounded-xl border border-[#E8E2EE] bg-[#F7F5FA] cursor-pointer">
            <div className="flex items-center gap-2 text-xs">
              <Bell className="w-4 h-4 text-[#5B3E8E]" />
              <span className="font-semibold text-[#2E2438]">In-App Push</span>
            </div>
            <input
              type="checkbox"
              checked={channelPush}
              onChange={(e) => setChannelPush(e.target.checked)}
              className="text-[#5B3E8E] rounded focus:ring-[#5B3E8E]"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl border border-[#E8E2EE] bg-[#F7F5FA] cursor-pointer">
            <div className="flex items-center gap-2 text-xs">
              <Mail className="w-4 h-4 text-[#5B3E8E]" />
              <span className="font-semibold text-[#2E2438]">Email Digest</span>
            </div>
            <input
              type="checkbox"
              checked={channelEmail}
              onChange={(e) => setChannelEmail(e.target.checked)}
              className="text-[#5B3E8E] rounded focus:ring-[#5B3E8E]"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl border border-[#E8E2EE] bg-[#F7F5FA] cursor-pointer">
            <div className="flex items-center gap-2 text-xs">
              <Smartphone className="w-4 h-4 text-[#5B3E8E]" />
              <span className="font-semibold text-[#2E2438]">SMS Urgent Alerts</span>
            </div>
            <input
              type="checkbox"
              checked={channelSms}
              onChange={(e) => setChannelSms(e.target.checked)}
              className="text-[#5B3E8E] rounded focus:ring-[#5B3E8E]"
            />
          </label>
        </div>
      </div>

      {/* Active Rules List */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E2EE] shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#2E2438]">
          Scheduled Automated Reminders
        </h3>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-4 rounded-xl border border-[#E8E2EE] bg-[#F7F5FA] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white border border-[#E8E2EE] text-[#5B3E8E] shrink-0 mt-0.5">
                  {n.type === 'deadline_alert' ? (
                    <Clock className="w-4 h-4 text-[#C9982F]" />
                  ) : n.type === 'missing_document_nudge' ? (
                    <FileText className="w-4 h-4 text-[#5B3E8E]" />
                  ) : (
                    <Bell className="w-4 h-4 text-[#4E9C86]" />
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-xs text-[#2E2438]">{n.title}</h4>
                  <p className="text-xs text-[#6E637B] mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-[#5B3E8E] font-medium mt-1">{n.triggerDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  n.status === 'sent'
                    ? 'bg-[#EEF8F5] text-[#4E9C86] border border-[#4E9C86]/20'
                    : 'bg-[#FDF9F0] text-[#B48523] border border-[#C9982F]/30'
                }`}>
                  {n.status === 'sent' ? 'Active / Sent' : 'Scheduled'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
