import React from 'react';
import {
  TrendingUp,
  Eye,
  MousePointer,
  CircleDollarSign,
  Calendar,
  Clock,
  Sparkles,
  ArrowUpRight,
  Share2,
  CheckCircle2,
  AlertCircle,
  Play,
  Edit2,
  Trash2,
  Send,
} from 'lucide-react';
import { Post, SocialChannel, OverallAnalytics, PostingSlot } from '../types';
import { PLATFORM_CONFIG, getStatusBadge } from '../utils/platformHelpers';

interface DashboardViewProps {
  posts: Post[];
  channels: SocialChannel[];
  analytics: OverallAnalytics;
  slots: PostingSlot[];
  onOpenComposer: () => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (id: string) => void;
  onOpenAiGenerator: () => void;
  onNavigateView: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  posts,
  channels,
  analytics,
  slots,
  onOpenComposer,
  onEditPost,
  onDeletePost,
  onOpenAiGenerator,
  onNavigateView,
}) => {
  const upcomingPosts = posts
    .filter((p) => p.status === 'scheduled' || p.status === 'queued')
    .sort((a, b) => {
      const timeA = a.scheduledAt ? new Date(a.scheduledAt).getTime() : 0;
      const timeB = b.scheduledAt ? new Date(b.scheduledAt).getTime() : 0;
      return timeA - timeB;
    });

  const publishedPosts = posts
    .filter((p) => p.status === 'published')
    .sort((a, b) => (b.performance?.revenue || 0) - (a.performance?.revenue || 0));

  return (
    <div className="space-y-6">
      {/* Welcome Banner + AI Quick Tip */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Optimization Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Cross-Platform Control Center
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Automated posting schedules across 6 primary social networks with real-time conversion tracking & predictive viral reach.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAiGenerator}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Generate Viral Ideas</span>
            </button>
            <button
              onClick={onOpenComposer}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule New Post</span>
            </button>
          </div>
        </div>

        {/* AI Best Time Alert Widget */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Clock className="w-4 h-4" />
            </span>
            <span>
              <strong>AI Optimal Time Slot:</strong> Next peak audience window for LinkedIn is{' '}
              <span className="text-emerald-400 font-semibold">Today at 02:30 PM (98% reach score)</span>.
            </span>
          </div>
          <button
            onClick={() => onNavigateView('slots')}
            className="text-indigo-400 hover:text-indigo-300 font-semibold underline flex items-center gap-1"
          >
            Manage Queue Slots <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Impressions */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Impressions
            </span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-white">
              {analytics.totalImpressions.toLocaleString()}
            </div>
            <div className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <TrendingUp className="w-3 h-3 mr-0.5" />+{analytics.impressionsGrowth}%
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across 6 connected social profiles</p>
        </div>

        {/* Engagement Rate */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Engagement Rate
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-white">
              {analytics.engagementRate}%
            </div>
            <div className="text-xs font-semibold text-slate-400">
              {analytics.totalEngagements.toLocaleString()} total interactions
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">+2.4% vs industry baseline</p>
        </div>

        {/* Total Clicks */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Link Clicks
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <MousePointer className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-white">
              {analytics.totalClicks.toLocaleString()}
            </div>
            <div className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <TrendingUp className="w-3 h-3 mr-0.5" />+{analytics.clicksGrowth}%
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">UTM tracked referral links</p>
        </div>

        {/* Total Revenue & ROI */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Attributed ROI
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl font-extrabold text-white">
              ${analytics.totalRevenue.toLocaleString()}
            </div>
            <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              +{analytics.overallRoiPercentage}% ROI
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {analytics.totalConversions} conversions recorded
          </p>
        </div>
      </div>

      {/* Two Column Layout: Upcoming Posts & Social Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Upcoming Content Queue & Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Upcoming Content Pipeline</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                {upcomingPosts.length} Queued
              </span>
            </div>
            <button
              onClick={() => onNavigateView('calendar')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              Full Calendar View <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {upcomingPosts.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <Clock className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400">No scheduled posts in the upcoming pipeline.</p>
              <button
                onClick={onOpenComposer}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Create First Scheduled Post
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getStatusBadge(post.status)}`}>
                        {post.status}
                      </span>

                      {/* Target Platforms */}
                      <div className="flex items-center gap-1">
                        {post.platforms.map((plat) => {
                          const config = PLATFORM_CONFIG[plat];
                          const Icon = config.icon;
                          return (
                            <span
                              key={plat}
                              title={config.name}
                              className={`p-1 rounded-md bg-slate-950 border border-slate-800 ${config.color}`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </span>
                          );
                        })}
                      </div>

                      {post.campaign && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          #{post.campaign}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {post.content}
                    </p>

                    {post.aiSuggestedTime && (
                      <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium pt-1">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>AI Timing Match: {post.aiSuggestedTime}</span>
                      </div>
                    )}
                  </div>

                  {/* Date & Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                    <div className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>
                        {post.scheduledAt
                          ? new Date(post.scheduledAt).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Next Queue Slot'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditPost(post)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Edit post"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeletePost(post.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Published Top Performers */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Top Revenue-Generating Published Posts
              </h3>
              <button
                onClick={() => onNavigateView('roi')}
                className="text-xs text-indigo-400 hover:underline"
              >
                View Full ROI Table
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {publishedPosts.slice(0, 2).map((post) => (
                <div key={post.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 truncate max-w-[180px]">{post.title}</span>
                    <span className="font-bold text-emerald-400">${post.performance?.revenue.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{post.content}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800">
                    <span>{post.performance?.impressions.toLocaleString()} Impr</span>
                    <span>{post.performance?.conversions} Conversions</span>
                    <span className="text-emerald-400 font-bold">+{post.performance?.roiPercentage}% ROI</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Connected Social Channels & Health */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-emerald-400" /> Social Channels
            </h2>
            <button
              onClick={() => onNavigateView('accounts')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Manage ({channels.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {channels.map((ch) => {
              const config = PLATFORM_CONFIG[ch.platform];
              const Icon = config.icon;
              return (
                <div
                  key={ch.id}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <img
                        src={ch.avatarUrl}
                        alt={ch.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                      />
                      <div className={`absolute -bottom-1 -right-1 p-0.5 rounded-md bg-slate-900 ${config.color}`}>
                        <Icon className="w-3 h-3" />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{ch.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{ch.handle}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-200">
                      {ch.followers.toLocaleString()}
                    </div>
                    <div className="text-[10px] font-semibold text-emerald-400">
                      +{ch.followersGrowth}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Automation Queue Health Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
              <span>Queue Slot Health</span>
              <span className="text-emerald-400">{slots.filter((s) => s.active).length} Active Slots</span>
            </div>
            <p className="text-xs text-slate-400">
              Auto-publishing is enabled. Content dropped into the queue will automatically pick the next optimal time slot.
            </p>
            <button
              onClick={() => onNavigateView('slots')}
              className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-indigo-300 font-semibold border border-slate-700 transition-colors"
            >
              Configure Time Slots
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
