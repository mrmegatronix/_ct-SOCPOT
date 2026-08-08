import React from 'react';
import {
  Plus,
  Sparkles,
  Search,
  Menu,
  Bell,
  Calendar as CalendarIcon,
  Zap,
} from 'lucide-react';
import { SocialChannel } from '../types';
import { PLATFORM_CONFIG } from '../utils/platformHelpers';

interface HeaderProps {
  channels: SocialChannel[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenComposer: () => void;
  onOpenAiGenerator: () => void;
  onToggleMobileMenu: () => void;
  activeView: string;
}

export const Header: React.FC<HeaderProps> = ({
  channels,
  searchQuery,
  setSearchQuery,
  onOpenComposer,
  onOpenAiGenerator,
  onToggleMobileMenu,
  activeView,
}) => {
  const connectedChannels = channels.filter((c) => c.isConnected);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
      {/* Mobile Menu & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
          id="mobile-menu-btn"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-md shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-lg bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-slate-200 to-indigo-300">
                POSTIZ
              </span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Multi-Platform Scheduler & AI Analytics
            </p>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md relative">
        <Search className="w-4 h-4 absolute left-3 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts, campaigns, keywords..."
          className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500/80 rounded-xl pl-9 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
          id="global-search-input"
        />
      </div>

      {/* Connected Channels Summary & Primary CTA Buttons */}
      <div className="flex items-center gap-2.5">
        <div className="hidden xl:flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 rounded-xl px-2.5 py-1">
          <span className="text-xs text-slate-400 mr-1 font-medium">Channels:</span>
          {connectedChannels.map((ch) => {
            const config = PLATFORM_CONFIG[ch.platform];
            const Icon = config.icon;
            return (
              <div
                key={ch.id}
                title={`${ch.name} (${ch.handle}) - ${ch.followers.toLocaleString()} followers`}
                className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center group relative cursor-pointer"
              >
                <Icon className={`w-3.5 h-3.5 ${config.color}`} />
              </div>
            );
          })}
        </div>

        {/* AI Ideas Trigger */}
        <button
          onClick={onOpenAiGenerator}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-purple-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all shadow-sm"
          id="ai-ideas-btn"
        >
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">AI Content Generator</span>
        </button>

        {/* Primary Create Post Button */}
        <button
          onClick={onOpenComposer}
          className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95"
          id="create-post-btn"
        >
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </button>
      </div>
    </header>
  );
};
