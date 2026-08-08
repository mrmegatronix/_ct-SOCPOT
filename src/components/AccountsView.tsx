import React from 'react';
import {
  Share2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Radio,
  Users,
  TrendingUp,
} from 'lucide-react';
import { SocialChannel } from '../types';
import { PLATFORM_CONFIG } from '../utils/platformHelpers';

interface AccountsViewProps {
  channels: SocialChannel[];
  onToggleChannel: (id: string) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  channels,
  onToggleChannel,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Connected Social Networks</h1>
            <p className="text-xs text-slate-400">
              Manage multi-platform OAuth credentials, real-time sync health, and follower metrics
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('Postiz integrates with standard OAuth webhooks for X, LinkedIn, Instagram, TikTok, Facebook, YouTube, Threads, and Pinterest.')}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Connect New Profile</span>
        </button>
      </div>

      {/* Grid of Social Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((ch) => {
          const config = PLATFORM_CONFIG[ch.platform];
          const Icon = config.icon;

          return (
            <div
              key={ch.id}
              className={`p-5 rounded-3xl border transition-all space-y-4 ${
                ch.isConnected
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-md'
                  : 'bg-slate-950/60 border-slate-800/60 opacity-60'
              }`}
            >
              {/* Top Profile Card */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={ch.avatarUrl}
                      alt={ch.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
                    />
                    <div className={`absolute -bottom-1 -right-1 p-1 rounded-lg bg-slate-900 ${config.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{ch.name}</span>
                    </h3>
                    <p className="text-xs text-slate-400">{ch.handle}</p>
                  </div>
                </div>

                {/* Connection Pill */}
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      ch.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase ${
                      ch.isConnected ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {ch.isConnected ? 'Connected' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
                    <Users className="w-3 h-3 text-indigo-400" /> Followers
                  </div>
                  <div className="font-extrabold text-white text-sm">
                    {ch.followers.toLocaleString()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1 justify-end">
                    <TrendingUp className="w-3 h-3 text-emerald-400" /> Growth
                  </div>
                  <div className="font-extrabold text-emerald-400 text-sm">
                    +{ch.followersGrowth}%
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[10px] text-slate-500">
                  Synced: {new Date(ch.lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>

                <button
                  onClick={() => onToggleChannel(ch.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    ch.isConnected
                      ? 'bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-400 border border-slate-700'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {ch.isConnected ? 'Disconnect' : 'Reconnect'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
