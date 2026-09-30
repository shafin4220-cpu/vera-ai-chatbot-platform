import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { PracticeMgmtStatus, CalendarSlot, ScheduledAppointment } from '../../types/vera';

interface BookCallScreenProps {
  practiceStatus: PracticeMgmtStatus;
  availableSlots: CalendarSlot[];
  onBookAppointment: (appointment: ScheduledAppointment) => void;
  onNavigateToScreen: (screenId: number) => void;
}

export const BookCallScreen: React.FC<BookCallScreenProps> = ({
  practiceStatus,
  availableSlots,
  onBookAppointment,
  onNavigateToScreen,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string>(availableSlots[0]?.id || '');
  const [selectedFormat, setSelectedFormat] = useState<'video' | 'phone' | 'in_office'>('video');
  const [selectedTopic, setSelectedTopic] = useState<string>('Document Review & Schedule C Deductions');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [confirmedBooking, setConfirmedBooking] = useState<ScheduledAppointment | null>(null);

  const topics = [
    'Document Review & Schedule C Deductions',
    'Standard vs Itemized Deduction Comparison',
    'Estimated Quarterly Taxes (1040-ES)',
    '15-Minute General Status Clarification',
  ];

  const handleConfirmBooking = () => {
    const slot = availableSlots.find((s) => s.id === selectedSlotId);
    if (!slot) return;

    const newAppointment: ScheduledAppointment = {
      id: 'apt-' + Date.now(),
      preparerName: practiceStatus.assignedPreparer.name,
      date: slot.date,
      time: slot.time,
      topic: selectedTopic,
      meetingFormat: selectedFormat,
      notes: clientNotes,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    onBookAppointment(newAppointment);
    setConfirmedBooking(newAppointment);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8E2EE] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5B3E8E] bg-[#F3EEF9] px-2.5 py-0.5 rounded border border-[#5B3E8E]/20">
            Section 5 • Real Calendar Integration
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E2438] mt-2">
            Schedule a Meeting with Your Preparer
          </h1>
          <p className="text-xs sm:text-sm text-[#6E637B] mt-1">
            Real calendar sync connected to {practiceStatus.assignedPreparer.name}’s calendar.
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 bg-[#F7F5FA] rounded-xl border border-[#E8E2EE]">
          <img
            src={practiceStatus.assignedPreparer.avatarUrl}
            alt={practiceStatus.assignedPreparer.name}
            className="w-12 h-12 rounded-xl object-cover border border-[#5B3E8E]/30"
          />
          <div>
            <p className="font-semibold text-xs text-[#2E2438]">
              {practiceStatus.assignedPreparer.name}
            </p>
            <p className="text-[11px] text-[#6E637B]">{practiceStatus.assignedPreparer.title}</p>
            <p className="text-[10px] text-[#4E9C86] font-medium flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4E9C86]" /> Calendar Connected
            </p>
          </div>
        </div>
      </div>

      {confirmedBooking ? (
        /* Confirmed View */
        <div className="bg-white rounded-2xl p-8 border border-[#4E9C86]/40 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#EEF8F5] text-[#4E9C86] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#4E9C86] bg-[#EEF8F5] px-3 py-1 rounded-full">
              Appointment Confirmed
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#2E2438] mt-3">
              Meeting Reserved with {confirmedBooking.preparerName}
            </h2>
            <p className="text-sm text-[#6E637B] mt-1">
              Confirmation Code: <strong className="text-[#5B3E8E] font-mono">SV-CAL-2026-88</strong>
            </p>
          </div>

          <div className="max-w-md mx-auto bg-[#F7F5FA] p-4 rounded-xl border border-[#E8E2EE] text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#6E637B]">Date & Time:</span>
              <strong className="text-[#2E2438]">{confirmedBooking.date} at {confirmedBooking.time}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6E637B]">Topic:</span>
              <strong className="text-[#2E2438]">{confirmedBooking.topic}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6E637B]">Format:</span>
              <strong className="text-[#2E2438] capitalize">{confirmedBooking.meetingFormat} Conference</strong>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => alert('Downloaded appointment calendar (.ics) file.')}
              className="bg-[#5B3E8E] hover:bg-[#4C3278] text-white text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4 text-[#C9982F]" />
              <span>Download .ICS Calendar Event</span>
            </button>

            <button
              onClick={() => onNavigateToScreen(2)}
              className="bg-white hover:bg-gray-50 border border-[#E8E2EE] text-[#2E2438] text-xs font-semibold px-5 py-2.5 rounded-xl cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      ) : (
        /* Booking Form */
        <div className="grid md:grid-cols-12 gap-6">
          {/* Left Column: Topic & Meeting Format (Col 7) */}
          <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-[#E8E2EE] shadow-sm space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#2E2438] uppercase tracking-wider mb-2">
                1. Select Meeting Focus
              </label>
              <div className="space-y-2">
                {topics.map((t) => (
                  <label
                    key={t}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedTopic === t
                        ? 'border-[#5B3E8E] bg-[#F3EEF9] text-[#2E2438] font-semibold'
                        : 'border-[#E8E2EE] hover:bg-gray-50 text-[#6E637B]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="topic"
                      checked={selectedTopic === t}
                      onChange={() => setSelectedTopic(t)}
                      className="text-[#5B3E8E] focus:ring-[#5B3E8E]"
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2E2438] uppercase tracking-wider mb-2">
                2. Preferred Meeting Format
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedFormat('video')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    selectedFormat === 'video'
                      ? 'border-[#5B3E8E] bg-[#F3EEF9] text-[#5B3E8E] font-semibold'
                      : 'border-[#E8E2EE] hover:bg-gray-50 text-[#6E637B]'
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <span>Secure Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFormat('phone')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    selectedFormat === 'phone'
                      ? 'border-[#5B3E8E] bg-[#F3EEF9] text-[#5B3E8E] font-semibold'
                      : 'border-[#E8E2EE] hover:bg-gray-50 text-[#6E637B]'
                  }`}
                >
                  <Phone className="w-5 h-5" />
                  <span>Phone Call</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFormat('in_office')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    selectedFormat === 'in_office'
                      ? 'border-[#5B3E8E] bg-[#F3EEF9] text-[#5B3E8E] font-semibold'
                      : 'border-[#E8E2EE] hover:bg-gray-50 text-[#6E637B]'
                  }`}
                >
                  <MapPin className="w-5 h-5" />
                  <span>SF Office</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2E2438] uppercase tracking-wider mb-1">
                3. Questions or Documents to Discuss (Optional)
              </label>
              <textarea
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                placeholder="e.g. I have questions regarding Form 1098 mortgage interest vs standard deduction..."
                rows={3}
                className="w-full bg-[#F7F5FA] border border-[#E8E2EE] rounded-xl p-3 text-xs text-[#2E2438] placeholder:text-[#6E637B] focus:outline-none focus:border-[#5B3E8E]"
              />
            </div>
          </div>

          {/* Right Column: Slot Selection & Reserve Button (Col 5) */}
          <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-[#E8E2EE] shadow-sm flex flex-col justify-between">
            <div>
              <label className="block text-xs font-bold text-[#2E2438] uppercase tracking-wider mb-3">
                4. Select Open Slot
              </label>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {availableSlots.map((slot) => (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                      selectedSlotId === slot.id
                        ? 'border-[#C9982F] bg-[#FDF9F0] shadow-xs'
                        : 'border-[#E8E2EE] hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-[#5B3E8E]" />
                      <div>
                        <p className="font-semibold text-[#2E2438]">
                          {new Date(slot.date + 'T00:00:00').toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-[11px] text-[#6E637B] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {slot.time} ({slot.durationMinutes} min)
                        </p>
                      </div>
                    </div>

                    {selectedSlotId === slot.id ? (
                      <span className="text-[10px] bg-[#C9982F] text-[#2E2438] font-bold px-2 py-0.5 rounded">
                        Selected
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#4E9C86] font-semibold">Available</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E8E2EE] space-y-3">
              <button
                onClick={handleConfirmBooking}
                disabled={!selectedSlotId}
                className="w-full bg-[#5B3E8E] hover:bg-[#4C3278] text-white text-xs font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-[#C9982F]" />
                <span>Confirm Calendar Booking</span>
              </button>

              <p className="text-[11px] text-[#6E637B] text-center">
                Syncs directly with practice software and sends SMS confirmation.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
