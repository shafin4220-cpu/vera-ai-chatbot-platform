/**
 * COMPREHENSIVE API SPECIFICATION & INTEGRATION GUIDE
 * Documents endpoints, schemas, authentication, and webhooks for the 5 core integrations.
 */

export interface ApiDocEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  category: 'Practice Management' | 'Document & OCR' | 'Calendar Scheduling' | 'Reminders & Push' | 'E-Signature' | 'AI Companion';
  summary: string;
  headers: Record<string, string>;
  requestBody?: string;
  responseBody: string;
  errorCodes: { code: number; description: string }[];
}

export const VERA_API_DOCS: ApiDocEndpoint[] = [
  {
    method: 'GET',
    path: '/api/v1/practice-mgmt/status',
    category: 'Practice Management',
    summary: 'Pulls the authoritative, real-time filing status from the firm software (Drake, Karbon, Canopy, CCH Axcess, UltraTax)',
    headers: {
      Authorization: 'Bearer <client_jwt_mfa_token>',
      'X-Firm-ID': 'sterling-vance-cpa-049',
    },
    responseBody: JSON.stringify({
      status: 'success',
      data: {
        clientId: 'cli_98472',
        taxYear: '2025',
        returnType: 'Form 1040 (Individual)',
        assignedPreparer: {
          name: 'Marcus Vance, CPA',
          title: 'Senior Tax Partner',
          licenseNumber: 'CPA-CA-098231',
        },
        overallStatus: 'in_review',
        milestones: [
          { id: 'documents_received', completed: true, completedAt: '2026-03-01T14:32:00Z' },
          { id: 'in_review', completed: false, current: true, details: 'Preparer reviewing Schedule C and 1098' },
          { id: 'filed', completed: false, current: false },
          { id: 'refund_payment', completed: false, current: false },
        ],
        irsSubmissionId: 'IRS-MEF-2026-981240-X19',
        lastSyncedAt: '2026-03-15T09:20:00Z',
      },
    }, null, 2),
    errorCodes: [
      { code: 401, description: 'Missing or expired MFA session' },
      { code: 403, description: 'Client access not authorized for requested tax file' },
      { code: 503, description: 'Practice management bridge timeout' },
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/documents/upload',
    category: 'Document & OCR',
    summary: 'Receives encrypted document payload, validates MIME, executes OCR classification, and updates checklist %',
    headers: {
      Authorization: 'Bearer <client_jwt_mfa_token>',
      'Content-Type': 'multipart/form-data',
    },
    requestBody: `FormData:
- file: binary (PDF, PNG, JPG, HEIC, max 25MB)
- category: "income" | "deductions" | "business" | "prior_year"
- clientNotes: "2025 W-2 from Apex Technologies"`,
    responseBody: JSON.stringify({
      status: 'success',
      data: {
        documentId: 'doc_w2_9941',
        fileName: '2025_W2_Apex_Technologies.pdf',
        sha256Checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        encryptionStandard: 'AES-256-GCM',
        ocrExtracted: {
          detectedForm: 'W-2 Wage and Tax Statement',
          employer: 'Apex Technologies LLC',
          einMasked: 'XX-XXX4912',
          wagesBox1: '$112,500.00',
          fedTaxWithheldBox2: '$18,400.00',
          confidence: 0.98,
        },
        matchedChecklistItemId: 'w2-primary',
        updatedChecklistCompletion: 75,
        staffNotificationTriggered: true,
      },
    }, null, 2),
    errorCodes: [
      { code: 400, description: 'Unrecognized or unreadable file format' },
      { code: 413, description: 'Payload exceeds 25MB statutory limit' },
      { code: 422, description: 'Malware signature detected in scanning buffer' },
    ],
  },
  {
    method: 'GET',
    path: '/api/v1/calendar/available-slots',
    category: 'Calendar Scheduling',
    summary: 'Pulls open appointment slots from assigned preparer’s calendar (Calendly, Cal.com, or Microsoft 365)',
    headers: {
      Authorization: 'Bearer <client_jwt_mfa_token>',
    },
    responseBody: JSON.stringify({
      status: 'success',
      preparerId: 'prep_marcus_vance',
      timezone: 'America/New_York',
      slots: [
        { slotId: 'slot_101', date: '2026-03-26', time: '10:00 AM', durationMinutes: 20 },
        { slotId: 'slot_102', date: '2026-03-26', time: '02:30 PM', durationMinutes: 20 },
        { slotId: 'slot_103', date: '2026-03-27', time: '11:15 AM', durationMinutes: 30 },
      ],
    }, null, 2),
    errorCodes: [
      { code: 404, description: 'Preparer calendar synchronization offline' },
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/calendar/book',
    category: 'Calendar Scheduling',
    summary: 'Books a confirmed call with Marcus Vance, CPA, generates calendar .ics payload and syncs with chat',
    headers: {
      Authorization: 'Bearer <client_jwt_mfa_token>',
      'Content-Type': 'application/json',
    },
    requestBody: JSON.stringify({
      slotId: 'slot_102',
      date: '2026-03-26',
      time: '02:30 PM',
      topic: 'Schedule C Equipment Depreciation & 1098 Clarification',
      meetingFormat: 'video',
      clientPhone: '+1 (555) 234-5678',
    }, null, 2),
    responseBody: JSON.stringify({
      status: 'success',
      appointmentId: 'apt_778129',
      confirmationCode: 'SV-CAL-2026-88',
      meetingLink: 'https://meet.sterlingvancecpa.com/marcus-vance/apt_778129',
      calendarEventCreated: true,
      icsDataUrl: 'data:text/calendar;charset=utf8,...',
    }, null, 2),
    errorCodes: [
      { code: 409, description: 'Slot already reserved by another client' },
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/reminders/schedule',
    category: 'Reminders & Push',
    summary: 'Schedules automated, respectful nudges tied to missing checklist items before filing deadline',
    headers: {
      Authorization: 'Bearer <client_jwt_mfa_token>',
      'Content-Type': 'application/json',
    },
    requestBody: JSON.stringify({
      clientId: 'cli_98472',
      missingItemIds: ['1098-mortgage', 'charity-receipts'],
      channels: { push: true, email: true, sms: false },
      nudgeFrequency: 'every_3_days',
      criticalDeadline: '2026-04-15T23:59:59Z',
    }, null, 2),
    responseBody: JSON.stringify({
      status: 'success',
      scheduledJobs: [
        { jobId: 'job_441', executeAt: '2026-03-27T13:00:00Z', channel: 'push' },
        { jobId: 'job_442', executeAt: '2026-03-30T13:00:00Z', channel: 'email' },
      ],
    }, null, 2),
    errorCodes: [
      { code: 400, description: 'Invalid channel configuration or missing consent' },
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/esign/engagement-letter',
    category: 'E-Signature',
    summary: 'Captures and cryptographically seals client e-signature on the firm engagement letter & IRC § 7216 consent',
    headers: {
      Authorization: 'Bearer <client_jwt_mfa_token>',
      'Content-Type': 'application/json',
    },
    requestBody: JSON.stringify({
      clientId: 'cli_98472',
      typedSignatureName: 'Elena Rostova',
      signatureBlobUrl: 'data:image/png;base64,iVBORw0KGgo...',
      signerIpAddress: '198.51.100.44',
      agreedClauses: ['scope_of_work', 'fee_structure', 'irc_7216_ai_consent'],
    }, null, 2),
    responseBody: JSON.stringify({
      status: 'success',
      eSignReceipt: {
        certificateId: 'ESIGN-SV-2026-4409',
        timestamp: '2026-03-23T11:20:12Z',
        sha256CertificateHash: '7b54a2a7a4f9104bf702a4501a337583769c0d3a5a415a77073ff1c402128e4e',
        signedPdfUrl: '/api/v1/documents/engagement-letter-signed.pdf',
      },
    }, null, 2),
    errorCodes: [
      { code: 400, description: 'Missing signature consent checkmarks' },
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/gemini/companion-query',
    category: 'AI Companion',
    summary: 'Dispatches client query to server-side Gemini 3.8 Flash model with grounded IRS 2025/2026 prompt and context',
    headers: {
      Authorization: 'Bearer <client_jwt_mfa_token>',
      'Content-Type': 'application/json',
    },
    requestBody: JSON.stringify({
      message: 'Can I deduct the $1,200 home office desk I bought in November?',
      conversationHistory: [],
      clientChecklistState: { total: 4, missing: 1, uploaded: 3 },
    }, null, 2),
    responseBody: JSON.stringify({
      status: 'success',
      answer: 'Under IRS guidelines for tax year 2025, qualifying equipment purchases may be eligible for standard depreciation or immediate expensing under Section 179 / De Minimis Safe Harbor ($2,500 per invoice threshold). However, home office deductions depend strictly on exclusive and regular business use. Let\'s get this to your preparer, Marcus Vance, CPA, to confirm your exact election so it is recorded properly.',
      aiDisclosed: true,
      actionTriggered: 'escalation_card',
      escalationSummary: 'Client inquiring regarding $1,200 home office desk expensing eligibility under Section 179 vs De Minimis Safe Harbor.',
    }, null, 2),
    errorCodes: [
      { code: 500, description: 'Model generation exception' },
    ],
  },
];
