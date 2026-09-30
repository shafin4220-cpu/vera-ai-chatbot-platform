import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Smartphone, 
  Building2, 
  KeyRound,
  Download,
  Check
} from 'lucide-react';
import { ClientProfile } from '../../types/vera';

interface OnboardingScreenProps {
  clientProfile: ClientProfile;
  onUpdateProfile: (updated: Partial<ClientProfile>) => void;
  onCompleteOnboarding: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  clientProfile,
  onUpdateProfile,
  onCompleteOnboarding,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(
    clientProfile.onboardingStep >= 4 ? 3 : clientProfile.onboardingStep
  );
  const [mfaCode, setMfaCode] = useState('');
  const [mfaVerified, setMfaVerified] = useState(clientProfile.mfaEnabled);
  const [signatureName, setSignatureName] = useState(clientProfile.fullName);
  const [agreedTerms, setAgreedTerms] = useState(clientProfile.eSignedEngagementLetter);
  const [agreed7216, setAgreed7216] = useState(clientProfile.section7216ConsentSigned);
  const [signatureSealed, setSignatureSealed] = useState(clientProfile.eSignedEngagementLetter);

  const handleVerifyMfa = () => {
    if (mfaCode.length >= 6) {
      setMfaVerified(true);
      onUpdateProfile({ mfaEnabled: true, onboardingStep: 3 });
      setCurrentStep(3);
    }
  };

