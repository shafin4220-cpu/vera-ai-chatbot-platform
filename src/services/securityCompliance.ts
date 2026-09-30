/**
 * SECURITY & COMPLIANCE SPECIFICATION (Mapped to Concrete Implementation Tasks)
 * Ref: IRS Publication 4557 (Safeguarding Taxpayer Data) & FTC Safeguards Rule (16 CFR Part 314)
 */

export interface SecurityTask {
  id: string;
  requirement: string;
  regulatoryAuthority: 'IRS Pub 4557' | 'FTC Safeguards (GLBA)' | 'IRC § 7216' | 'NIST 800-53' | 'SOC 2 Type II';
  concreteImplementation: string;
  technicalVerification: string;
  status: 'enforced' | 'verified' | 'in_progress';
}

export const VERA_SECURITY_CHECKLIST: SecurityTask[] = [
  {
    id: 'SEC-01',
    requirement: 'Data Encryption at Rest (Client PII, SSN, 1040s, W-2s)',
    regulatoryAuthority: 'IRS Pub 4557',
    concreteImplementation: 'AES-256-GCM envelope encryption with AWS KMS/Google Cloud KMS customer-managed keys (CMEK). Document blobs encrypted before persistent disk write.',
    technicalVerification: 'File storage metadata verified with SHA-256 checksum and AES-256-GCM cipher header.',
    status: 'enforced',
  },
  {
    id: 'SEC-02',
    requirement: 'Data Encryption in Transit',
    regulatoryAuthority: 'FTC Safeguards (GLBA)',
    concreteImplementation: 'TLS 1.3 enforced across all HTTPS/REST endpoints with HSTS (Strict-Transport-Security: max-age=31536000; includeSubDomains; preload). Older cipher suites disabled.',
    technicalVerification: 'Qualys SSL Labs A+ profile; HTTP connections auto-redirected with 301.',
    status: 'enforced',
  },
  {
    id: 'SEC-03',
    requirement: 'Mandatory Multi-Factor Authentication (MFA)',
    regulatoryAuthority: 'IRS Pub 4557',
    concreteImplementation: 'Time-based One-Time Password (TOTP via Authenticator apps) or encrypted SMS token required on every new device session. Single password auth strictly blocked.',
    technicalVerification: 'Session tokens require "mfa_verified: true" claim to access document/status endpoints.',
    status: 'enforced',
  },
  {
    id: 'SEC-04',
    requirement: 'IRC § 7216 Consent to Disclose / Use Tax Return Information',
    regulatoryAuthority: 'IRC § 7216',
    concreteImplementation: 'In-app mandatory e-signature modal capturing client consent prior to processing tax return documents with AI assistance and firm review.',
    technicalVerification: 'Immutable cryptographic timestamp and SHA-256 signature record archived in audit ledger.',
    status: 'enforced',
  },
  {
    id: 'SEC-05',
    requirement: 'Role-Based Access Control (RBAC) & Scope Segregation',
    regulatoryAuthority: 'FTC Safeguards (GLBA)',
    concreteImplementation: 'Client token only has read/write scope to their own client_id document store. Firm staff access is explicitly scoped to assigned client rosters.',
    technicalVerification: 'Row-level and object-level authorization tests assert 403 Forbidden on cross-tenant requests.',
    status: 'enforced',
  },
  {
    id: 'SEC-06',
    requirement: 'Full Immutable Audit Trail for Taxpayer Record Access',
    regulatoryAuthority: 'IRS Pub 4557',
    concreteImplementation: 'Append-only audit log recording every document view, upload, preparer status shift, and export with hashed IP and client timestamp.',
    technicalVerification: 'Audit log entries verifiable via cryptographic block chain / tamper-evident log stream.',
    status: 'enforced',
  },
  {
    id: 'SEC-07',
    requirement: 'Client-Facing Data Retention & Right-to-Erasure Workflow',
    regulatoryAuthority: 'NIST 800-53',
    concreteImplementation: 'One-click "Download Encrypted Archive" and "Request Document Purge" in Settings with automated 30-day compliance hold notice for tax records.',
    technicalVerification: 'Purge workflow issues cryptographic certificate of erasure for non-statutory documents.',
    status: 'enforced',
  },
  {
    id: 'SEC-08',
    requirement: 'Zero-Retention Model Policy (No AI Model Training on PII)',
    regulatoryAuthority: 'FTC Safeguards (GLBA)',
    concreteImplementation: 'Enterprise Gemini API integration with zero data-logging, zero customer data retention for model fine-tuning, and client PII scrubbing prior to LLM query.',
    technicalVerification: 'Commercial API terms confirm zero model training; payload scrubbers redact full 9-digit SSNs.',
    status: 'enforced',
  },
  {
    id: 'SEC-09',
    requirement: 'Inactivity Session Timeout (15-Minute Rule)',
    regulatoryAuthority: 'IRS Pub 4557',
    concreteImplementation: 'Client session automatically locks after 15 minutes of zero user interaction, requiring biometric or 6-digit PIN re-authentication.',
    technicalVerification: 'Client-side idle event listener + server JWT short expiration (900 seconds) with refresh rotation.',
    status: 'enforced',
  },
];
