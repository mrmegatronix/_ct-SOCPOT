import React, { useState } from 'react';
import {
  Clock,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Layers,
  Zap,
} from 'lucide-react';
import { PostingSlot, Platform } from '../types';
import { PLATFORM_CONFIG } from '../utils/platformHelpers';

interface AutomationSlotsViewProps {
  slots: PostingSlot[];
  onSaveSlots: (slots: PostingSlot[]) => void;
}

export const AutomationSlotsView: React.FC<AutomationSlotsViewProps> = ({
  slots,
  onSaveSlots,
}) => {
  const [slotList, setSlotList] = useState<PostingSlot[]>(slots);
  const [newDay, setNewDay] = useState<number>(1); // Mon
  const [newTime, setNewTime] = useState<string>('09:00');
  const [newLabel, setNewLabel] = useState<string>('Morning Rush');
  const [newPlatform, setNewPlatform] = useState<string>('all');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const toggleSlotActive = (id: string) => {
    const updated = slotList.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
    setSlotList(updated);
    onSaveSlots(updated);
  };

  const removeSlot = (id: string) => {
    const updated = slotList.filter((s) => s.id !== id);
    setSlotList(updated);
    onSaveSlots(updated);
  };

  const addSlot = () => {
    const newSlotObj: PostingSlot = {
      id: 'slot-' + Date.now(),
      dayOfWeek: newDay,
      time: newTime,
      label: newLabel || 'Custom Slot',
      platform: newPlatform !== 'all' ? (newPlatform as Platform) : undefined,
      isAIRecommended: false,
      active: true,
    };
    const updated = [...slotList, newSlotObj];
    setSlotList(updated);
    onSaveSlots(updated);
    setNewLabel('');
  };

  const handleAutoFillAiSlots = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/optimal-times', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetAudience: 'Tech Marketers & Digital Creators',
          industry: 'SaaS & Content Strategy',
        }),
      });
      const json = await res.json();
      if (json.success && json.data?.bestTimeSlots) {
        const dayMap: Record<string, number> = {
          Sunday: 0,
          Monday: 1,
          Tuesday: 2,
          Wednesday: 3,
          Thursday: 4,
          Friday: 5,
          Saturday: 6,
        };

        const aiNewSlots: PostingSlot[] = json.data.bestTimeSlots.map((ts: any, i: number) => ({
          id: 'ai-slot-' + Date.now() + '-' + i,
          dayOfWeek: dayMap[ts.dayOfWeek] ?? 1,
          time: ts.time || '09:00',
          label: `AI Peak (${ts.platform})`,
          platform: ts.platform as Platform,
          isAIRecommended: true,
          active: true,
        }));

        const combined = [...slotList, ...aiNewSlots];
        setSlotList(combined);
        onSaveSlots(combined);
      }
    } catch (err) {
      console.error('Failed to auto fill AI slots:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Automated Queue Time Slots</h1>
            <p className="text-xs text-slate-400">
              Set recurring publishing slots. Drop content into queue without choosing explicit dates every time.
            </p>
          </div>
        </div>

        <button
          onClick={handleAutoFillAiSlots}
          disabled={isAiLoading}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 via-indigo-500/20 to-purple-500/20 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          id="ai-autofill-slots-btn"
        >
          <Sparkles className={`w-4 h-4 text-emerald-400 ${isAiLoading ? 'animate-spin' : ''}`} />
          <span>{isAiLoading ? 'Calculating Peaks...' : 'AI Auto-Fill Optimal Peak Slots'}</span>
        </button>
      </div>

      {/* Add New Slot Control Bar */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-400" /> Add Custom Recurring Slot
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Day of Week */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold">Day</label>
            <select
              value={newDay}
              onChange={(e) => setNewDay(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
            >
              {daysOfWeek.map((day, idx) => (
                <option key={day} value={idx}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* Time */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold">Time (24h)</label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          {/* Label */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold">Label</label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g. Afternoon Peak"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          {/* Platform */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold">Target Network</label>
            <select
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">All Platforms</option>
              {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>

          {/* Add CTA */}
          <div className="flex items-end">
            <button
              onClick={addSlot}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors"
            >
              Add Time Slot
            </button>
          </div>
        </div>
      </div>

      {/* Slots List by Day of Week */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {daysOfWeek.map((dayName, dayIdx) => {
          const daySlots = slotList.filter((s) => s.dayOfWeek === dayIdx);
          return (
            <div key={dayName} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {dayName}
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                  {daySlots.length} Slots
                </span>
              </div>

              {daySlots.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-500 rounded-2xl bg-slate-950 border border-slate-800/60">
                  No recurring queue slots for {dayName}.
                </div>
              ) : (
                <div className="space-y-2">
                  {daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                        slot.active
                          ? 'bg-slate-950 border-slate-800'
                          : 'bg-slate-950/40 border-slate-800/50 opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleSlotActive(slot.id)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            slot.active
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                              : 'bg-slate-900 border-slate-700'
                          }`}
                        >
                          {slot.active && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>

                        <div>
                          <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                            <span>{slot.time}</span>
                            {slot.isAIRecommended && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-sans font-medium flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" /> AI Peak
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {slot.label} {slot.platform ? `(${PLATFORM_CONFIG[slot.platform].name})` : '(All Networks)'}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeSlot(slot.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
