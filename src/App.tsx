/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { HomeDashboard } from './components/screens/HomeDashboard';
import { DocumentChecklistScreen } from './components/screens/DocumentChecklistScreen';
import { CompanionChatScreen } from './components/screens/CompanionChatScreen';
import { BookCallScreen } from './components/screens/BookCallScreen';
import { FilingStatusTrackerScreen } from './components/screens/FilingStatusTrackerScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { SettingsSecurityScreen } from './components/screens/SettingsSecurityScreen';
import { ArchitectureBlueprintModal } from './components/screens/ArchitectureBlueprintModal';
import { 
  INITIAL_CLIENT_PROFILE, 
  INITIAL_CHECKLIST, 
  INITIAL_PRACTICE_MGMT_STATUS, 
  INITIAL_CALENDAR_SLOTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS 
} from './services/mockData';
import { 
  ClientProfile, 
  ChecklistItem, 
  PracticeMgmtStatus, 
  CalendarSlot, 
  NotificationRule, 
  AuditLogEntry, 
  ScheduledAppointment 
} from './types/vera';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<number>(2); // Start at Home Dashboard
  const [clientProfile, setClientProfile] = useState<ClientProfile>(INITIAL_CLIENT_PROFILE);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [practiceStatus, setPracticeStatus] = useState<PracticeMgmtStatus>(INITIAL_PRACTICE_MGMT_STATUS);
  const [availableSlots, setAvailableSlots] = useState<CalendarSlot[]>(INITIAL_CALENDAR_SLOTS);
  const [notifications, setNotifications] = useState<NotificationRule[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);
  const [isSyncingPractice, setIsSyncingPractice] = useState<boolean>(false);
  const [selectedItemIdForUpload, setSelectedItemIdForUpload] = useState<string | null>(null);

  // Synchronize with practice management system (Karbon, Drake, etc.)
  const handleRefreshPractice = () => {
    setIsSyncingPractice(true);
    setTimeout(() => {
      setIsSyncingPractice(false);
      setPracticeStatus((prev) => ({
        ...prev,
        lastSyncedAt: 'Live verified: ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
      // Add audit log
      setAuditLogs((prev) => [
        {
          id: 'log-' + Date.now(),
          timestamp: new Date().toISOString(),
          actor: 'System (Practice Bridge)',
          action: 'PRACTICE_MGMT_SYNC',
          details: `Manual sync completed with ${practiceStatus.systemProvider} API. 4 milestones verified.`,
          ipHash: 'INTERNAL_GATEWAY',
          encryptionStandard: 'AES-256-GCM',
        },
        ...prev,
      ]);
    }, 800);
  };

  // Document upload handler with automatic OCR classification and checklist % update
  const handleUploadDocument = async (itemId: string, fileInfo: File | { name: string; size: string }) => {
    try {
      const fileName = fileInfo.name;
      const fileSize = typeof fileInfo.size === 'number' 
        ? `${(fileInfo.size / (1024 * 1024)).toFixed(1)} MB` 
        : fileInfo.size;

      // Call server OCR endpoint
      const response = await fetch('/api/documents/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, itemId }),
      });
      const resData = await response.json();
      const ocrData = resData.data;

      setChecklist((prev) =>
        prev.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              status: 'uploaded',
              uploadedFileName: fileName,
              uploadedFileSize: fileSize,
              uploadedAt: new Date().toISOString(),
              storageHash: ocrData.storageHash || 'AES256: ' + Math.random().toString(16).substring(2, 10),
              ocrData: {
                documentType: ocrData.documentType,
                issuerName: ocrData.issuerName,
                taxYear: '2025',
                wagesOrAmount: ocrData.wagesOrAmount,
                taxWithheld: ocrData.taxWithheld,
                confidenceScore: 0.99,
              },
            };
          }
          return item;
        })
      );

      // Log in audit trail
      setAuditLogs((prev) => [
        {
          id: 'log-' + Date.now(),
          timestamp: new Date().toISOString(),
          actor: `Client (${clientProfile.fullName})`,
          action: 'DOC_OCR_VERIFICATION',
          details: `Uploaded ${fileName}. Encrypted AES-256-GCM. Matched to ${itemId}.`,
          ipHash: 'SHA256: 7f81b...29',
          encryptionStandard: 'AES-256-GCM',
        },
        ...prev,
      ]);

      // Trigger automatic practice milestone advancement if 80%+ complete
      const uploadedCount = checklist.filter((i) => i.status !== 'missing').length + 1;
      if (uploadedCount >= 8) {
        setPracticeStatus((prev) => ({
          ...prev,
          notesFromPreparer: 'Marcus Vance, CPA received all critical income & mortgage items. Preparing final draft 1040.',
        }));
      }
    } catch (err) {
      console.error('Upload OCR error:', err);
    }
  };

  const handleRemoveDocument = (itemId: string) => {
    setChecklist((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            status: 'missing',
            uploadedFileName: undefined,
            uploadedFileSize: undefined,
            uploadedAt: undefined,
            storageHash: undefined,
            ocrData: undefined,
          };
        }
        return item;
      })
    );
  };

  const handleBookAppointment = (appointment: ScheduledAppointment) => {
    // Remove slot from available slots
    setAvailableSlots((prev) =>
      prev.filter((s) => !(s.date === appointment.date && s.time === appointment.time))
    );

    // Add notification rule
    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        type: 'status_update',
        title: `Confirmed Call with ${appointment.preparerName}`,
        message: `${appointment.topic} scheduled for ${appointment.date} at ${appointment.time}.`,
        triggerDate: `${appointment.date} at ${appointment.time}`,
        channels: { push: true, email: true, sms: true },
        status: 'pending',
      },
      ...prev,
    ]);

    // Add audit log
    setAuditLogs((prev) => [
      {
        id: 'log-' + Date.now(),
        timestamp: new Date().toISOString(),
        actor: `Client (${clientProfile.fullName})`,
        action: 'CALENDAR_APPOINTMENT_RESERVED',
        details: `Reserved slot with Marcus Vance, CPA for "${appointment.topic}". Format: ${appointment.meetingFormat}.`,
        ipHash: 'SHA256: 7f81b...29',
        encryptionStandard: 'AES-256-GCM',
      },
      ...prev,
    ]);
  };

  const handleTriggerUploadModal = (itemId?: string) => {
    if (itemId) {
      setSelectedItemIdForUpload(itemId);
    }
    setActiveScreen(3); // Navigate to Checklist
  };

  return (
    <div className="min-h-screen bg-[#F7F5FA] text-[#2E2438] flex flex-col selection:bg-[#5B3E8E] selection:text-white">
      {/* Top Global Navigation with Section Switcher & Status Badges */}
      <Navbar
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        practiceStatus={practiceStatus}
        checklist={checklist}
        onOpenArchitecture={() => setIsArchitectureModalOpen(true)}
        isSyncingPractice={isSyncingPractice}
        onRefreshPractice={handleRefreshPractice}
      />

      {/* Main Screen Content */}
      <main className="flex-1 pb-16">
        {activeScreen === 1 && (
          <OnboardingScreen
            clientProfile={clientProfile}
            onUpdateProfile={(updated) => setClientProfile((prev) => ({ ...prev, ...updated }))}
            onCompleteOnboarding={() => setActiveScreen(2)}
          />
        )}

        {activeScreen === 2 && (
          <HomeDashboard
            checklist={checklist}
            practiceStatus={practiceStatus}
            onNavigateToScreen={(screenId) => setActiveScreen(screenId)}
            onTriggerUploadModal={handleTriggerUploadModal}
            onRefreshPractice={handleRefreshPractice}
            isSyncingPractice={isSyncingPractice}
          />
        )}

        {activeScreen === 3 && (
          <DocumentChecklistScreen
            checklist={checklist}
            onUploadDocument={handleUploadDocument}
            onRemoveDocument={handleRemoveDocument}
            selectedItemIdForUpload={selectedItemIdForUpload}
            onClearUploadTarget={() => setSelectedItemIdForUpload(null)}
          />
        )}

        {activeScreen === 4 && (
          <CompanionChatScreen
            checklist={checklist}
            practiceStatus={practiceStatus}
            onNavigateToScreen={(screenId) => setActiveScreen(screenId)}
            onTriggerUploadModal={handleTriggerUploadModal}
          />
        )}

        {activeScreen === 5 && (
          <BookCallScreen
            practiceStatus={practiceStatus}
            availableSlots={availableSlots}
            onBookAppointment={handleBookAppointment}
            onNavigateToScreen={(screenId) => setActiveScreen(screenId)}
          />
        )}

        {activeScreen === 6 && (
          <FilingStatusTrackerScreen
            practiceStatus={practiceStatus}
            isSyncing={isSyncingPractice}
            onRefreshPractice={handleRefreshPractice}
            onNavigateToScreen={(screenId) => setActiveScreen(screenId)}
          />
        )}

        {activeScreen === 7 && (
          <NotificationsScreen
            notifications={notifications}
            checklist={checklist}
            onTriggerTestNudge={() => {
              setAuditLogs((prev) => [
                {
                  id: 'log-' + Date.now(),
                  timestamp: new Date().toISOString(),
                  actor: 'System (Notification Dispatcher)',
                  action: 'NUDGE_DISPATCHED',
                  details: 'Test missing-document nudge dispatched via SMS & Push.',
                  ipHash: 'INTERNAL_GATEWAY',
                  encryptionStandard: 'AES-256-GCM',
                },
                ...prev,
              ]);
            }}
          />
        )}

        {activeScreen === 8 && (
          <SettingsSecurityScreen
            clientProfile={clientProfile}
            auditLogs={auditLogs}
            onTriggerPurgeRequest={() => {
              setAuditLogs((prev) => [
                {
                  id: 'log-' + Date.now(),
                  timestamp: new Date().toISOString(),
                  actor: `Client (${clientProfile.fullName})`,
                  action: 'PURGE_REQUEST_LOGGED',
                  details: 'Statutory document purge request registered under ticket #PURGE-2026-981.',
                  ipHash: 'SHA256: 7f81b...29',
                  encryptionStandard: 'AES-256-GCM',
                },
                ...prev,
              ]);
            }}
            onDownloadArchive={() => {
              alert('Downloading Vera client archive: elena_rostova_tax_2025_encrypted.zip');
            }}
          />
        )}
      </main>

      {/* Comprehensive Architectural Blueprint & API Documentation Modal */}
      <ArchitectureBlueprintModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
        practiceStatus={practiceStatus}
        onUpdatePracticeProvider={(provider) => {
          setPracticeStatus((prev) => ({ ...prev, systemProvider: provider }));
        }}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-[#E8E2EE] py-4 text-xs text-[#6E637B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © {new Date().getFullYear()} Sterling & Vance CPAs LLP • Vera™ Client Companion
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              className="hover:text-[#5B3E8E] font-medium cursor-pointer"
            >
              Architectural Blueprint & API Spec
            </button>
            <span>•</span>
            <span>IRC § 7216 & IRS Pub 4557 Certified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
