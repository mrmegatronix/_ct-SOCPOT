import React, { useState } from 'react';
import {
  CircleDollarSign,
  TrendingUp,
  ArrowRight,
  Calculator,
  Sparkles,
  Layers,
  CheckCircle2,
  Filter,
  ExternalLink,
  Target,
} from 'lucide-react';
import { Post, ConversionStage } from '../types';
import { PLATFORM_CONFIG } from '../utils/platformHelpers';

interface FunnelRoiViewProps {
  posts: Post[];
  funnelStages: ConversionStage[];
  totalRevenue: number;
  totalSpent: number;
}

export const FunnelRoiView: React.FC<FunnelRoiViewProps> = ({
  posts,
  funnelStages,
  totalRevenue,
  totalSpent,
}) => {
  // Calculator Interactive State
  const [estImpressions, setEstImpressions] = useState<number>(50000);
  const [estCtr, setEstCtr] = useState<number>(3.5); // %
  const [estConversionRate, setEstConversionRate] = useState<number>(15); // %
  const [avgOrderValue, setAvgOrderValue] = useState<number>(65); // $
  const [postCost, setPostCost] = useState<number>(100); // $

  // Calculated ROI values
  const calcClicks = Math.round(estImpressions * (estCtr / 100));
  const calcConversions = Math.round(calcClicks * (estConversionRate / 100));
  const calcRevenue = calcConversions * avgOrderValue;
  const calcNetProfit = calcRevenue - postCost;
  const calcRoi = postCost > 0 ? Math.round((calcNetProfit / postCost) * 100) : 0;

  const publishedPosts = posts.filter((p) => p.status === 'published' && p.performance);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <CircleDollarSign className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Conversion Funnel & Individual Post ROI</h1>
            <p className="text-xs text-slate-400">
              Trace every social post from initial impression to direct revenue and net return on investment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Global ROI:</span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs">
            +{(totalSpent > 0 ? Math.round(((totalRevenue - totalSpent) / totalSpent) * 100) : 1229)}% Return
          </span>
        </div>
      </div>

      {/* Visual Conversion Funnel Stages */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" /> Multi-Stage Conversion Pipeline
          </h2>
          <span className="text-xs text-slate-400">Attributed across all organic & scheduled channels</span>
        </div>

        {/* Funnel Stage Flow Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {funnelStages.map((stage, idx) => (
            <div
              key={stage.stage}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 relative space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider text-[11px] text-slate-300">
                  Step {idx + 1}: {stage.stage}
                </span>
                {idx < funnelStages.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400 hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-slate-900 rounded-full p-0.5 border border-slate-700" />
                )}
              </div>

              <div className="text-xl font-black text-white">
                {stage.stage === 'Revenue ($)' ? `$${stage.value.toLocaleString()}` : stage.value.toLocaleString()}
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px]">
                {idx === 0 ? (
                  <span className="text-slate-400">Total Audience Reach</span>
                ) : (
                  <span className="text-emerald-400 font-semibold">
                    {stage.conversionRatePercentage}% conversion rate
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Individual Post ROI Leaderboard Table + Interactive ROI Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Individual Post ROI Leaderboard Table */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Individual Post ROI & Performance Table</h3>
              <p className="text-xs text-slate-400">Attributed revenue, cost, and conversion breakdown per post</p>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              UTM Tagged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Post Title</th>
                  <th className="py-2.5 px-3">Platforms</th>
                  <th className="py-2.5 px-3">Viral Score</th>
                  <th className="py-2.5 px-3">Cost ($)</th>
                  <th className="py-2.5 px-3">Revenue ($)</th>
                  <th className="py-2.5 px-3">Net ROI %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {publishedPosts.map((post) => {
                  const perf = post.performance!;
                  return (
                    <tr key={post.id} className="hover:bg-slate-950/60 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white line-clamp-1">{post.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          UTM: {post.utmCampaign || 'organic'}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          {post.platforms.map((p) => {
                            const config = PLATFORM_CONFIG[p];
                            const Icon = config.icon;
                            return <Icon key={p} className={`w-3.5 h-3.5 ${config.color}`} />;
                          })}
                        </div>
                      </td>

                      <td className="py-3 px-3 font-semibold text-indigo-400">
                        {perf.viralScore}/100
                      </td>

                      <td className="py-3 px-3 font-mono text-slate-400">
                        ${perf.estimatedCost}
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                        ${perf.revenue.toLocaleString()}
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                          +{perf.roiPercentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Interactive Predictive Post ROI Calculator */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Predictive Post ROI Calculator</h3>
              <p className="text-xs text-slate-400">Simulate campaign economics before scheduling</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Est. Impressions:</span>
                <span className="text-white font-mono font-bold">{estImpressions.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={5000}
                max={500000}
                step={5000}
                value={estImpressions}
                onChange={(e) => setEstImpressions(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Est. CTR (%):</span>
                <span className="text-white font-mono font-bold">{estCtr}%</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={10}
                step={0.1}
                value={estCtr}
                onChange={(e) => setEstCtr(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Lead Conversion Rate (%):</span>
                <span className="text-white font-mono font-bold">{estConversionRate}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={40}
                step={1}
                value={estConversionRate}
                onChange={(e) => setEstConversionRate(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Avg Order / LTV Value ($):</span>
                <span className="text-white font-mono font-bold">${avgOrderValue}</span>
              </div>
              <input
                type="number"
                value={avgOrderValue}
                onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Content Creation Cost ($):</span>
                <span className="text-white font-mono font-bold">${postCost}</span>
              </div>
              <input
                type="number"
                value={postCost}
                onChange={(e) => setPostCost(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Results Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 pt-3">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Expected Clicks:</span>
              <strong className="text-slate-200">{calcClicks.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Expected Conversions:</span>
              <strong className="text-slate-200">{calcConversions.toLocaleString()}</strong>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Gross Revenue:</span>
              <strong className="text-emerald-400 font-bold">${calcRevenue.toLocaleString()}</strong>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black">
              <span className="text-slate-200">Simulated Net ROI:</span>
              <span className={calcRoi >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                +{calcRoi}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
