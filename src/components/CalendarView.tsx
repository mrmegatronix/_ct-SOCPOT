import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Clock,
  Sparkles,
  Calendar as CalendarIcon,
  CheckCircle2,
  List,
  Grid,
  Edit3,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Post, Platform, PostStatus } from '../types';
import { PLATFORM_CONFIG, getStatusBadge } from '../utils/platformHelpers';

interface CalendarViewProps {
  posts: Post[];
  onOpenComposer: (prefillDate?: string) => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  posts,
  onOpenComposer,
  onEditPost,
  onDeletePost,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // August 2026
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [previewPost, setPreviewPost] = useState<Post | null>(null);

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const todayMonth = () => {
    setCurrentDate(new Date());
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesPlatform =
      selectedPlatformFilter === 'all' ||
      post.platforms.includes(selectedPlatformFilter as Platform);
    const matchesStatus =
      selectedStatusFilter === 'all' || post.status === selectedStatusFilter;
    return matchesPlatform && matchesStatus;
  });

  // Calculate Days in Month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Map posts by Day of Month
  const postsByDay: Record<number, Post[]> = {};
  filteredPosts.forEach((post) => {
    const dateStr = post.scheduledAt || post.publishedAt;
    if (dateStr) {
      const pDate = new Date(dateStr);
      if (pDate.getFullYear() === year && pDate.getMonth() === month) {
        const dayNum = pDate.getDate();
        if (!postsByDay[dayNum]) postsByDay[dayNum] = [];
        postsByDay[dayNum].push(post);
      }
    }
  });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Calendar Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span>{monthName} {year}</span>
            </h1>
            <p className="text-xs text-slate-400">
              Drag & drop schedule planner with platform preview
            </p>
          </div>
        </div>

        {/* Filters & Navigation Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Platform Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedPlatformFilter}
              onChange={(e) => setSelectedPlatformFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Networks</option>
              {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
                <option key={key} value={key} className="bg-slate-900 text-white">
                  {config.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="queued">Queued Slot</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setViewMode('month')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'month' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Month Grid"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'list' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Month Stepper */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1">
            <button
              onClick={prevMonth}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={todayMonth}
              className="px-2 py-0.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onOpenComposer()}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Schedule</span>
          </button>
        </div>
      </div>

      {/* View Mode: Month Grid */}
      {viewMode === 'month' ? (
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center">
              {dayNames.map((day) => (
                <div key={day} className="py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid Days */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty leading slots */}
              {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[110px] p-2 rounded-2xl bg-slate-950/30 border border-slate-800/40 opacity-40"
                />
              ))}

              {/* Days in Month */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dayPosts = postsByDay[dayNum] || [];
                const isToday =
                  new Date().getDate() === dayNum &&
                  new Date().getMonth() === month &&
                  new Date().getFullYear() === year;

                return (
                  <div
                    key={`day-${dayNum}`}
                    className={`min-h-[110px] p-2 rounded-2xl border transition-all flex flex-col justify-between group relative ${
                      isToday
                        ? 'bg-indigo-950/30 border-indigo-500/50 shadow-inner'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    {/* Day Number Header */}
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                          isToday
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      >
                        {dayNum}
                      </span>

                      {/* Quick Add on hover */}
                      <button
                        onClick={() => {
                          const dateObj = new Date(year, month, dayNum, 10, 0);
                          onOpenComposer(dateObj.toISOString());
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all text-[10px]"
                        title="Add post to this date"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Posts Cards on this day */}
                    <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[120px] custom-scrollbar">
                      {dayPosts.map((post) => (
                        <div
                          key={post.id}
                          onClick={() => setPreviewPost(post)}
                          className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 cursor-pointer text-left transition-all shadow-sm group/card"
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className={`text-[9px] font-bold uppercase px-1 rounded ${getStatusBadge(post.status)}`}>
                              {post.status}
                            </span>
                            <div className="flex items-center gap-0.5">
                              {post.platforms.map((plat) => {
                                const config = PLATFORM_CONFIG[plat];
                                const Icon = config.icon;
                                return (
                                  <Icon key={plat} className={`w-2.5 h-2.5 ${config.color}`} />
                                );
                              })}
                            </div>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-200 line-clamp-1 group-hover/card:text-indigo-300">
                            {post.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* View Mode: List View */
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white mb-2">Scheduled Posts List ({filteredPosts.length})</h3>
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getStatusBadge(post.status)}`}>
                    {post.status}
                  </span>
                  <div className="flex items-center gap-1">
                    {post.platforms.map((plat) => {
                      const config = PLATFORM_CONFIG[plat];
                      const Icon = config.icon;
                      return <Icon key={plat} className={`w-3.5 h-3.5 ${config.color}`} />;
                    })}
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white">{post.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{post.content}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right text-xs text-slate-400 font-mono">
                  {post.scheduledAt
                    ? new Date(post.scheduledAt).toLocaleString()
                    : 'Auto Queue Slot'}
                </div>
                <button
                  onClick={() => onEditPost(post)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeletePost(post.id)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Preview Modal */}
      {previewPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setPreviewPost(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded border ${getStatusBadge(previewPost.status)}`}>
                {previewPost.status}
              </span>
              <div className="flex items-center gap-1">
                {previewPost.platforms.map((plat) => {
                  const config = PLATFORM_CONFIG[plat];
                  const Icon = config.icon;
                  return <Icon key={plat} className={`w-4 h-4 ${config.color}`} />;
                })}
              </div>
            </div>

            <h3 className="text-lg font-bold text-white">{previewPost.title}</h3>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 text-xs whitespace-pre-wrap leading-relaxed">
              {previewPost.content}
            </div>

            {previewPost.media && previewPost.media.length > 0 && (
              <img
                src={previewPost.media[0].url}
                alt="Post Attachment"
                className="w-full h-48 object-cover rounded-2xl border border-slate-800"
              />
            )}

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>
                Scheduled:{' '}
                {previewPost.scheduledAt
                  ? new Date(previewPost.scheduledAt).toLocaleString()
                  : 'Queue Slot'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const p = previewPost;
                    setPreviewPost(null);
                    onEditPost(p);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
