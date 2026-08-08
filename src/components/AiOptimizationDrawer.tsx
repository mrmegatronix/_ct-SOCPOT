import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Zap,
  TrendingUp,
  Clock,
  ArrowRight,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { AIContentSuggestion, Platform } from '../types';
import { PLATFORM_CONFIG } from '../utils/platformHelpers';

interface AiOptimizationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSuggestion: (suggestion: AIContentSuggestion) => void;
}

export const AiOptimizationDrawer: React.FC<AiOptimizationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectSuggestion,
}) => {
  const [niche, setNiche] = useState('B2B SaaS & Tech Growth');
  const [goal, setGoal] = useState('Lead Generation & Audience Engagement');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AIContentSuggestion[]>([]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/content-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, goal }),
      });
      const json = await res.json();
      if (json.success && json.suggestions) {
        setSuggestions(json.suggestions);
      }
    } catch (err) {
      console.error('Failed to generate content ideas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-500 text-slate-950">
              <Sparkles className="w-5 h-5 text-white animate-spin" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AI Viral Content Generator</h2>
              <p className="text-xs text-slate-400">
                Powered by Gemini 3.6 Flash — Predicts viral potential, best posting times, and multi-network captions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Controls */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold">Niche / Industry</label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g. FinTech, E-Commerce, Creator Economy"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold">Campaign Goal</label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Lead Generation, Brand Awareness"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-indigo-600 to-indigo-500 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              id="ai-generate-ideas-btn"
            >
              <Zap className={`w-4 h-4 ${isLoading ? 'animate-bounce' : ''}`} />
              <span>{isLoading ? 'Gemini AI Brainstorming...' : 'Generate High-Converting Concepts'}</span>
            </button>
          </div>

          {/* Ideas Results */}
          {suggestions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" /> Suggested Concepts ({suggestions.length})
              </h3>

              <div className="grid grid-cols-1 gap-4">
                {suggestions.map((item, idx) => {
                  const platConfig = PLATFORM_CONFIG[item.targetPlatform || 'linkedin'];
                  const Icon = platConfig?.icon || Sparkles;

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 space-y-3 transition-all group"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`p-1 rounded-md bg-slate-900 border border-slate-800 ${platConfig?.color}`}>
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className="text-xs font-bold text-white">{item.ideaTitle}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Viral Score: {item.viralScore}/100
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            Est. Reach: ~{item.predictedReach?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {item.suggestedCaption}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{item.bestPostingTime}</span>
                        </div>

                        <button
                          onClick={() => {
                            onSelectSuggestion(item);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                        >
                          <span>Use in Post Composer</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
