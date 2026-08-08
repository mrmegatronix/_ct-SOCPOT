export type Platform = 'twitter' | 'linkedin' | 'instagram' | 'tiktok' | 'facebook' | 'youtube' | 'threads' | 'pinterest';

export type PostStatus = 'draft' | 'scheduled' | 'queued' | 'published' | 'failed';

export interface PlatformOverride {
  content: string;
  hashtags: string[];
  firstComment?: string;
}

export interface PostMedia {
  type: 'image' | 'video';
  url: string;
  altText?: string;
}

export interface PostPerformance {
  impressions: number;
  engagements: number;
  clicks: number;
  shares: number;
  comments: number;
  likes: number;
  videoViews?: number;
  conversions: number;
  revenue: number;
  estimatedCost: number;
  roiPercentage: number;
  viralScore: number; // 0 - 100
}

export interface Post {
  id: string;
  title: string;
  content: string; // Default base content
  platforms: Platform[];
  platformOverrides?: Partial<Record<Platform, PlatformOverride>>;
  media?: PostMedia[];
  status: PostStatus;
  scheduledAt?: string; // ISO date string
  publishedAt?: string;
  queueSlotId?: string;
  campaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  performance?: PostPerformance;
  aiSuggestedTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialChannel {
  id: string;
  platform: Platform;
  name: string;
  handle: string;
  avatarUrl: string;
  followers: number;
  followersGrowth: number; // percentage growth
  isConnected: boolean;
  status: 'active' | 'reauth_required' | 'error';
  lastSyncedAt: string;
}

export interface PostingSlot {
  id: string;
  dayOfWeek: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  time: string; // HH:mm format e.g. "09:00", "14:30"
  platform?: Platform; // Optional, if slot is specific to a platform
  label?: string; // e.g., "Morning Prime Peak"
  isAIRecommended?: boolean;
  active: boolean;
}

export interface ConversionStage {
  stage: 'Impressions' | 'Clicks' | 'Leads / Signups' | 'Conversions' | 'Revenue ($)';
  value: number;
  conversionRatePercentage: number;
  dropoffRatePercentage: number;
}

export interface OverallAnalytics {
  totalImpressions: number;
  impressionsGrowth: number;
  totalEngagements: number;
  engagementRate: number;
  totalClicks: number;
  clicksGrowth: number;
  totalConversions: number;
  totalRevenue: number;
  totalSpent: number;
  overallRoiPercentage: number;
}

export interface PlatformMetric {
  platform: Platform;
  impressions: number;
  engagements: number;
  clicks: number;
  conversions: number;
  revenue: number;
  followers: number;
  color: string;
}

export interface TimeHeatmapCell {
  day: string; // "Mon", "Tue", etc.
  hour: number; // 0-23
  score: number; // 0-100 optimal engagement score
  recommendedPlatform: Platform;
}

export interface AIContentSuggestion {
  ideaTitle: string;
  topic: string;
  targetPlatform: Platform;
  suggestedCaption: string;
  recommendedHashtags: string[];
  bestPostingTime: string;
  reasoning: string;
  predictedReach: number;
  viralScore: number;
}

export interface AIOptimizedTimesResult {
  bestTimeSlots: {
    dayOfWeek: string;
    time: string;
    platform: Platform;
    expectedEngagementMultiplier: number;
    reason: string;
  }[];
  audienceActivePeak: string;
  growthTip: string;
}
