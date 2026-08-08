import React from 'react';
import { Platform } from '../types';
import {
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Share2,
  Video,
  Pin,
} from 'lucide-react';

export const PLATFORM_CONFIG: Record<
  Platform,
  {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    borderColor: string;
    maxChars: number;
    badgeBg: string;
  }
> = {
  twitter: {
    name: 'X (Twitter)',
    icon: Twitter,
    color: 'text-sky-500',
    bgColor: 'bg-sky-50 dark:bg-sky-950/40',
    borderColor: 'border-sky-200 dark:border-sky-800',
    maxChars: 280,
    badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  },
  linkedin: {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/40',
    borderColor: 'border-blue-200 dark:border-blue-800',
    maxChars: 3000,
    badgeBg: 'bg-blue-600/10 text-blue-700 dark:text-blue-400',
  },
  instagram: {
    name: 'Instagram',
    icon: Instagram,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 dark:bg-pink-950/40',
    borderColor: 'border-pink-200 dark:border-pink-800',
    maxChars: 2200,
    badgeBg: 'bg-pink-600/10 text-pink-700 dark:text-pink-400',
  },
  tiktok: {
    name: 'TikTok',
    icon: Video,
    color: 'text-slate-900 dark:text-slate-100',
    bgColor: 'bg-slate-100 dark:bg-slate-800/60',
    borderColor: 'border-slate-300 dark:border-slate-700',
    maxChars: 2200,
    badgeBg: 'bg-slate-900/10 text-slate-800 dark:bg-slate-100/10 dark:text-slate-200',
  },
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
    borderColor: 'border-indigo-200 dark:border-indigo-800',
    maxChars: 63206,
    badgeBg: 'bg-indigo-600/10 text-indigo-700 dark:text-indigo-400',
  },
  youtube: {
    name: 'YouTube',
    icon: Youtube,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950/40',
    borderColor: 'border-red-200 dark:border-red-800',
    maxChars: 5000,
    badgeBg: 'bg-red-600/10 text-red-700 dark:text-red-400',
  },
  threads: {
    name: 'Threads',
    icon: Share2,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    maxChars: 500,
    badgeBg: 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400',
  },
  pinterest: {
    name: 'Pinterest',
    icon: Pin,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50 dark:bg-rose-950/40',
    borderColor: 'border-rose-200 dark:border-rose-800',
    maxChars: 500,
    badgeBg: 'bg-rose-600/10 text-rose-700 dark:text-rose-400',
  },
};

export function getStatusBadge(status: string) {
  switch (status) {
    case 'published':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800';
    case 'scheduled':
      return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800';
    case 'queued':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800';
    case 'draft':
      return 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700';
    case 'failed':
      return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}
