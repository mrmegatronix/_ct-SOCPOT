import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Eye,
  MousePointer,
  CircleDollarSign,
  Clock,
  Sparkles,
  Share2,
} from 'lucide-react';
import { OverallAnalytics, PlatformMetric, TimeHeatmapCell } from '../types';
import { PLATFORM_CONFIG } from '../utils/platformHelpers';

interface AnalyticsViewProps {
  analytics: OverallAnalytics;
  platformMetrics: PlatformMetric[];
  engagementTrend: any[];
  timeHeatmap: TimeHeatmapCell[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  analytics,
  platformMetrics,
  engagementTrend,
  timeHeatmap,
}) => {
  const PIE_COLORS = ['#1DA1F2', '#0A66C2', '#E4405F', '#000000', '#1877F2'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Cross-Platform Analytics Suite</h1>
            <p className="text-xs text-slate-400">
              Aggregated performance metrics, engagement trends, and conversion performance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Timeframe:</span>
          <select className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>This Quarter</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Impressions</span>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">{analytics.totalImpressions.toLocaleString()}</div>
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +{analytics.impressionsGrowth}% growth
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Engagements</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{analytics.totalEngagements.toLocaleString()}</div>
          <div className="text-xs text-slate-400">Rate: <span className="text-white font-bold">{analytics.engagementRate}%</span></div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Link Clicks</span>
            <MousePointer className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{analytics.totalClicks.toLocaleString()}</div>
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +{analytics.clicksGrowth}% growth
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Attributed Revenue</span>
            <CircleDollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">${analytics.totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 font-bold">+{analytics.overallRoiPercentage}% Net ROI</div>
        </div>
      </div>

      {/* Main Charts: Engagement Trend & Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Cross-Platform Daily Engagement Trend Line Chart */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Daily Cross-Platform Interactions</h3>
              <p className="text-xs text-slate-400">Engagements breakdown across Twitter, LinkedIn, Instagram, TikTok</p>
            </div>
            <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              Live Feed
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="twitter" name="Twitter/X" stroke="#1DA1F2" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="linkedin" name="LinkedIn" stroke="#0A66C2" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="instagram" name="Instagram" stroke="#E4405F" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="tiktok" name="TikTok" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Platform Revenue Distribution Pie Chart */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Platform Revenue Share</h3>
            <p className="text-xs text-slate-400">Attributed conversions & direct sales by network</p>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformMetrics}
                  dataKey="revenue"
                  nameKey="platform"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {platformMetrics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => `$${Number(val).toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            {platformMetrics.map((pm, idx) => (
              <div key={pm.platform} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                  />
                  <span className="text-slate-300 capitalize">{pm.platform}</span>
                </div>
                <span className="font-bold text-white">${pm.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Comparison Bar Chart & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impressions vs Clicks Bar Chart */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Impressions vs Clicks by Platform</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="platform" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="impressions" name="Impressions" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="clicks" name="Link Clicks" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Optimal Time Engagement Heatmap */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" /> Optimal Audience Heatmap
            </h3>
            <span className="text-xs text-emerald-400 font-medium">AI Calibrated</span>
          </div>

          <p className="text-xs text-slate-400">
            Heatmap score reflects historical follower active windows and post reach potential.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {timeHeatmap.map((cell, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-1"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{cell.day}</span>
                  <span className="font-mono">{cell.hour}:00</span>
                </div>
                <div className="text-base font-extrabold text-emerald-400">
                  {cell.score}% Match
                </div>
                <div className="text-[10px] text-indigo-300 capitalize font-medium">
                  Best for {cell.recommendedPlatform}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
