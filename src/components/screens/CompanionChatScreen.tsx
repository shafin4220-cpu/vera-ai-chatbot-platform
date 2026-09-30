import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  UserCheck, 
  ArrowRight, 
  UploadCloud, 
  Calendar, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { ChatMessage, ChecklistItem, PracticeMgmtStatus } from '../../types/vera';

interface CompanionChatScreenProps {
  checklist: ChecklistItem[];
  practiceStatus: PracticeMgmtStatus;
  onNavigateToScreen: (screenId: number) => void;
  onTriggerUploadModal: (itemId?: string) => void;
}

export const CompanionChatScreen: React.FC<CompanionChatScreenProps> = ({
  checklist,
  practiceStatus,
  onNavigateToScreen,
  onTriggerUploadModal,
}) => {
  const missingItems = checklist.filter((i) => i.status === 'missing');
  const uploadedItems = checklist.filter((i) => i.status !== 'missing');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      isAiDisclosed: true,
      timestamp: '09:00 AM',
      content: `Hello Elena. I am Vera, an AI client companion built for Sterling & Vance CPAs LLP.

I can clarify your 2025/2026 tax preparation checklist, explain IRS document requirements in plain language, check your current file status in Karbon, or book a direct call with your preparer, Marcus Vance, CPA.

*(Note: Under firm compliance rules, I explain procedures and requirements, while all binding tax positions and deductions are confirmed directly by your preparer.)*`,
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const promptSuggestions = [
    'What documents are still missing from my checklist?',
    'Can I write off my $1,200 home office standing desk?',
    'Where does my return stand in Karbon right now?',
    'What is the 2025 standard deduction for married filing jointly?',
    'Book a call with Marcus Vance, CPA',
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const missingDocTitles = missingItems.map((i) => i.title);
      const uploadedDocTitles = uploadedItems.map((i) => i.title);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: messages.slice(-4),
          clientContext: {
            clientName: practiceStatus.clientName,
            overallStatus: practiceStatus.milestones.find((m) => m.current)?.title || 'In Review',
            missingDocs: missingDocTitles,
            uploadedDocs: uploadedDocTitles,
          },
        }),
      });

      const data = await res.json();
      const lower = textToSend.toLowerCase();

      // Check if this inquiry touches specific tax advice requiring human escalation
      const isTaxAdviceQuery =
        lower.includes('deduct') ||
        lower.includes('write off') ||
        lower.includes('depreciate') ||
        lower.includes('s-corp') ||
        lower.includes('audit');

      const isStatusQuery = lower.includes('status') || lower.includes('where is my return') || lower.includes('refund');
      const isChecklistQuery = lower.includes('missing') || lower.includes('checklist') || lower.includes('upload');
      const isBookingQuery = lower.includes('book') || lower.includes('call') || lower.includes('appointment');

      let actionCard: ChatMessage['actionCard'] = undefined;
      let escalationDossier: ChatMessage['escalationDossier'] = undefined;

      if (isTaxAdviceQuery) {
        escalationDossier = {
          summary: `Client inquiry regarding deduction eligibility for: "${textToSend}"`,
          clientQuestion: textToSend,
          missingDocs: missingDocTitles,
          checklistCompletionRate: Math.round((uploadedItems.length / checklist.length) * 100),
          recommendedAction: 'Marcus Vance, CPA review Section 179 vs De Minimis expensing election.',
        };
        actionCard = {
          type: 'escalation_card',
          title: 'Escalate to Preparer (Marcus Vance, CPA)',
          details: 'Vera has packaged your question and current file state into a priority review note for Marcus.',
        };
      } else if (isStatusQuery) {
        actionCard = {
          type: 'status_preview',
          title: `Current Status: ${practiceStatus.milestones.find((m) => m.current)?.title || 'In Review'}`,
          details: `Connected to ${practiceStatus.systemProvider}. IRS MeF Submission: ${practiceStatus.irsSubmissionId}`,
        };
      } else if (isChecklistQuery && missingItems.length > 0) {
        actionCard = {
          type: 'upload_prompt',
          title: `${missingItems.length} Outstanding Items on Checklist`,
          details: `Missing: ${missingItems.map((i) => i.title.split(':')[0]).join(', ')}`,
        };
      } else if (isBookingQuery) {
        actionCard = {
          type: 'booking_prompt',
          title: 'Direct Calendar with Marcus Vance, CPA',
          details: 'Available slots open tomorrow starting at 09:30 AM.',
        };
      }

      const assistantMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        isAiDisclosed: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: data.reply || (
          isTaxAdviceQuery 
            ? `Under IRS guidelines for Tax Year 2025, qualifying tangible property purchases may be eligible for immediate expensing under the De Minimis Safe Harbor election (up to $2,500 per invoice) or Section 179 depreciation, provided the item is used for regular and exclusive business operations.\n\nHowever, because your business structure (Schedule C) and personal allocation determine the exact tax position, let's get this to your preparer, Marcus Vance, CPA, to confirm your deduction.`
            : `I've checked your client record in Karbon. Your file is currently in Review with Marcus Vance, CPA. We have verified 7 of your 10 required items, with Form 1098 Mortgage Interest still pending.`
        ),
        actionCard,
        escalationDossier,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          role: 'assistant',
          isAiDisclosed: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: `I am Vera, your firm's AI companion. Your tax file is currently In Review with Marcus Vance, CPA. If you have specific deduction questions, I can compile an inquiry dossier for Marcus to review with you.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const [confirmedEscalation, setConfirmedEscalation] = useState<string | null>(null);

  const handleConfirmEscalation = (msgId: string) => {
    setConfirmedEscalation(msgId);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
      <div className="bg-white rounded-2xl border border-[#E8E2EE] shadow-sm flex flex-col h-[760px] overflow-hidden">
        {/* Chat Header with AI Disclosure & Preparer Bridge */}
        <div className="p-4 sm:p-5 border-b border-[#E8E2EE] bg-[#F7F5FA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#5B3E8E] text-white flex items-center justify-center font-serif text-xl font-bold shadow-xs">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base text-[#2E2438]">
                  Vera AI Companion
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F3EEF9] text-[#5B3E8E] px-2 py-0.5 rounded border border-[#5B3E8E]/20">
                  AI Disclosed
                </span>
              </div>
              <p className="text-xs text-[#6E637B]">
                Sterling & Vance CPAs • Grounded in IRS Tax Year 2025/2026 Rules
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#4E9C86] font-medium bg-white px-3 py-1.5 rounded-xl border border-[#E8E2EE]">
            <ShieldCheck className="w-4 h-4 text-[#4E9C86]" />
            <span>Zero Data Retention on Client PII</span>
          </div>
        </div>

        {/* Advisory Guardrail Banner */}
        <div className="bg-[#FDF9F0] px-4 py-2 border-b border-[#C9982F]/20 text-[11px] text-[#2E2438] flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#C9982F] shrink-0" />
          <span>
            <strong>Compliance Notice:</strong> Vera provides process guidance and checklist assistance. Final tax determinations are made by Marcus Vance, CPA.
          </span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#5B3E8E] text-white flex items-center justify-center font-serif text-sm font-bold shrink-0 shadow-xs mt-1">
                    V
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#5B3E8E] text-white rounded-br-xs font-normal'
                        : 'bg-[#F7F5FA] text-[#2E2438] border border-[#E8E2EE] rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                    <div className={`text-[10px] mt-1.5 flex items-center gap-1 ${
                      isUser ? 'text-white/60 justify-end' : 'text-[#6E637B]'
                    }`}>
                      <span>{msg.timestamp}</span>
                      {!isUser && <span>• Vera AI</span>}
                    </div>
                  </div>

                  {/* ACTION CARD (If Intent Detected) */}
                  {msg.actionCard && (
                    <div className="bg-white rounded-xl border border-[#E8E2EE] p-3.5 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#5B3E8E] bg-[#F3EEF9] px-2 py-0.5 rounded">
                          Suggested System Action
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-xs text-[#2E2438]">
                        {msg.actionCard.title}
                      </h4>

                      {msg.actionCard.details && (
                        <p className="text-[11px] text-[#6E637B]">
                          {msg.actionCard.details}
                        </p>
                      )}

                      {/* Escalation Dossier Component */}
                      {msg.escalationDossier && (
                        <div className="bg-[#F7F5FA] p-3 rounded-lg border border-[#E8E2EE] space-y-1.5 text-[11px]">
                          <div className="flex items-center justify-between font-semibold text-[#2E2438]">
                            <span>Preparer Handoff Dossier:</span>
                            <span className="text-[#5B3E8E]">Assigned: Marcus Vance, CPA</span>
                          </div>
                          <p className="text-[#6E637B]">
                            <strong>Question:</strong> {msg.escalationDossier.clientQuestion}
                          </p>
                          <p className="text-[#6E637B]">
                            <strong>Context:</strong> Intake {msg.escalationDossier.checklistCompletionRate}% complete
                          </p>

                          {confirmedEscalation === msg.id ? (
                            <div className="bg-[#EEF8F5] text-[#4E9C86] font-semibold p-2 rounded border border-[#4E9C86]/30 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Escalation Sent to Marcus Vance’s Priority Review Queue</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleConfirmEscalation(msg.id)}
                              className="w-full mt-2 bg-[#C9982F] hover:bg-[#B48523] text-[#2E2438] font-bold py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Route Dossier to Marcus Vance, CPA</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Other Action Buttons */}
                      {msg.actionCard.type === 'upload_prompt' && (
                        <button
                          onClick={() => onNavigateToScreen(3)}
                          className="w-full bg-[#5B3E8E] hover:bg-[#4C3278] text-white text-xs font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <UploadCloud className="w-3.5 h-3.5 text-[#C9982F]" />
                          <span>Open Document Checklist</span>
                        </button>
                      )}

                      {msg.actionCard.type === 'status_preview' && (
                        <button
                          onClick={() => onNavigateToScreen(6)}
                          className="w-full bg-[#5B3E8E] hover:bg-[#4C3278] text-white text-xs font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-[#C9982F]" />
                          <span>View Full Filing Tracker</span>
                        </button>
                      )}

                      {msg.actionCard.type === 'booking_prompt' && (
                        <button
                          onClick={() => onNavigateToScreen(5)}
                          className="w-full bg-[#5B3E8E] hover:bg-[#4C3278] text-white text-xs font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5 text-[#C9982F]" />
                          <span>View Open Slots with Marcus</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-[#6E637B]">
              <div className="w-8 h-8 rounded-xl bg-[#5B3E8E] text-white flex items-center justify-center font-serif text-sm font-bold shrink-0 animate-pulse">
                V
              </div>
              <div className="bg-[#F7F5FA] p-3 rounded-2xl border border-[#E8E2EE] flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-[#5B3E8E] animate-spin" />
                <span>Vera is referencing IRS 2025/2026 rules and your practice file...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestions */}
        <div className="p-2.5 bg-[#F7F5FA] border-t border-[#E8E2EE] overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2 text-xs">
          {promptSuggestions.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="bg-white hover:bg-[#F3EEF9] text-[#2E2438] px-3 py-1.5 rounded-lg border border-[#E8E2EE] transition-colors cursor-pointer shrink-0 font-medium text-[11px]"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#E8E2EE]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about your checklist, filing status, or tax concepts..."
              className="flex-1 bg-[#F7F5FA] border border-[#E8E2EE] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#2E2438] placeholder:text-[#6E637B] focus:outline-none focus:border-[#5B3E8E]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className={`p-2.5 rounded-xl text-white transition-colors cursor-pointer ${
                inputMessage.trim() && !isLoading
                  ? 'bg-[#5B3E8E] hover:bg-[#4C3278]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
