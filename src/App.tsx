import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import { FunnelRoiView } from './components/FunnelRoiView';
import { AutomationSlotsView } from './components/AutomationSlotsView';
import { AccountsView } from './components/AccountsView';
import { ComposerModal } from './components/ComposerModal';
import { AiOptimizationDrawer } from './components/AiOptimizationDrawer';

import {
  Post,
  SocialChannel,
  PostingSlot,
  OverallAnalytics,
  PlatformMetric,
  ConversionStage,
  TimeHeatmapCell,
  AIContentSuggestion,
} from './types';

import {
  INITIAL_POSTS,
  INITIAL_CHANNELS,
  INITIAL_SLOTS,
  INITIAL_OVERALL_ANALYTICS,
  INITIAL_PLATFORM_METRICS,
  INITIAL_FUNNEL_STAGES,
  DAILY_ENGAGEMENT_TREND,
  TIME_HEATMAP,
} from './data/mockData';

export default function App() {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [channels, setChannels] = useState<SocialChannel[]>(INITIAL_CHANNELS);
  const [slots, setSlots] = useState<PostingSlot[]>(INITIAL_SLOTS);
  const [analytics, setAnalytics] = useState<OverallAnalytics>(INITIAL_OVERALL_ANALYTICS);
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetric[]>(INITIAL_PLATFORM_METRICS);
  const [funnelStages, setFunnelStages] = useState<ConversionStage[]>(INITIAL_FUNNEL_STAGES);

  // Modals & Drawers
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [composerPrefillDate, setComposerPrefillDate] = useState<string | undefined>(undefined);
  const [isAiGeneratorOpen, setIsAiGeneratorOpen] = useState(false);

  // Fetch initial data from server on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [postsRes, channelsRes, slotsRes, analyticsRes] = await Promise.all([
          fetch('/api/posts').then((r) => r.json()),
          fetch('/api/channels').then((r) => r.json()),
          fetch('/api/slots').then((r) => r.json()),
          fetch('/api/analytics').then((r) => r.json()),
        ]);

        if (postsRes.success && Array.isArray(postsRes.posts)) {
          setPosts(postsRes.posts);
        }
        if (channelsRes.success && Array.isArray(channelsRes.channels)) {
          setChannels(channelsRes.channels);
        }
        if (slotsRes.success && Array.isArray(slotsRes.slots)) {
          setSlots(slotsRes.slots);
        }
        if (analyticsRes.success) {
          if (analyticsRes.overall) setAnalytics(analyticsRes.overall);
          if (analyticsRes.platformMetrics) setPlatformMetrics(analyticsRes.platformMetrics);
          if (analyticsRes.funnelStages) setFunnelStages(analyticsRes.funnelStages);
        }
      } catch (err) {
        console.warn('Backend server connecting, using robust local state fallbacks.', err);
      }
    }

    loadInitialData();
  }, []);

  // Handlers for post mutations
  const handleSavePost = async (postData: Post) => {
    // Optimistic UI update
    setPosts((prev) => {
      const idx = prev.findIndex((p) => p.id === postData.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = postData;
        return updated;
      }
      return [postData, ...prev];
    });

    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
    } catch (err) {
      console.error('Failed to sync post with server:', err);
    }
  };

  const handleDeletePost = async (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete post on server:', err);
    }
  };

  const handleToggleChannel = async (id: string) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isConnected: !c.isConnected } : c))
    );
    try {
      await fetch('/api/channels/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.error('Failed to toggle channel on server:', err);
    }
  };

  const handleSaveSlots = async (newSlots: PostingSlot[]) => {
    setSlots(newSlots);
    try {
      await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSlots),
      });
    } catch (err) {
      console.error('Failed to save slots on server:', err);
    }
  };

  // Filter posts by global search query
  const filteredPosts = posts.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.campaign?.toLowerCase().includes(q)
    );
  });

  // Calculate post counts
  const postCounts = {
    scheduled: posts.filter((p) => p.status === 'scheduled').length,
    queued: posts.filter((p) => p.status === 'queued').length,
    drafts: posts.filter((p) => p.status === 'draft').length,
  };

  // Handle concept selection from AI generator
  const handleSelectAiConcept = (suggestion: AIContentSuggestion) => {
    setEditingPost(null);
    setComposerPrefillDate(undefined);
    setIsComposerOpen(true);
    // Modal will prefill with AI suggestion when passed
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* App Header */}
      <Header
        channels={channels}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenComposer={() => {
          setEditingPost(null);
          setComposerPrefillDate(undefined);
          setIsComposerOpen(true);
        }}
        onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        activeView={activeView}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          isMobileOpen={isMobileMenuOpen}
          setIsMobileOpen={setIsMobileMenuOpen}
          onOpenComposer={() => {
            setEditingPost(null);
            setComposerPrefillDate(undefined);
            setIsComposerOpen(true);
          }}
          onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
          postCount={postCounts}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar max-w-7xl mx-auto w-full">
          {activeView === 'dashboard' && (
            <DashboardView
              posts={filteredPosts}
              channels={channels}
              analytics={analytics}
              slots={slots}
              onOpenComposer={() => {
                setEditingPost(null);
                setComposerPrefillDate(undefined);
                setIsComposerOpen(true);
              }}
              onEditPost={(p) => {
                setEditingPost(p);
                setIsComposerOpen(true);
              }}
              onDeletePost={handleDeletePost}
              onOpenAiGenerator={() => setIsAiGeneratorOpen(true)}
              onNavigateView={setActiveView}
            />
          )}

          {activeView === 'calendar' && (
            <CalendarView
              posts={filteredPosts}
              onOpenComposer={(prefillDate) => {
                setEditingPost(null);
                setComposerPrefillDate(prefillDate);
                setIsComposerOpen(true);
              }}
              onEditPost={(p) => {
                setEditingPost(p);
                setIsComposerOpen(true);
              }}
              onDeletePost={handleDeletePost}
            />
          )}

          {activeView === 'analytics' && (
            <AnalyticsView
              analytics={analytics}
              platformMetrics={platformMetrics}
              engagementTrend={DAILY_ENGAGEMENT_TREND}
              timeHeatmap={TIME_HEATMAP}
            />
          )}

          {activeView === 'roi' && (
            <FunnelRoiView
              posts={posts}
              funnelStages={funnelStages}
              totalRevenue={analytics.totalRevenue}
              totalSpent={analytics.totalSpent}
            />
          )}

          {activeView === 'slots' && (
            <AutomationSlotsView slots={slots} onSaveSlots={handleSaveSlots} />
          )}

          {activeView === 'accounts' && (
            <AccountsView channels={channels} onToggleChannel={handleToggleChannel} />
          )}
        </main>
      </div>

      {/* Post Composer Modal */}
      <ComposerModal
        isOpen={isComposerOpen}
        onClose={() => {
          setIsComposerOpen(false);
          setEditingPost(null);
        }}
        onSavePost={handleSavePost}
        editingPost={editingPost}
        prefillDate={composerPrefillDate}
      />

      {/* AI Content Generator Drawer */}
      <AiOptimizationDrawer
        isOpen={isAiGeneratorOpen}
        onClose={() => setIsAiGeneratorOpen(false)}
        onSelectSuggestion={handleSelectAiConcept}
      />
    </div>
  );
}
