import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Camera, 
  Sparkles, 
  ShieldCheck, 
  X, 
  Lock,
  Download,
  Trash2,
  RefreshCw,
  Clock
} from 'lucide-react';
import { ChecklistItem, DocumentCategory } from '../../types/vera';

interface DocumentChecklistScreenProps {
  checklist: ChecklistItem[];
  onUploadDocument: (itemId: string, file: File | { name: string; size: string }) => void;
  onRemoveDocument: (itemId: string) => void;
  selectedItemIdForUpload?: string | null;
  onClearUploadTarget?: () => void;
}

export const DocumentChecklistScreen: React.FC<DocumentChecklistScreenProps> = ({
  checklist,
  onUploadDocument,
  onRemoveDocument,
  selectedItemIdForUpload,
  onClearUploadTarget,
}) => {
  const [activeCategory, setActiveCategory] = useState<DocumentCategory | 'all'>('all');
  const [activeItemForModal, setActiveItemForModal] = useState<ChecklistItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [targetUploadItem, setTargetUploadItem] = useState<ChecklistItem | null>(null);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrSuccessData, setOcrSuccessData] = useState<any | null>(null);

  // Auto open upload modal if parent requested via selectedItemIdForUpload
  React.useEffect(() => {
    if (selectedItemIdForUpload) {
      const item = checklist.find((i) => i.id === selectedItemIdForUpload);
      if (item) {
        setTargetUploadItem(item);
        setIsUploadModalOpen(true);
      }
    }
  }, [selectedItemIdForUpload, checklist]);

  const categories: { id: DocumentCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Documents' },
    { id: 'income', label: 'Income (W-2 / 1099)' },
    { id: 'deductions', label: 'Deductions & Credits' },
    { id: 'business', label: 'Business (Schedule C)' },
    { id: 'prior_year', label: 'Prior Year & ID' },
  ];

  const filteredItems = checklist.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const total = checklist.length;
  const completed = checklist.filter((i) => i.status !== 'missing').length;
  const missing = total - completed;

  const handleTriggerUpload = (item: ChecklistItem) => {
    setTargetUploadItem(item);
    setOcrSuccessData(null);
    setIsUploadModalOpen(true);
  };

  const handleSimulateUpload = (fileName: string, fileSize: string) => {
    if (!targetUploadItem) return;
    setIsProcessingOcr(true);

    setTimeout(() => {
      onUploadDocument(targetUploadItem.id, { name: fileName, size: fileSize });
      setIsProcessingOcr(false);
      setOcrSuccessData({
        detectedForm: targetUploadItem.title,
        status: 'Encrypted with AES-256-GCM',
        confidence: 0.99,
        hash: 'SHA256: 9e' + Math.random().toString(16).substring(2, 10),
      });

      // Close modal after showing success preview
      setTimeout(() => {
        setIsUploadModalOpen(false);
        setTargetUploadItem(null);
        setOcrSuccessData(null);
        if (onClearUploadTarget) onClearUploadTarget();
      }, 1400);
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-6">
      {/* Header & Stats Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8E2EE] shadow-sm">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5B3E8E] bg-[#F3EEF9] px-2.5 py-0.5 rounded border border-[#5B3E8E]/20">
            Section 3 • Intelligent Checklist & Storage
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E2438] mt-2">
            Personalized Document Checklist
          </h1>
          <p className="text-xs sm:text-sm text-[#6E637B] mt-1">
            Every document is encrypted at rest (AES-256) and verified through automated OCR against your tax return requirements.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-[#F7F5FA] px-4 py-2.5 rounded-xl border border-[#E8E2EE] text-right">
            <span className="text-[10px] text-[#6E637B] font-medium uppercase">Intake Progress</span>
            <p className="font-serif text-xl font-bold text-[#2E2438]">
              {completed} <span className="text-xs text-[#6E637B] font-sans">/ {total} verified</span>
            </p>
          </div>

          <div className={`px-4 py-2.5 rounded-xl border text-right ${
            missing > 0 ? 'bg-[#FDF9F0] border-[#C9982F]/40' : 'bg-[#EEF8F5] border-[#4E9C86]/30'
          }`}>
            <span className="text-[10px] text-[#6E637B] font-medium uppercase">Outstanding</span>
            <p className={`font-serif text-xl font-bold ${missing > 0 ? 'text-[#C9982F]' : 'text-[#4E9C86]'}`}>
              {missing === 0 ? 'Complete' : `${missing} Missing`}
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const count = cat.id === 'all' 
            ? checklist.length 
            : checklist.filter((i) => i.category === cat.id).length;
          const isSelected = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#5B3E8E] text-white shadow-sm'
                  : 'bg-white hover:bg-[#F3EEF9] text-[#6E637B] border border-[#E8E2EE]'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isSelected ? 'bg-white/20 text-white' : 'bg-[#F7F5FA] text-[#6E637B]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Checklist Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const isUploaded = item.status !== 'missing';

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-5 border transition-all shadow-sm flex flex-col justify-between ${
                isUploaded ? 'border-[#4E9C86]/30 hover:border-[#4E9C86]/60' : 'border-[#E8E2EE] hover:border-[#C9982F]/60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {/* Status Circle / Checkmark */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      isUploaded
                        ? 'bg-[#4E9C86] text-white'
                        : 'border-2 border-[#C9982F] bg-[#FDF9F0] text-[#C9982F]'
                    }`}>
                      {isUploaded ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-[#C9982F]" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-sm text-[#2E2438]">
                          {item.title}
                        </h3>
                        {item.required && (
                          <span className="text-[10px] font-semibold text-[#5B3E8E] bg-[#F3EEF9] px-1.5 py-0.2 rounded">
                            Required
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#6E637B]">
                        {item.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {isUploaded ? (
                    <span className="text-[11px] font-semibold text-[#4E9C86] bg-[#EEF8F5] px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#4E9C86]/20">
                      <ShieldCheck className="w-3 h-3 text-[#4E9C86]" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-[#B48523] bg-[#FDF9F0] px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#C9982F]/30">
                      <Clock className="w-3 h-3 text-[#C9982F]" />
                      Action Needed
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#6E637B] mt-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Uploaded File Pill & OCR Snapshot if present */}
                {isUploaded && (
                  <div className="mt-3 p-2.5 bg-[#F7F5FA] rounded-xl border border-[#E8E2EE] text-xs space-y-1">
                    <div className="flex items-center justify-between font-mono text-[11px] text-[#2E2438]">
                      <span className="truncate max-w-[200px] flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-[#5B3E8E]" />
                        {item.uploadedFileName}
                      </span>
                      <span className="text-[#6E637B]">{item.uploadedFileSize}</span>
                    </div>

                    {item.ocrData && (
                      <div className="pt-1.5 border-t border-[#E8E2EE] text-[11px] text-[#6E637B] flex flex-wrap gap-x-3 gap-y-0.5">
                        {item.ocrData.issuerName && (
                          <span>Issuer: <strong>{item.ocrData.issuerName}</strong></span>
                        )}
                        {item.ocrData.wagesOrAmount && (
                          <span>Amount: <strong className="text-[#4E9C86]">{item.ocrData.wagesOrAmount}</strong></span>
                        )}
                        {item.ocrData.taxWithheld && (
                          <span>Withheld: <strong>{item.ocrData.taxWithheld}</strong></span>
                        )}
                        <span className="text-[#4E9C86] font-semibold flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> OCR Confirmed
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-[#E8E2EE] flex items-center justify-between">
                {isUploaded ? (
                  <div className="flex items-center gap-2 w-full justify-between">
                    <button
                      onClick={() => setActiveItemForModal(item)}
                      className="text-xs text-[#5B3E8E] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Details & Hash</span>
                    </button>

                    <button
                      onClick={() => onRemoveDocument(item.id)}
                      className="text-xs text-[#6E637B] hover:text-[#D64545] p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Replace or remove document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleTriggerUpload(item)}
                    className="w-full bg-[#5B3E8E] hover:bg-[#4C3278] text-white text-xs font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-[#C9982F]" />
                    <span>Upload {item.title.split(':')[0]}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* UPLOAD MODAL WITH REAL SIMULATION AND OCR */}
      {isUploadModalOpen && targetUploadItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E8E2EE] shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                setIsUploadModalOpen(false);
                setTargetUploadItem(null);
                setOcrSuccessData(null);
                if (onClearUploadTarget) onClearUploadTarget();
              }}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5B3E8E] bg-[#F3EEF9] px-2 py-0.5 rounded">
                Secure Encrypted Upload
              </span>
              <h2 className="font-serif text-xl font-bold text-[#2E2438] mt-1.5">
                {targetUploadItem.title}
              </h2>
              <p className="text-xs text-[#6E637B] mt-0.5">
                Target Category: <strong className="capitalize">{targetUploadItem.category}</strong> • AES-256 Envelope Encrypted
              </p>
            </div>

            {/* Processing State */}
            {isProcessingOcr ? (
              <div className="py-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#5B3E8E] animate-spin mx-auto" />
                <h4 className="font-serif font-bold text-sm text-[#2E2438]">
                  Running Intelligent OCR & Encryption...
                </h4>
                <p className="text-xs text-[#6E637B]">
                  Validating against IRS 2025 document schema and updating practice checklist...
                </p>
              </div>
            ) : ocrSuccessData ? (
              <div className="py-8 text-center space-y-3 bg-[#EEF8F5] rounded-xl border border-[#4E9C86]/30 p-4">
                <CheckCircle2 className="w-10 h-10 text-[#4E9C86] mx-auto" />
                <h4 className="font-serif font-bold text-base text-[#2E2438]">
                  Verified & Synced with Staff!
                </h4>
                <p className="text-xs text-[#4E9C86] font-medium">
                  {ocrSuccessData.status} • Confidence: 99%
                </p>
                <code className="text-[10px] bg-white px-2 py-1 rounded border border-[#4E9C86]/20 font-mono text-[#2E2438]">
                  {ocrSuccessData.hash}
                </code>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Drag and drop target */}
                <div className="border-2 border-dashed border-[#E8E2EE] hover:border-[#5B3E8E] rounded-2xl p-6 text-center bg-[#F7F5FA] transition-colors cursor-pointer">
                  <UploadCloud className="w-10 h-10 text-[#5B3E8E] mx-auto mb-2" />
                  <p className="text-xs font-semibold text-[#2E2438]">
                    Drag & Drop your document here, or browse
                  </p>
                  <p className="text-[11px] text-[#6E637B] mt-1">
                    Supports PDF, PNG, JPG, HEIC up to 25MB
                  </p>

                  <div className="mt-4 flex items-center justify-center gap-2">
                    <label className="bg-white border border-[#E8E2EE] text-xs font-semibold text-[#5B3E8E] px-4 py-2 rounded-xl hover:bg-gray-50 cursor-pointer shadow-xs">
                      Select Local File
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleSimulateUpload(file.name, (file.size / 1024 / 1024).toFixed(1) + ' MB');
                          }
                        }}
                      />
                    </label>

                    <button
                      onClick={() => handleSimulateUpload(`Mobile_Scan_${targetUploadItem.id}.pdf`, '1.8 MB')}
                      className="bg-[#F3EEF9] text-[#5B3E8E] text-xs font-semibold px-3 py-2 rounded-xl hover:bg-[#EAE1F4] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Camera Scan</span>
                    </button>
                  </div>
                </div>

                {/* Instant Simulation Helpers for Testers */}
                <div className="p-3 bg-[#FDF9F0] rounded-xl border border-[#C9982F]/30 space-y-2">
                  <p className="text-[11px] font-semibold text-[#2E2438] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9982F]" />
                    Instant One-Click Test Documents:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSimulateUpload(`2025_${targetUploadItem.title.split(':')[0].replace(/ /g, '_')}_Final.pdf`, '1.4 MB')}
                      className="text-[11px] bg-white hover:bg-gray-50 px-2.5 py-1 rounded-lg border border-[#C9982F]/40 font-medium text-[#2E2438] cursor-pointer"
                    >
                      Simulate Official {targetUploadItem.title.split(':')[0]}
                    </button>
                    <button
                      onClick={() => handleSimulateUpload('Scanned_Tax_Document_2025.pdf', '2.2 MB')}
                      className="text-[11px] bg-white hover:bg-gray-50 px-2.5 py-1 rounded-lg border border-[#C9982F]/40 font-medium text-[#2E2438] cursor-pointer"
                    >
                      Simulate Scanned PDF
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#6E637B] pt-2 border-t border-[#E8E2EE]">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-[#4E9C86]" />
                    End-to-End TLS 1.3
                  </span>
                  <span>Direct intake to Karbon/Drake</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INSPECT ITEM MODAL */}
      {activeItemForModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E2EE] shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setActiveItemForModal(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#4E9C86] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#4E9C86]" />
              <span>Verified & Encrypted Document Record</span>
            </div>

            <h3 className="font-serif text-lg font-bold text-[#2E2438] mt-2">
              {activeItemForModal.title}
            </h3>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="p-2.5 bg-[#F7F5FA] rounded-xl border border-[#E8E2EE]">
                <span className="text-[#6E637B]">File Name:</span>
                <p className="font-mono text-[#2E2438] font-semibold mt-0.5">
                  {activeItemForModal.uploadedFileName || 'Document.pdf'}
                </p>
              </div>

              <div className="p-2.5 bg-[#F7F5FA] rounded-xl border border-[#E8E2EE]">
                <span className="text-[#6E637B]">Storage Cipher & SHA Hash:</span>
                <p className="font-mono text-[#5B3E8E] text-[11px] mt-0.5 break-all">
                  {activeItemForModal.storageHash || 'AES256: 8a1f49e019cd5401'}
                </p>
              </div>

              {activeItemForModal.ocrData && (
                <div className="p-2.5 bg-[#EEF8F5] rounded-xl border border-[#4E9C86]/30 space-y-1">
                  <span className="text-[#4E9C86] font-semibold">Extracted OCR Metadata:</span>
                  <p className="text-[#2E2438]">Issuer: <strong>{activeItemForModal.ocrData.issuerName}</strong></p>
                  {activeItemForModal.ocrData.wagesOrAmount && (
                    <p className="text-[#2E2438]">Reported Amount: <strong>{activeItemForModal.ocrData.wagesOrAmount}</strong></p>
                  )}
                  {activeItemForModal.ocrData.taxWithheld && (
                    <p className="text-[#2E2438]">Federal Withheld: <strong>{activeItemForModal.ocrData.taxWithheld}</strong></p>
                  )}
                </div>
              )}

              <div className="p-2.5 bg-[#F7F5FA] rounded-xl border border-[#E8E2EE]">
                <span className="text-[#6E637B]">Intake Timestamp:</span>
                <p className="text-[#2E2438] mt-0.5">
                  {activeItemForModal.uploadedAt ? new Date(activeItemForModal.uploadedAt).toLocaleString() : 'Recent'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  alert(`Downloading encrypted copy of ${activeItemForModal.uploadedFileName}`);
                }}
                className="flex-1 bg-[#5B3E8E] hover:bg-[#4C3278] text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Copy</span>
              </button>
              <button
                onClick={() => setActiveItemForModal(null)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#2E2438] text-xs font-semibold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
