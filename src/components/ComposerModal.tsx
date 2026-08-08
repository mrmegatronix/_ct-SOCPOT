import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Calendar,
  Clock,
  Send,
  Image as ImageIcon,
  Link,
  Tag,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  Layers,
  Check,
  Zap,
} from 'lucide-react';
import { Post, Platform, PostStatus, PlatformOverride } from '../types';
import { PLATFORM_CONFIG } from '../utils/platformHelpers';

interface ComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePost: (post: Post) => void;
  editingPost?: Post | null;
  prefillDate?: string;
}

export const ComposerModal: React.FC<ComposerModalProps> = ({
  isOpen,
  onClose,
  onSavePost,
  editingPost,
  prefillDate,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([
    'twitter',
    'linkedin',
    'instagram',
  ]);
  const [activePlatformTab, setActivePlatformTab] = useState<Platform>('twitter');
  const [platformOverrides, setPlatformOverrides] = useState<
    Partial<Record<Platform, PlatformOverride>>
  >({});
  const [mediaUrl, setMediaUrl] = useState('');
  const [status, setStatus] = useState<PostStatus>('scheduled');
  const [scheduledAt, setScheduledAt] = useState('');
  const [campaign, setCampaign] = useState('General Campaign');
  const [utmSource, setUtmSource] = useState('social');
  const [utmCampaign, setUtmCampaign] = useState('growth_2026');

  // AI Optimization state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    viralScore?: number;
    estimatedReach?: number;
    suggestedPostingTime?: string;
    recommendedHashtags?: string[];
  } | null>(null);

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
      setSelectedPlatforms(editingPost.platforms);
      setPlatformOverrides(editingPost.platformOverrides || {});
      setMediaUrl(editingPost.media?.[0]?.url || '');
      setStatus(editingPost.status);
      setScheduledAt(editingPost.scheduledAt ? editingPost.scheduledAt.substring(0, 16) : '');
      setCampaign(editingPost.campaign || 'General Campaign');
      setUtmCampaign(editingPost.utmCampaign || 'growth_2026');
    } else {
      setTitle('');
      setContent('');
      setSelectedPlatforms(['twitter', 'linkedin', 'instagram']);
      setPlatformOverrides({});
      setMediaUrl('');
      setStatus('scheduled');
      if (prefillDate) {
        setScheduledAt(new Date(prefillDate).toISOString().substring(0, 16));
      } else {
        const defaultTime = new Date(Date.now() + 86400000); // tomorrow
        defaultTime.setHours(9, 0, 0, 0);
        setScheduledAt(defaultTime.toISOString().substring(0, 16));
      }
      setCampaign('Q3 Launch');
      setUtmCampaign('q3_launch');
    }
  }, [editingPost, prefillDate, isOpen]);

  if (!isOpen) return null;

  const togglePlatform = (p: Platform) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        const updated = selectedPlatforms.filter((item) => item !== p);
        setSelectedPlatforms(updated);
        if (activePlatformTab === p) {
          setActivePlatformTab(updated[0]);
        }
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleAiOptimize = async () => {
    if (!content && !title) return;
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai/optimize-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: title,
          baseContent: content,
          selectedPlatforms,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAiAnalysis({
          viralScore: json.data.viralScore,
          estimatedReach: json.data.estimatedReach,
          suggestedPostingTime: json.data.suggestedPostingTime,
          recommendedHashtags: json.data.recommendedHashtags,
        });

        // Auto-fill platform overrides if generated
        if (json.data.platformVariants) {
          const newOverrides: Partial<Record<Platform, PlatformOverride>> = { ...platformOverrides };
          Object.entries(json.data.platformVariants).forEach(([platKey, variantText]) => {
            const p = platKey as Platform;
            if (selectedPlatforms.includes(p) && typeof variantText === 'string') {
              newOverrides[p] = {
                content: variantText,
                hashtags: json.data.recommendedHashtags || [],
              };
            }
          });
          setPlatformOverrides(newOverrides);
        }
      }
    } catch (err) {
      console.error('Failed to run AI optimize:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSave = () => {
    if (!title) {
      alert('Please enter a title for this post.');
      return;
    }

    const postObj: Post = {
      id: editingPost ? editingPost.id : 'post-' + Date.now(),
      title,
      content,
      platforms: selectedPlatforms,
      platformOverrides,
      media: mediaUrl ? [{ type: 'image', url: mediaUrl }] : [],
      status,
      scheduledAt: status === 'scheduled' ? new Date(scheduledAt).toISOString() : undefined,
      publishedAt: editingPost?.publishedAt,
      campaign,
      utmSource,
      utmMedium: 'social',
      utmCampaign,
      aiSuggestedTime: aiAnalysis?.suggestedPostingTime,
      performance: editingPost?.performance || {
        impressions: 0,
        engagements: 0,
        clicks: 0,
        shares: 0,
        comments: 0,
        likes: 0,
        conversions: 0,
        revenue: 0,
        estimatedCost: 100,
        roiPercentage: 0,
        viralScore: aiAnalysis?.viralScore || 85,
      },
      createdAt: editingPost ? editingPost.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSavePost(postObj);
    onClose();
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  ];

  const currentTabContent = platformOverrides[activePlatformTab]?.content ?? content;
  const activeConfig = PLATFORM_CONFIG[activePlatformTab];
  const isOverCharLimit = currentTabContent.length > activeConfig.maxChars;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {editingPost ? 'Edit Post Schedule' : 'Create Cross-Platform Post'}
              </h2>
              <p className="text-xs text-slate-400">
                Compose, optimize with AI, and dispatch to multiple networks simultaneously.
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Step 1: Select Target Networks */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span>1. Target Social Networks</span>
              <span className="text-[10px] text-slate-500 font-normal">
                ({selectedPlatforms.length} selected)
              </span>
            </label>

            <div className="flex flex-wrap gap-2">
              {Object.entries(PLATFORM_CONFIG).map(([key, config]) => {
                const p = key as Platform;
                const isSelected = selectedPlatforms.includes(p);
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? `${config.bgColor} ${config.borderColor} ${config.color} shadow-sm ring-1 ring-indigo-500/30`
                        : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{config.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Post Title & Base Content */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Post Internal Title & Goal
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q3 Product Roadmap Launch & Teardown Thread"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Base Content + AI Optimization Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Base Caption & Message
                </label>
                <button
                  type="button"
                  onClick={handleAiOptimize}
                  disabled={isAiLoading || (!content && !title)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 via-indigo-500/20 to-purple-500/20 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                  id="composer-ai-optimize-btn"
                >
                  <Sparkles className={`w-4 h-4 text-emerald-400 ${isAiLoading ? 'animate-spin' : ''}`} />
                  <span>{isAiLoading ? 'AI Thinking...' : 'AI Auto-Tailor All Networks'}</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your main announcement or content here. Postiz will auto-format and tailor this text for each platform..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/80 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* AI Insights Card if generated */}
          {aiAnalysis && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-indigo-950/40 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI Predictive Optimization
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Predicted Virality: {aiAnalysis.viralScore}/100
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-1">
                <div>
                  <span className="text-slate-500">Suggested Optimal Time:</span>{' '}
                  <strong className="text-white">{aiAnalysis.suggestedPostingTime}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Estimated Impression Reach:</span>{' '}
                  <strong className="text-emerald-400">
                    ~{aiAnalysis.estimatedReach?.toLocaleString()}
                  </strong>
                </div>
              </div>
              {aiAnalysis.recommendedHashtags && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {aiAnalysis.recommendedHashtags.map((tag, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Platform Overrides Tabs */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Network-Specific Custom Overrides
              </label>
              <span className="text-[11px] text-slate-500">
                Customize formatting per network
              </span>
            </div>

            {/* Platform Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto pb-1">
              {selectedPlatforms.map((p) => {
                const config = PLATFORM_CONFIG[p];
                const Icon = config.icon;
                const isActive = activePlatformTab === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setActivePlatformTab(p)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-xl text-xs font-semibold border-b-2 transition-all ${
                      isActive
                        ? `border-indigo-500 bg-slate-800/80 text-white`
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                    <span>{config.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Override Text Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Editing content for <strong className="text-white">{activeConfig.name}</strong>
                </span>
                <span className={`font-mono font-semibold ${isOverCharLimit ? 'text-red-400 font-bold' : 'text-slate-500'}`}>
                  {currentTabContent.length} / {activeConfig.maxChars} chars
                </span>
              </div>

              <textarea
                rows={3}
                value={platformOverrides[activePlatformTab]?.content ?? content}
                onChange={(e) => {
                  setPlatformOverrides({
                    ...platformOverrides,
                    [activePlatformTab]: {
                      ...(platformOverrides[activePlatformTab] || {}),
                      content: e.target.value,
                    },
                  });
                }}
                className={`w-full bg-slate-950 border rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none ${
                  isOverCharLimit ? 'border-red-500/80 ring-1 ring-red-500/50' : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
              {isOverCharLimit && (
                <p className="text-[11px] text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Exceeds character limit for {activeConfig.name}.
                </p>
              )}
            </div>
          </div>

          {/* Step 4: Media Attachment & Campaign ROI Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            {/* Media Attachment */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-indigo-400" /> Media Attachment URL
              </label>
              <input
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
              />

              {/* Sample Preset Images */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-slate-500">Presets:</span>
                {sampleImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMediaUrl(img)}
                    className="w-8 h-8 rounded-lg border border-slate-800 overflow-hidden hover:opacity-80 transition-opacity"
                  >
                    <img src={img} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign & UTM Tagging for ROI */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-emerald-400" /> Campaign & UTM Attribution
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  placeholder="Campaign Name"
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  placeholder="utm_campaign"
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 5: Schedule Settings */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" /> Dispatch Mode & Schedule Time
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="scheduled"
                  checked={status === 'scheduled'}
                  onChange={() => setStatus('scheduled')}
                  className="accent-indigo-500"
                />
                <span>Pick Specific Date & Time</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="queued"
                  checked={status === 'queued'}
                  onChange={() => setStatus('queued')}
                  className="accent-indigo-500"
                />
                <span className="text-amber-400 font-semibold">Drop in Next Automated Queue Slot</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                  className="accent-indigo-500"
                />
                <span>Save as Draft</span>
              </label>
            </div>

            {status === 'scheduled' && (
              <div className="pt-2">
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isOverCharLimit || !title}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center gap-2 disabled:opacity-50"
            id="composer-save-btn"
          >
            <Send className="w-4 h-4" />
            <span>{editingPost ? 'Update Schedule' : 'Schedule Content'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