  const handleSignAgreement = () => {
    if (!signatureName.trim() || !agreedTerms || !agreed7216) return;
    const now = new Date().toISOString();
    const hash = 'SHA256: 7b' + Math.random().toString(16).substring(2, 10) + 'c402128e4e';
    setSignatureSealed(true);
    onUpdateProfile({
      eSignedEngagementLetter: true,
      eSignedDate: now,
      eSignedHash: hash,
      section7216ConsentSigned: true,
      onboardingStep: 4,
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#5B3E8E] bg-[#F3EEF9] px-3 py-1 rounded border border-[#5B3E8E]/20">
          Section 1 • Secure Client Link
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2E2438] mt-3">
          Onboarding & Engagement Authorization
        </h1>
        <p className="text-[#6E637B] text-sm max-w-xl mx-auto mt-2">
          Connect your secure client file with Sterling & Vance CPAs LLP, activate mandatory MFA, and execute your engagement letter in 3 simple steps.
        </p>
      </div>

      {/* 3-Step Horizontal Indicator */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E2EE] mb-8 shadow-sm">
        <div className="grid grid-cols-3 gap-2 text-xs font-medium">
          {/* Step 1 */}
          <div 
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
              currentStep === 1 
                ? 'bg-[#F3EEF9] text-[#5B3E8E] font-semibold' 
                : 'text-[#6E637B] hover:bg-gray-50'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep > 1 ? 'bg-[#4E9C86] text-white' : currentStep === 1 ? 'bg-[#5B3E8E] text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
            </div>
            <span className="truncate">1. Client Link</span>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => setCurrentStep(2)}
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
              currentStep === 2 
                ? 'bg-[#F3EEF9] text-[#5B3E8E] font-semibold' 
                : 'text-[#6E637B] hover:bg-gray-50'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              mfaVerified ? 'bg-[#4E9C86] text-white' : currentStep === 2 ? 'bg-[#5B3E8E] text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {mfaVerified ? <Check className="w-3.5 h-3.5" /> : '2'}
            </div>
            <span className="truncate">2. Mandatory MFA</span>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => setCurrentStep(3)}
            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
              currentStep === 3 
                ? 'bg-[#F3EEF9] text-[#5B3E8E] font-semibold' 
                : 'text-[#6E637B] hover:bg-gray-50'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              signatureSealed ? 'bg-[#4E9C86] text-white' : currentStep === 3 ? 'bg-[#5B3E8E] text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {signatureSealed ? <Check className="w-3.5 h-3.5" /> : '3'}
            </div>
            <span className="truncate">3. E-Sign & Consent</span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl border border-[#E8E2EE] p-6 sm:p-8 shadow-sm">
        {/* Step 1: Firm Account Link */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-[#F7F5FA] rounded-xl border border-[#E8E2EE]">
              <div className="p-3 bg-white rounded-xl text-[#5B3E8E] border border-[#E8E2EE] shadow-xs">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#2E2438]">
                  {clientProfile.firmName}
                </h3>
                <p className="text-xs text-[#6E637B] mt-0.5">{clientProfile.firmAddress}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="bg-white px-2 py-0.5 rounded border border-[#E8E2EE] text-[#2E2438]">
                    Tax Year: <strong>{clientProfile.taxYear}</strong>
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-[#E8E2EE] text-[#4E9C86] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#4E9C86]" /> Verified Firm Account
                  </span>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2E2438] mb-1">
                  Client Full Legal Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={clientProfile.fullName}
                  className="w-full bg-[#F7F5FA] border border-[#E8E2EE] rounded-xl px-3 py-2 text-sm text-[#2E2438] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2E2438] mb-1">
                  Client File Number
                </label>
                <input
                  type="text"
                  readOnly
                  value={clientProfile.id}
                  className="w-full bg-[#F7F5FA] border border-[#E8E2EE] rounded-xl px-3 py-2 text-sm text-[#5B3E8E] font-mono font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2E2438] mb-1">
                  Primary Email (MFA & Delivery)
                </label>
                <input
                  type="email"
                  readOnly
                  value={clientProfile.email}
                  className="w-full bg-[#F7F5FA] border border-[#E8E2EE] rounded-xl px-3 py-2 text-sm text-[#2E2438]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2E2438] mb-1">
                  Verified Contact Phone
                </label>
                <input
                  type="text"
                  readOnly
                  value={clientProfile.phone}
                  className="w-full bg-[#F7F5FA] border border-[#E8E2EE] rounded-xl px-3 py-2 text-sm text-[#2E2438]"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => {
                  onUpdateProfile({ onboardingStep: 2 });
                  setCurrentStep(2);
                }}
                className="bg-[#5B3E8E] hover:bg-[#4C3278] text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Continue to MFA Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: MFA Setup */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-[#E8E2EE] pb-4">
              <div className="flex items-center gap-2 text-[#5B3E8E] text-xs font-semibold uppercase tracking-wider">
                <Smartphone className="w-4 h-4" />
                <span>IRS Publication 4557 Security Mandate</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2E2438] mt-1">
                Activate Multi-Factor Authentication (MFA)
              </h3>
              <p className="text-xs text-[#6E637B] mt-1">
                To protect client SSNs and tax return records, password-only logins are strictly prohibited under federal safeguards.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="bg-[#F7F5FA] p-5 rounded-xl border border-[#E8E2EE] text-center space-y-3">
                <div className="w-36 h-36 bg-white mx-auto p-2 rounded-lg border border-[#E8E2EE] flex items-center justify-center shadow-xs">
                  {/* Mock QR Code Pattern */}
                  <div className="w-32 h-32 bg-gray-900 rounded p-1 flex flex-wrap gap-0.5">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          (i % 2 === 0 || i % 7 === 0 || i < 16) ? 'bg-white' : 'bg-gray-900'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-[#6E637B]">
                  Scan with Google Authenticator, 1Password, or Authy
                </p>
                <div className="bg-white px-3 py-1.5 rounded border border-[#E8E2EE] text-xs font-mono text-[#5B3E8E]">
                  STERLING-VANCE-MFA-9842
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2E2438] mb-1">
                    Enter 6-Digit One-Time Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center tracking-widest text-2xl font-mono py-2.5 border border-[#E8E2EE] rounded-xl focus:border-[#5B3E8E] focus:outline-none bg-white"
                  />
                  <p className="text-[11px] text-[#6E637B] mt-1">
                    For testing, enter any 6 digits (e.g. <code>849201</code>).
                  </p>
                </div>

                <div className="bg-[#EEF8F5] p-3 rounded-xl border border-[#4E9C86]/30 text-xs text-[#2E2438] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#4E9C86] shrink-0 mt-0.5" />
                  <span>
                    Backup SMS recovery is also active on file ending in <strong>3401</strong>.
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2.5 rounded-xl border border-[#E8E2EE] text-xs font-semibold text-[#6E637B] hover:bg-gray-50 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleVerifyMfa}
                    disabled={mfaCode.length < 6}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                      mfaCode.length >= 6
                        ? 'bg-[#5B3E8E] hover:bg-[#4C3278] text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Verify & Continue</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: E-Sign Engagement Letter & 7216 Consent */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-[#E8E2EE] pb-4">
              <div className="flex items-center gap-2 text-[#5B3E8E] text-xs font-semibold uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Legal Engagement & IRC § 7216 Consent</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2E2438] mt-1">
                E-Sign Engagement Letter & AI Processing Consent
              </h3>
              <p className="text-xs text-[#6E637B] mt-1">
                Please review the standard terms of tax return preparation for Tax Year {clientProfile.taxYear}.
              </p>
            </div>

            {/* Embedded Agreement Scroll Area */}
            <div className="bg-[#F7F5FA] p-4 rounded-xl border border-[#E8E2EE] max-h-56 overflow-y-auto text-xs text-[#2E2438] space-y-3 leading-relaxed">
              <p className="font-semibold text-[#5B3E8E]">
                1. SCOPE OF ENGAGEMENT
              </p>
              <p>
                Sterling & Vance CPAs LLP will prepare your federal Form 1040 and applicable state returns for the 2025/2026 tax year based on information provided by the client. Our work will not include auditing or independent verification of the data submitted.
              </p>
              <p className="font-semibold text-[#5B3E8E]">
                2. CLIENT RESPONSIBILITIES & ACCURACY
              </p>
              <p>
                You affirm that all income, deduction, and business expense information uploaded to Vera is complete, accurate, and substantiated by contemporaneously maintained records (receipts, mileage logs, 1099s).
              </p>
              <p className="font-semibold text-[#5B3E8E]">
                3. SECTION 7216 CONSENT FOR AI ASSISTANCE & AUTOMATION
              </p>
              <p>
                Federal law (Internal Revenue Code § 7216) protects taxpayer confidentiality. By signing below, you explicitly consent to the use of Vera (firm-hosted AI companion) for document OCR indexing, checklist gap-detection, and preparer handoff summarization. Your data will NEVER be used to train public or commercial AI models.
              </p>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded text-[#5B3E8E] focus:ring-[#5B3E8E]"
                />
                <span className="text-[#2E2438]">
                  I agree to the Engagement Letter terms and standard fee structure of Sterling & Vance CPAs LLP.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed7216}
                  onChange={(e) => setAgreed7216(e.target.checked)}
                  className="mt-0.5 rounded text-[#5B3E8E] focus:ring-[#5B3E8E]"
                />
                <span className="text-[#2E2438]">
                  I grant consent under IRC § 7216 for automated OCR classification and secure preparer collaboration through Vera.
                </span>
              </label>
            </div>

            {/* Signature Box */}
            <div className="bg-[#FDF9F0] p-4 rounded-xl border border-[#C9982F]/30 space-y-3">
              <label className="block text-xs font-semibold text-[#2E2438]">
                Electronic Signature (Type your legal name):
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder="Elena Rostova"
                  className="flex-1 bg-white border border-[#E8E2EE] rounded-xl px-4 py-2 font-serif text-lg text-[#2E2438] italic focus:outline-none focus:border-[#C9982F]"
                />
                <button
                  onClick={handleSignAgreement}
                  disabled={!signatureName.trim() || !agreedTerms || !agreed7216}
                  className={`px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                    signatureName.trim() && agreedTerms && agreed7216
                      ? 'bg-[#C9982F] hover:bg-[#B48523] text-[#2E2438]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{signatureSealed ? 'Signature Sealed' : 'Adopt & Seal Signature'}</span>
                </button>
              </div>

              {signatureSealed && (
                <div className="mt-2 flex items-center justify-between text-[11px] text-[#4E9C86] font-medium pt-2 border-t border-[#C9982F]/20">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4E9C86]" />
                    Signed on {new Date(clientProfile.eSignedDate || Date.now()).toLocaleDateString()} • {clientProfile.eSignedHash || 'SHA256: 7b54a...8e4e'}
                  </span>
                  <span className="text-[#6E637B]">Tamper-Proof Audit Sealed</span>
                </div>
              )}
            </div>

            {/* Next Action */}
            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 rounded-xl border border-[#E8E2EE] text-xs font-semibold text-[#6E637B] hover:bg-gray-50 cursor-pointer"
              >
                Back to MFA
              </button>

              <button
                onClick={onCompleteOnboarding}
                disabled={!signatureSealed}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 cursor-pointer ${
                  signatureSealed
                    ? 'bg-[#5B3E8E] hover:bg-[#4C3278] text-white shadow-sm'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>Proceed to Home Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
