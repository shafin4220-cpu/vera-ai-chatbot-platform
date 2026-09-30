export type DocumentCategory = 'income' | 'deductions' | 'business' | 'prior_year';

export type DocumentStatus = 'missing' | 'uploaded' | 'verified';

export interface ExtractedOcrData {
  documentType: string;
  issuerName?: string;
  taxYear?: string;
  ein?: string;
  wagesOrAmount?: string;
  taxWithheld?: string;
  confidenceScore: number;
}

export interface ChecklistItem {
  id: string;
  title: string;
  category: DocumentCategory;
  description: string;
  required: boolean;
  status: DocumentStatus;
  uploadedFileName?: string;
  uploadedFileSize?: string;
  uploadedAt?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  storageHash?: string;
  ocrData?: ExtractedOcrData;
}

export type FilingStage = 'documents_received' | 'in_review' | 'filed' | 'refund_payment';

export interface Milestone {
  id: FilingStage;
  title: string;
  shortLabel: string;
  description: string;
  completed: boolean;
  current: boolean;
  completedAt?: string;
  details?: string;
}

export interface PracticeMgmtStatus {
  systemProvider: 'Drake Software' | 'Karbon' | 'Canopy' | 'CCH Axcess' | 'UltraTax CS';
  clientId: string;
  clientName: string;
  assignedPreparer: {
    name: string;
    title: string;
    email: string;
    phone: string;
    licenseNumber: string;
    avatarUrl: string;
  };
  taxYear: string;
  returnType: 'Form 1040 (Individual)' | 'Form 1065 (Partnership)' | 'Form 1120-S (S-Corp)';
  overallStatus: FilingStage;
  milestones: Milestone[];
  irsSubmissionId?: string;
  irsAcceptanceDate?: string;
  estimatedFederalRefund?: number;
  estimatedStateRefund?: number;
  lastSyncedAt: string;
  notesFromPreparer?: string;
}

export interface CalendarSlot {
  id: string;
  preparerId: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM"
  durationMinutes: number;
  available: boolean;
}

export interface ScheduledAppointment {
  id: string;
  preparerName: string;
  date: string;
  time: string;
  topic: string;
  meetingFormat: 'video' | 'phone' | 'in_office';
  notes?: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface NotificationRule {
  id: string;
  type: 'deadline_alert' | 'missing_document_nudge' | 'status_update' | 'preparer_message';
  title: string;
  message: string;
  triggerDate: string;
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  status: 'pending' | 'sent';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  ipHash: string;
  encryptionStandard: 'AES-256-GCM';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isAiDisclosed?: boolean;
  actionCard?: {
    type: 'upload_prompt' | 'status_preview' | 'booking_prompt' | 'escalation_card' | 'reminder_set';
    title: string;
    details?: string;
    data?: any;
  };
  escalationDossier?: {
    summary: string;
    clientQuestion: string;
    missingDocs: string[];
    checklistCompletionRate: number;
    recommendedAction: string;
  };
}

export interface ClientProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  firmName: string;
  firmAddress: string;
  taxYear: string;
  mfaEnabled: boolean;
  mfaMethod: 'sms' | 'authenticator_app';
  eSignedEngagementLetter: boolean;
  eSignedDate?: string;
  eSignedHash?: string;
  section7216ConsentSigned: boolean;
  onboardingStep: number; // 1, 2, 3, or completed (4)
}
