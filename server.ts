import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import {
  INITIAL_POSTS,
  INITIAL_CHANNELS,
  INITIAL_SLOTS,
  INITIAL_OVERALL_ANALYTICS,
  INITIAL_PLATFORM_METRICS,
  INITIAL_FUNNEL_STAGES,
  DAILY_ENGAGEMENT_TREND,
  TIME_HEATMAP,
} from './src/data/mockData.js';
import { Post, SocialChannel, PostingSlot, Platform } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory persistent state during dev/runtime
let posts: Post[] = [...INITIAL_POSTS];
let channels: SocialChannel[] = [...INITIAL_CHANNELS];
let slots: PostingSlot[] = [...INITIAL_SLOTS];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI Client lazily or with fallbacks
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. AI features will fallback to smart local recommendations.');
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Get Posts
  app.get('/api/posts', (req, res) => {
    res.json({ success: true, posts });
  });

  // Create or Update Post
  app.post('/api/posts', (req, res) => {
    const postData = req.body as Post;
    if (!postData.id) {
      postData.id = 'post-' + Date.now();
      postData.createdAt = new Date().toISOString();
    }
    postData.updatedAt = new Date().toISOString();

    const existingIndex = posts.findIndex((p) => p.id === postData.id);
    if (existingIndex >= 0) {
      posts[existingIndex] = { ...posts[existingIndex], ...postData };
    } else {
      posts.unshift(postData);
    }
    res.json({ success: true, post: postData });
  });

  // Delete Post
  app.delete('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    posts = posts.filter((p) => p.id !== id);
    res.json({ success: true, id });
  });

  // Get Social Channels
  app.get('/api/channels', (req, res) => {
    res.json({ success: true, channels });
  });

  // Toggle Channel Connection
  app.post('/api/channels/toggle', (req, res) => {
    const { id } = req.body;
    channels = channels.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          isConnected: !c.isConnected,
          status: !c.isConnected ? 'active' : 'error',
          lastSyncedAt: new Date().toISOString(),
        };
      }
      return c;
    });
    res.json({ success: true, channels });
  });

  // Get Queue Slots
  app.get('/api/slots', (req, res) => {
    res.json({ success: true, slots });
  });

  // Save/Update Queue Slots
  app.post('/api/slots', (req, res) => {
    const newSlots = req.body as PostingSlot[];
    if (Array.isArray(newSlots)) {
      slots = newSlots;
    }
    res.json({ success: true, slots });
  });

  // Get Analytics Summary
  app.get('/api/analytics', (req, res) => {
    res.json({
      success: true,
      overall: INITIAL_OVERALL_ANALYTICS,
      platformMetrics: INITIAL_PLATFORM_METRICS,
      funnelStages: INITIAL_FUNNEL_STAGES,
      engagementTrend: DAILY_ENGAGEMENT_TREND,
      timeHeatmap: TIME_HEATMAP,
    });
  });

  // AI Endpoint 1: Optimize Post (Generates captions, hashtags, viral score, optimal time recommendation)
  app.post('/api/ai/optimize-post', async (req, res) => {
    const { topic, baseContent, selectedPlatforms } = req.body;
    const ai = getAiClient();

    if (!ai) {
      // Smart offline fallback
      const mockResult = {
        viralScore: 88,
        estimatedReach: 14500,
        suggestedPostingTime: 'Tuesday at 09:15 AM (Peak Match)',
        recommendedHashtags: ['#Growth', '#SaaS', '#AI', '#SocialMedia', '#Marketing2026'],
        platformVariants: {
          twitter: `${baseContent || topic} 🚀\n\nKey takeaways:\n1. Hook early\n2. Add clear CTA\n\nWhat are your thoughts? 👇`,
          linkedin: `${baseContent || topic}\n\nIn our experience building scalable products, timing and platform-specific formatting make a 3x difference in audience reach.\n\nKey pillars:\n• Quality content\n• Consistent automation schedule\n• Direct ROI tracking\n\nHow is your team tackling this?`,
          instagram: `✨ ${baseContent || topic} ✨\n.\n.\n.\n#ContentStrategy #GrowthHacking #DigitalMarketing`,
        },
      };
      return res.json({ success: true, data: mockResult });
    }

    try {
      const prompt = `You are Postiz AI, an expert social media strategist and viral content optimizer.
Analyze and optimize the following social media post input:
Topic/Content: "${baseContent || topic}"
Target Platforms: ${JSON.stringify(selectedPlatforms || ['twitter', 'linkedin', 'instagram'])}

Generate:
1. A viral score (0 to 100) and estimated impression reach.
2. Specific optimal posting time recommendation with reasoning.
3. 5 high-converting hashtags.
4. Platform-tailored caption overrides for each selected platform:
   - twitter: Punchy, short, engaging with bullet points or thread hook.
   - linkedin: Professional narrative style, line breaks for readability, thought-leadership question.
   - instagram: Visual narrative, clean spacing, emoji bullet points.
   - tiktok: High-energy video script hook or short caption.
   - facebook: Informative community tone with link callout.
   - youtube: Video description snippet with timestamp hints.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              viralScore: { type: Type.INTEGER, description: 'Score between 0 and 100' },
              estimatedReach: { type: Type.INTEGER, description: 'Estimated impressions' },
              suggestedPostingTime: { type: Type.STRING, description: 'Recommended day and time e.g., Tuesday at 09:15 AM' },
              recommendedHashtags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              platformVariants: {
                type: Type.OBJECT,
                properties: {
                  twitter: { type: Type.STRING },
                  linkedin: { type: Type.STRING },
                  instagram: { type: Type.STRING },
                  tiktok: { type: Type.STRING },
                  facebook: { type: Type.STRING },
                  youtube: { type: Type.STRING },
                },
              },
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ success: true, data: parsed });
    } catch (err: any) {
      console.error('Gemini post optimization error:', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to run AI post optimization' });
    }
  });

  // AI Endpoint 2: Generate Content Ideas
  app.post('/api/ai/content-ideas', async (req, res) => {
    const { niche, goal } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.json({
        success: true,
        suggestions: [
          {
            ideaTitle: '5 Productivity Hacks for Modern Creators',
            topic: 'Productivity & Automation',
            targetPlatform: 'linkedin',
            suggestedCaption: 'How we save 12 hours a week using automated social queues and predictive posting times...',
            recommendedHashtags: ['#Productivity', '#Automation', '#SaaS'],
            bestPostingTime: 'Mon at 09:00 AM',
            reasoning: 'Monday morning audience is actively seeking efficiency guides.',
            predictedReach: 18500,
            viralScore: 91,
          },
          {
            ideaTitle: 'Behind-The-Scenes Teardown Video',
            topic: 'Product Development',
            targetPlatform: 'tiktok',
            suggestedCaption: 'Watch how we scheduled 30 posts across 6 networks in 3 minutes ⏱️',
            recommendedHashtags: ['#TechTok', '#BuildInPublic', '#DevLife'],
            bestPostingTime: 'Thu at 12:15 PM',
            reasoning: 'Lunchtime video consumption spike on short-form platforms.',
            predictedReach: 32000,
            viralScore: 89,
          },
        ],
      });
    }

    try {
      const prompt = `Generate 4 viral social media post concepts for a business in the "${niche || 'B2B Software & Marketing'}" space focusing on "${goal || 'Lead Generation and Audience Engagement'}".

For each idea include:
- ideaTitle
- topic
- targetPlatform (one of 'twitter', 'linkedin', 'instagram', 'tiktok', 'facebook', 'youtube')
- suggestedCaption
- recommendedHashtags (array of strings)
- bestPostingTime
- reasoning
- predictedReach (integer)
- viralScore (0-100)
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                ideaTitle: { type: Type.STRING },
                topic: { type: Type.STRING },
                targetPlatform: { type: Type.STRING },
                suggestedCaption: { type: Type.STRING },
                recommendedHashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                bestPostingTime: { type: Type.STRING },
                reasoning: { type: Type.STRING },
                predictedReach: { type: Type.INTEGER },
                viralScore: { type: Type.INTEGER },
              },
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || '[]');
      res.json({ success: true, suggestions: parsed });
    } catch (err: any) {
      console.error('Gemini content ideas error:', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to generate ideas' });
    }
  });

  // AI Endpoint 3: Optimal Posting Time Schedule Recommendations
  app.post('/api/ai/optimal-times', async (req, res) => {
    const { targetAudience, industry } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.json({
        success: true,
        data: {
          bestTimeSlots: [
            { dayOfWeek: 'Tuesday', time: '08:30', platform: 'linkedin', expectedEngagementMultiplier: 2.4, reason: 'Morning executive commute reading window.' },
            { dayOfWeek: 'Thursday', time: '12:15', platform: 'tiktok', expectedEngagementMultiplier: 2.1, reason: 'Midday entertainment break.' },
            { dayOfWeek: 'Monday', time: '17:00', platform: 'twitter', expectedEngagementMultiplier: 1.9, reason: 'End of workday news & tech discussion wrap-up.' },
          ],
          audienceActivePeak: 'Tuesdays & Thursdays (8:00 AM - 1:00 PM EST)',
          growthTip: 'Consistency in queue slots drives 35% higher algorithmic retention on LinkedIn and X.',
        },
      });
    }

    try {
      const prompt = `Analyze optimal social media posting schedules for target audience: "${targetAudience || 'Tech Professionals and Marketers'}" in industry: "${industry || 'SaaS & Digital Media'}".
Provide the top 4 posting slots, peak audience activity time window, and a growth strategy tip.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              bestTimeSlots: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dayOfWeek: { type: Type.STRING },
                    time: { type: Type.STRING },
                    platform: { type: Type.STRING },
                    expectedEngagementMultiplier: { type: Type.NUMBER },
                    reason: { type: Type.STRING },
                  },
                },
              },
              audienceActivePeak: { type: Type.STRING },
              growthTip: { type: Type.STRING },
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ success: true, data: parsed });
    } catch (err: any) {
      console.error('Gemini optimal times error:', err);
      res.status(500).json({ success: false, error: err.message || 'Failed to calculate optimal times' });
    }
  });

  // Vite Development / Static Middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Postiz Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
