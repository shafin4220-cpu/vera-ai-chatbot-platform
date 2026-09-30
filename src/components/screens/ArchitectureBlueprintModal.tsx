import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  ShieldCheck, 
  FileText, 
  Palette, 
  Sliders, 
  Copy, 
  Check, 
  ExternalLink,
  BookOpen,
  Layers,
  Terminal
} from 'lucide-react';
import { VERA_DESIGN_TOKENS } from '../../design-system/tokens';
import { VERA_SYSTEM_PROMPT } from '../../services/systemPrompt';
import { VERA_SECURITY_CHECKLIST } from '../../services/securityCompliance';
import { VERA_API_DOCS } from '../../services/apiDocumentation';
import { PracticeMgmtStatus } from '../../types/vera';

interface ArchitectureBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  practiceStatus: PracticeMgmtStatus;
  onUpdatePracticeProvider: (provider: PracticeMgmtStatus['systemProvider']) => void;
}

export const ArchitectureBlueprintModal: React.FC<ArchitectureBlueprintModalProps> = ({
  isOpen,
  onClose,
  practiceStatus,
  onUpdatePracticeProvider,
}) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'tokens' | 'prompt' | 'security' | 'api' | 'config'>('flow');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  if (!isOpen) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(VERA_SYSTEM_PROMPT);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full h-[88vh] flex flex-col border border-[#E8E2EE] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#2E2438] text-white p-5 flex items-center justify-between border-b border-[#3F344F]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5B3E8E] flex items-center justify-center font-serif text-lg font-bold text-white border border-[#7353A8]">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold">
                  VERA — Architectural Blueprint & Compliance Specifications
                </h2>
                <span className="text-[10px] font-mono bg-[#5B3E8E] text-[#C9982F] px-2 py-0.5 rounded font-semibold">
                  Production Master
                </span>
              </div>
              <p className="text-xs text-white/70">
                End-to-End System Deliverables matching Master Prompt Requirements (1)–(6)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#F7F5FA] border-b border-[#E8E2EE] px-4 flex gap-1 overflow-x-auto scrollbar-none text-xs font-semibold">
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3.5 py-3 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'flow'
                ? 'border-[#5B3E8E] text-[#5B3E8E]'
                : 'border-transparent text-[#6E637B] hover:text-[#2E2438]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>(1) Screen-by-Screen Flow</span>
          </button>

          <button
            onClick={() => setActiveTab('tokens')}
            className={`px-3.5 py-3 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'tokens'
                ? 'border-[#5B3E8E] text-[#5B3E8E]'
                : 'border-transparent text-[#6E637B] hover:text-[#2E2438]'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>(2) Design Tokens</span>
          </button>

          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3.5 py-3 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'prompt'
                ? 'border-[#5B3E8E] text-[#5B3E8E]'
                : 'border-transparent text-[#6E637B] hover:text-[#2E2438]'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>(4) LLM System Prompt</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-3 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'security'
                ? 'border-[#5B3E8E] text-[#5B3E8E]'
                : 'border-transparent text-[#6E637B] hover:text-[#2E2438]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>(5) Security Checklist</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-3.5 py-3 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'api'
                ? 'border-[#5B3E8E] text-[#5B3E8E]'
                : 'border-transparent text-[#6E637B] hover:text-[#2E2438]'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>(6) API Documentation</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`px-3.5 py-3 border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors ${
              activeTab === 'config'
                ? 'border-[#5B3E8E] text-[#5B3E8E]'
                : 'border-transparent text-[#6E637B] hover:text-[#2E2438]'
            }`}
          >
            <Sliders className="w-4 h-4 text-[#C9982F]" />
            <span>Practice Mgmt Settings</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: SCREEN-BY-SCREEN FLOW */}
          {activeTab === 'flow' && (
            <div className="space-y-6 text-xs leading-relaxed text-[#2E2438]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2E2438]">
                  Screen-by-Screen Architectural Flow (Sections 1–8)
                </h3>
                <p className="text-[#6E637B] mt-1">
                  Built on a lean document-and-deadline model where every interaction terminates in a real system event.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    num: '1',
                    title: 'Onboarding & Secure Client Link',
                    purpose: 'Connects client to firm account, e-signs engagement letter & IRC § 7216 consent, activates MFA (3 steps max).',
                    actions: 'Generates immutable SHA-256 e-signature certificate; writes to audit log; unblocks document upload.',
                  },
                  {
                    num: '2',
                    title: 'Home Dashboard (High Fidelity)',
                    purpose: 'Provides live April 15 deadline countdown, checklist completion %, single clear "next action" hero card, and assigned preparer contact.',
                    actions: 'Dynamic urgency meter: --deadline-red strictly reserved for <= 7 days; 1-click CTA directly opens target upload.',
                  },
                  {
                    num: '3',
                    title: 'Document Checklist & Secure Upload (High Fidelity)',
                    purpose: 'Categorized intake (Income, Deductions, Business Schedule C, Prior Year), auto-flags missing items with drag-drop and camera scan.',
                    actions: 'Automated OCR extracts Issuer, EIN, Box 1/2 values; updates checklist % in real time; notifies assigned preparer.',
                  },
                  {
                    num: '4',
                    title: 'Companion Chat (Vera AI)',
                    purpose: 'Plain-language answers grounded in verified IRS 2025/2026 rules; strict AI disclosure; no definitive tax advice boundary.',
                    actions: 'Detects tax advice inquiries; synthesizes structured "Preparer Handoff Dossier" for Marcus Vance, CPA; executes status pulls & booking inline.',
                  },
                  {
                    num: '5',
                    title: 'Book a Call (Real Calendar)',
                    purpose: 'Real calendar reservation with Marcus Vance, CPA; topic selection and Video/Phone/Office format picker.',
                    actions: 'Reserves slot on preparer calendar; downloads RFC-5545 compliant .ics file; generates confirmation code.',
                  },
                  {
                    num: '6',
                    title: 'Filing Status Tracker',
                    purpose: 'Authoritative 4-step stepper (Documents Received -> In Review -> Filed -> Refund/Payment) pulled live from practice management software.',
                    actions: 'Pulls real IRS MeF Submission ID; displays preparer drafting notes and estimated federal/state refund amounts.',
                  },
                  {
                    num: '7',
                    title: 'Notifications & Alerts',
                    purpose: 'Scheduled push/email/SMS alerts tied strictly to missing checklist items and statutory deadlines.',
                    actions: 'Real test nudge dispatch; per-channel delivery toggles; frequency pacing to prevent alert fatigue.',
                  },
                  {
                    num: '8',
                    title: 'Settings & Security',
                    purpose: 'MFA reconfiguration, IRS Pub 4557 15-minute inactivity session lock, client data retention, and document deletion purge requests.',
                    actions: 'Tamper-proof security audit log viewer; one-click encrypted archive download (.zip); compliance purge ticket generator.',
                  },
                ].map((s) => (
                  <div key={s.num} className="p-4 bg-[#F7F5FA] rounded-xl border border-[#E8E2EE] space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#5B3E8E] text-white flex items-center justify-center font-bold text-[10px]">
                        {s.num}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#2E2438]">{s.title}</h4>
                    </div>
                    <p className="text-[#6E637B] pl-7"><strong className="text-[#2E2438]">Purpose:</strong> {s.purpose}</p>
                    <p className="text-[#5B3E8E] pl-7 font-medium"><strong className="text-[#2E2438]">Real System Action:</strong> {s.actions}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: DESIGN TOKENS */}
          {activeTab === 'tokens' && (
            <div className="space-y-6 text-xs text-[#2E2438]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2E2438]">
                  Design Tokens — "Amethyst Ledger"
                </h3>
                <p className="text-[#6E637B] mt-1">
                  Violet signals trust and premium advisory authority; gold accents precision. Defined in <code>src/design-system/tokens.ts</code>.
                </p>
              </div>

              {/* Swatches Grid */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(VERA_DESIGN_TOKENS.palette).map(([key, item]: any) => {
                  if (key === 'darkTheme') return null;
                  return (
                    <div key={key} className="p-3 bg-[#F7F5FA] rounded-xl border border-[#E8E2EE] space-y-2">
                      <div className="flex items-center justify-between">
                        <div
                          className="w-10 h-10 rounded-lg shadow-xs border border-black/10"
                          style={{ backgroundColor: item.hex }}
                        />
                        <code className="text-[11px] font-mono font-bold text-[#2E2438]">{item.hex}</code>
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-[#2E2438]">{item.token}</p>
                        <p className="text-[11px] text-[#6E637B] mt-0.5">{item.use}</p>
                        <p className="text-[10px] text-[#5B3E8E] italic mt-1">{item.rationale}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Strict Rule Callout */}
              <div className="bg-[#FDF2F2] border border-[#D64545]/30 p-4 rounded-xl space-y-1">
                <span className="font-bold text-[#D64545] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Strict Regulatory Rule for --deadline-red:
                </span>
                <p className="text-[#2E2438] text-xs leading-relaxed">
                  <code>--deadline-red (#D64545)</code> NEVER appears anywhere except an actual approaching/missed deadline. If it starts showing up on generic error states or input validations, clients lose cognitive trust in it as a critical financial signal.
                </p>
              </div>

              {/* Typography */}
              <div className="p-4 bg-[#F7F5FA] rounded-xl border border-[#E8E2EE] space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#2E2438]">Typography Hierarchy</h4>
                <p><strong>Headings:</strong> Lora (Serif) — Editorial/professional authority in premium financial advisory.</p>
                <p><strong>Body / UI Text:</strong> Inter (Sans) — Clean, neutral, high-legibility at 12–16px for dense tax data.</p>
                <p className="text-[#5B3E8E] font-medium">Rule: Never mix more than these two typefaces.</p>
              </div>
            </div>
          )}

          {/* TAB 3: SYSTEM PROMPT */}
          {activeTab === 'prompt' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2E2438]">
                    Vera Conversational AI System Prompt
                  </h3>
                  <p className="text-[#6E637B] mt-0.5">
                    Configured in <code>server.ts</code> and <code>src/services/systemPrompt.ts</code>.
                  </p>
                </div>

                <button
                  onClick={handleCopyPrompt}
                  className="bg-[#5B3E8E] hover:bg-[#4C3278] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? 'Copied' : 'Copy Full Prompt'}</span>
                </button>
              </div>

              <div className="bg-[#2E2438] text-white p-4 rounded-xl font-mono text-[11px] leading-relaxed max-h-96 overflow-y-auto border border-[#3F344F] whitespace-pre-wrap">
                {VERA_SYSTEM_PROMPT}
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY CHECKLIST */}
          {activeTab === 'security' && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2E2438]">
                  Security Checklist Mapped to Concrete Implementation Tasks
                </h3>
                <p className="text-[#6E637B] mt-0.5">
                  Direct cross-walk to IRS Publication 4557 (Safeguarding Taxpayer Data) & FTC Safeguards Rule (16 CFR Part 314).
                </p>
              </div>

              <div className="divide-y divide-[#E8E2EE] border border-[#E8E2EE] rounded-xl overflow-hidden">
                {VERA_SECURITY_CHECKLIST.map((task) => (
                  <div key={task.id} className="p-4 bg-white hover:bg-[#F7F5FA] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#5B3E8E]">{task.id}</span>
                        <h4 className="font-semibold text-[#2E2438]">{task.requirement}</h4>
                      </div>
                      <span className="bg-[#EEF8F5] text-[#4E9C86] font-bold text-[10px] px-2 py-0.5 rounded border border-[#4E9C86]/20">
                        {task.regulatoryAuthority}
                      </span>
                    </div>
                    <p className="text-[#6E637B]">
                      <strong>Implementation:</strong> {task.concreteImplementation}
                    </p>
                    <p className="text-[#4E9C86] font-mono text-[11px]">
                      <strong>Verification:</strong> {task.technicalVerification}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: API DOCUMENTATION */}
          {activeTab === 'api' && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2E2438]">
                  Comprehensive API Documentation for Core Integrations
                </h3>
                <p className="text-[#6E637B] mt-0.5">
                  Rest endpoints, schemas, headers, error codes, and audit webhooks.
                </p>
              </div>

              <div className="space-y-4">
                {VERA_API_DOCS.map((doc, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-[#E8E2EE] bg-[#F7F5FA] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          doc.method === 'GET' ? 'bg-[#EEF8F5] text-[#4E9C86]' : 'bg-[#F3EEF9] text-[#5B3E8E]'
                        }`}>
                          {doc.method}
                        </span>
                        <code className="font-mono font-bold text-[#2E2438] text-xs">{doc.path}</code>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-[#C9982F] bg-white px-2 py-0.5 rounded border border-[#C9982F]/30">
                        {doc.category}
                      </span>
                    </div>

                    <p className="text-[#6E637B] font-medium">{doc.summary}</p>

                    {doc.requestBody && (
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#6E637B]">Request Payload:</span>
                        <pre className="bg-[#2E2438] text-white p-2.5 rounded-lg text-[10px] font-mono overflow-x-auto mt-1">
                          {doc.requestBody}
                        </pre>
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#6E637B]">Sample 200 OK Response:</span>
                      <pre className="bg-[#2E2438] text-[#4E9C86] p-2.5 rounded-lg text-[10px] font-mono overflow-x-auto mt-1">
                        {doc.responseBody}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PRACTICE MANAGEMENT CONFIGURATOR */}
          {activeTab === 'config' && (
            <div className="space-y-6 text-xs text-[#2E2438]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2E2438]">
                  Practice-Management & Jurisdiction Settings
                </h3>
                <p className="text-[#6E637B] mt-1">
                  Answers master prompt instruction: <em>"Ask before assuming a detail not specified above (e.g. which practice-management software to integrate with, which country's tax year rules apply)."</em>
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#F7F5FA] rounded-xl border border-[#E8E2EE] space-y-3">
                  <label className="block font-semibold text-[#2E2438]">
                    Active Practice-Management Software Bridge:
                  </label>
                  <select
                    value={practiceStatus.systemProvider}
                    onChange={(e) => onUpdatePracticeProvider(e.target.value as any)}
                    className="w-full bg-white border border-[#E8E2EE] rounded-xl p-2.5 text-xs text-[#2E2438] font-semibold"
                  >
                    <option value="Karbon">Karbon (Live REST API & Workflows)</option>
                    <option value="Drake Software">Drake Software (Drake Portals Bridge)</option>
                    <option value="Canopy">Canopy Tax (Client Portal Sync)</option>
                    <option value="CCH Axcess">CCH Axcess (Wolters Kluwer)</option>
                    <option value="UltraTax CS">Thomson Reuters UltraTax CS</option>
                  </select>
                  <p className="text-[11px] text-[#6E637B]">
                    Status, milestone notifications, and checklist items pull live from the selected provider.
                  </p>
                </div>

                <div className="p-4 bg-[#F7F5FA] rounded-xl border border-[#E8E2EE] space-y-3">
                  <label className="block font-semibold text-[#2E2438]">
                    Applicable Tax Jurisdiction & Filing Year:
                  </label>
                  <select
                    defaultValue="us_irs_2025"
                    className="w-full bg-white border border-[#E8E2EE] rounded-xl p-2.5 text-xs text-[#2E2438] font-semibold"
                  >
                    <option value="us_irs_2025">United States — IRS Form 1040 (Tax Year 2025/2026)</option>
                    <option value="ca_cra_2025">Canada — CRA T1 Individual (Tax Year 2025)</option>
                    <option value="uk_hmrc_2025">United Kingdom — HMRC Self Assessment (2025/2026)</option>
                  </select>
                  <p className="text-[11px] text-[#6E637B]">
                    Vera automatically calibrates all standard deductions and statutory deadlines to the selected tax authority.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
