import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  CircleDollarSign,
  Clock,
  Share2,
  Sparkles,
  PlusCircle,
  HelpCircle,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onOpenComposer: () => void;
  onOpenAiGenerator: () => void;
  postCount: {
    scheduled: number;
    queued: number;
    drafts: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isMobileOpen,
  setIsMobileOpen,
  onOpenComposer,
  onOpenAiGenerator,
  postCount,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'calendar',
      label: 'Schedule Calendar',
      icon: Calendar,
      badge: postCount.scheduled + postCount.queued > 0 ? `${postCount.scheduled + postCount.queued}` : null,
    },
    {
      id: 'analytics',
      label: 'Cross-Platform Analytics',
      icon: BarChart3,
      badge: 'Live',
    },
    {
      id: 'roi',
      label: 'Funnel & Post ROI',
      icon: CircleDollarSign,
      badge: 'PRO',
    },
    {
      id: 'slots',
      label: 'Automated Queues',
      icon: Clock,
      badge: null,
    },
    {
      id: 'accounts',
      label: 'Social Profiles',
      icon: Share2,
      badge: null,
    },
  ];

  const handleNavClick = (id: string) => {
    setActiveView(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-[57px] left-0 z-40 w-64 h-full lg:h-[calc(100vh-57px)] bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Quick Create Action Card inside Sidebar */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/20 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Content Engine
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                Auto
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Schedule & cross-publish to 6 networks in one click.
            </p>
            <button
              onClick={() => {
                onOpenComposer();
                setIsMobileOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
              id="sidebar-create-btn"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Compose Post</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  id={`nav-item-${item.id}`}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.badge === 'PRO'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : item.badge === 'Live'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                          : 'bg-indigo-500/20 text-indigo-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Automation & Quick Stats */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Queue Status</span>
              <Layers className="w-3.5 h-3.5 text-slate-500" />
            </div>

            <div className="grid grid-cols-2 gap-2 px-1">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                <div className="text-sm font-bold text-indigo-400">{postCount.scheduled}</div>
                <div className="text-[10px] text-slate-400">Scheduled</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                <div className="text-sm font-bold text-amber-400">{postCount.queued}</div>
                <div className="text-[10px] text-slate-400">In Queue Slot</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info & AI Assistant Trigger */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <button
            onClick={() => {
              onOpenAiGenerator();
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40 transition-colors"
            id="sidebar-ai-assistant"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="truncate">AI Strategy & Times</span>
          </button>

          <div className="flex items-center justify-between px-2 text-[11px] text-slate-500">
            <span>Postiz Engine v2.4</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Connected
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
