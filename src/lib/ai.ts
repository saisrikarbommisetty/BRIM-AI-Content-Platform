import { GeneratedCalendar, Post } from '../types';
import { industryConfigs } from '../config/industryIntelligence';
import { generateDemoCalendar, generateDemoSinglePost, getSimulatedDates } from './mockData';

export class GeminiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'GeminiError';
    this.status = status;
  }
}

export function isQuotaError(error: any): boolean {
  if (!error) return false;
  if (error.status === 429) return true;
  const msg = (error.message || '').toLowerCase();
  return (
    msg.includes('429') ||
    msg.includes('resource_exhausted') ||
    msg.includes('resource exhausted') ||
    msg.includes('rate limit') ||
    msg.includes('quota') ||
    msg.includes('exhausted')
  );
}

// Retrieves Gemini API Key securely on the server
function getApiKey(): string | null {
  return process.env.GEMINI_API_KEY || null;
}

// Analyzes image using Gemini Vision API
export async function analyzeImage(imgData: string, mimeType: string): Promise<string> {
  // Support manual/simulated 429 testing
  if (process.env.MOCK_GEMINI_429 === 'true' || (imgData && imgData.includes('FORCE_GEMINI_429'))) {
    throw new GeminiError("MOCK ERROR: Gemini API rate limit exceeded.", 429);
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    console.log("No Gemini API key found, using mock vision analysis.");
    // Wait for 1 second to simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `[Mock Vision Analysis]
Visual Content: Elegant modern branding layout.
Key Colors: Navy blue, gold accents, clean white backgrounds.
Objects: Professional product showcase.
Text detected: "Premium Brand Solutions".
Vibe: High-end, premium, minimalist, target audience is professionals.`;
  }

  let base64Data = imgData;
  let detectedMimeType = mimeType;

  // Extract base64 and mime type if it is a data URL
  const matches = imgData.match(/^data:(image\/[a-z]+);base64,(.+)$/);
  if (matches) {
    detectedMimeType = matches[1];
    base64Data = matches[2];
  }

  const model = "gemini-3.6-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: detectedMimeType,
              data: base64Data
            }
          },
          {
            text: "Analyze this image and describe: 1. Visual elements and style 2. Key products/objects/features shown 3. Color palette and branding elements 4. Visible text/OCR 5. Mood/vibe. Keep the description compact, clear, and focused on helping a social media copywriter generate relevant content."
          }
        ]
      }
    ]
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Gemini Image Analysis API error:", errText);
    throw new GeminiError(`Gemini Image Analysis failed with status ${response.status}: ${errText}`, response.status);
  }

  const result = await response.json();
  const textContent = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textContent) {
    throw new Error("Gemini Image Analysis returned an empty response.");
  }

  return textContent;
}


// System prompt template
const SYSTEM_PROMPT = `You are an elite full-stack social media strategist, brand consultant, and AI copywriter.
Your goal is to generate high-converting, publication-ready content calendars for premium brands.

You must adapt your vocabulary, tone, audience, content pillars, visual direction, and strategy to the selected industry.
You will receive reference materials. You MUST prioritize these materials as your single source of truth.
Do NOT invent locations, configurations, specifications, prices, ingredients, names, claims, or certifications that are not in the reference materials.
If information is missing, write natural captions that focus on general brand storytelling or other aspects without fabricating claims.
Ensure posts are non-repetitive, diverse, and distributed logically across different content pillars.
Your output must match the requested JSON schema EXACTLY. All captions must be clean and ready to publish.
Do NOT return markdown wrapper formatting, only pure JSON.`;

// Build prompt for full calendar generation
function buildCalendarPrompt(
  industry: string,
  duration: string,
  totalPosts: number,
  referenceText: string,
  dates: string[]
): string {
  const config = industryConfigs[industry] || industryConfigs.realestate;
  
  return `
[INDUSTRY CONFIGURATION]
Industry Name: ${config.name}
Audience: ${config.audience.join(', ')}
Tone: ${config.tone.join(', ')}
Key Vocabulary to use: ${config.vocabulary.join(', ')}
Content Pillars:
${config.contentPillars.map(p => `- ${p.name}: ${p.description}`).join('\n')}
Strategic Guidelines:
${config.strategy.map(s => `- ${s}`).join('\n')}
Visual Direction Style: ${config.visualStyle}
Things to AVOID (Strict Rule):
${config.avoid.map(a => `- ${a}`).join('\n')}

[USER CONFIGURATION]
Duration: ${duration}
Number of Posts to generate: ${totalPosts}
Assigned Dates (Use these dates in sequence for postNumber 1 to ${totalPosts}):
${dates.map((d, idx) => `Post ${idx + 1}: ${d}`).join('\n')}

[REFERENCE CONTEXT (Source of Truth)]
${referenceText || "No reference material uploaded. Rely on industry standard concepts, and write engaging posts without making specific claims."}

[INSTRUCTIONS]
Generate ${totalPosts} social media posts.
For each post, decide which Content Pillar it fits, write a highly engaging caption using the industry-specific tone and vocabulary, write a detailed visual direction suitable for a designer or photographer, and generate 4-6 specific hashtags.
Strictly ensure that:
1. Captions are creative, high-quality, and do not repeat patterns.
2. If reference data is available, do not hallucinate details.
3. Distribute the posts evenly among the Content Pillars: ${config.contentPillars.map(p => p.name).join(', ')}.
4. Match the JSON output schema exactly.
`;
}

// REST call to Gemini API
async function callGemini(parts: any[], schema: any): Promise<any> {
  // Support manual/simulated 429 testing
  if (process.env.MOCK_GEMINI_429 === 'true' || parts.some(p => typeof p.text === 'string' && p.text.includes('FORCE_GEMINI_429'))) {
    throw new GeminiError("MOCK ERROR: Gemini API rate limit exceeded.", 429);
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Gemini API key is not configured.");
  }

  // We use gemini-3.6-flash or gemini-2.5-flash
  const model = "gemini-3.6-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: parts
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Gemini API error response:", errText);
    throw new GeminiError(`Gemini API Request failed with status ${response.status}: ${errText}`, response.status);
  }

  const result = await response.json();
  const textContent = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textContent) {
    throw new Error("Gemini API returned an empty response.");
  }

  try {
    return JSON.parse(textContent);
  } catch (error) {
    console.error("Failed to parse JSON from Gemini response:", textContent);
    throw new Error("Gemini API output was not valid JSON matching the schema.");
  }
}

// Scheme for full calendar
const calendarSchema = {
  type: "OBJECT",
  properties: {
    posts: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          postNumber: { type: "INTEGER" },
          date: { type: "STRING" },
          contentPillar: { type: "STRING" },
          caption: { type: "STRING" },
          visualDirection: { type: "STRING" },
          hashtags: {
            type: "ARRAY",
            items: { type: "STRING" }
          }
        },
        required: ["postNumber", "date", "contentPillar", "caption", "visualDirection", "hashtags"]
      }
    }
  },
  required: ["posts"]
};

// Scheme for single post
const singlePostSchema = {
  type: "OBJECT",
  properties: {
    postNumber: { type: "INTEGER" },
    date: { type: "STRING" },
    contentPillar: { type: "STRING" },
    caption: { type: "STRING" },
    visualDirection: { type: "STRING" },
    hashtags: {
      type: "ARRAY",
      items: { type: "STRING" }
    }
  },
  required: ["postNumber", "date", "contentPillar", "caption", "visualDirection", "hashtags"]
};

// Main generator entry point
export async function generateContentCalendar(
  industry: string,
  duration: string,
  referenceText: string,
  images: string[] = [] // Base64 data URIs
): Promise<GeneratedCalendar> {
  const apiKey = getApiKey();
  const isDemoMode = !apiKey;

  if (isDemoMode) {
    console.log("Running in Demo Mode: generating placeholder content...");
    // Artificial delay to make it feel like AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    return generateDemoCalendar(industry, duration, referenceText);
  }

  const count = duration === '1week' ? 3 : duration === '2weeks' ? 6 : 12;
  const dates = getSimulatedDates(count);
  const promptText = buildCalendarPrompt(industry, duration, count, referenceText, dates);

  const parts: any[] = [];

  // Add vision capabilities if images exist
  if (images && images.length > 0) {
    for (const img of images) {
      const matches = img.match(/^data:(image\/[a-z]+);base64,(.+)$/);
      if (matches) {
        parts.push({
          inlineData: {
            mimeType: matches[1],
            data: matches[2]
          }
        });
      }
    }
  }

  // System prompt as first part or separate user prompt
  parts.push({ text: `${SYSTEM_PROMPT}\n\n${promptText}` });

  try {
    const rawResult = await callGemini(parts, calendarSchema);
    
    // Validate response structure
    if (!rawResult || !Array.isArray(rawResult.posts)) {
      throw new Error("Invalid output structure: 'posts' array is missing.");
    }

    const config = industryConfigs[industry] || industryConfigs.realestate;
    const formattedPosts: Post[] = rawResult.posts.map((p: any, index: number) => ({
      postNumber: p.postNumber || index + 1,
      date: p.date || dates[index],
      contentPillar: p.contentPillar || config.contentPillars[index % config.contentPillars.length].name,
      caption: p.caption || "",
      visualDirection: p.visualDirection || "",
      hashtags: Array.isArray(p.hashtags) ? p.hashtags : []
    }));

    return {
      industry: config.name,
      duration: duration === '1week' ? "1 Week" : duration === '2weeks' ? "2 Weeks" : "1 Month",
      totalPosts: count,
      posts: formattedPosts
    };
  } catch (error: any) {
    console.error("AI Calendar Generation Error:", error);
    if (isQuotaError(error)) {
      console.log("Gemini rate limit/quota error hit during calendar generation. Falling back to Demo Mode.");
      const demoCalendar = generateDemoCalendar(industry, duration, referenceText);
      return {
        ...demoCalendar,
        usedQuotaFallback: true
      };
    }
    // In case of any API / structural failure, fallback to Demo Mode rather than crashing
    throw new Error(error.message || "Failed to generate AI calendar.");
  }
}

// Single post regenerator entry point
export async function regenerateSinglePost(
  industry: string,
  postNumber: number,
  date: string,
  referenceText: string,
  existingCalendar: Post[]
): Promise<Post> {
  const apiKey = getApiKey();
  const isDemoMode = !apiKey;

  if (isDemoMode) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const avoidPillars = existingCalendar
      .filter(p => p.postNumber !== postNumber)
      .map(p => p.contentPillar);
    return generateDemoSinglePost(industry, postNumber, date, referenceText, avoidPillars);
  }

  const config = industryConfigs[industry] || industryConfigs.realestate;
  const existingPillars = existingCalendar
    .filter(p => p.postNumber !== postNumber)
    .map(p => `${p.postNumber}: ${p.contentPillar}`);

  const promptText = `
[INDUSTRY CONFIGURATION]
Industry Name: ${config.name}
Audience: ${config.audience.join(', ')}
Tone: ${config.tone.join(', ')}
Key Vocabulary to use: ${config.vocabulary.join(', ')}
Content Pillars:
${config.contentPillars.map(p => `- ${p.name}: ${p.description}`).join('\n')}
Strategic Guidelines:
${config.strategy.map(s => `- ${s}`).join('\n')}
Visual Direction Style: ${config.visualStyle}
Things to AVOID:
${config.avoid.map(a => `- ${a}`).join('\n')}

[USER CONFIGURATION]
Regenerating Post Number: ${postNumber}
Assigned Date: ${date}

[EXISTING CALENDAR (Do NOT duplicate the topics or pillars of these posts if possible):]
${existingPillars.join('\n')}

[REFERENCE CONTEXT (Source of Truth)]
${referenceText || "No reference material uploaded."}

[INSTRUCTIONS]
Generate exactly ONE social media post to replace Post ${postNumber}.
Ensure it fits an underrepresented content pillar from the existing calendar.
Write a fresh, highly engaging caption and visual direction.
Do not duplicate captions, concepts, or exact visuals from other posts in the calendar.
Match the JSON output schema exactly.
`;

  const parts = [
    { text: `${SYSTEM_PROMPT}\n\n${promptText}` }
  ];

  try {
    const rawResult = await callGemini(parts, singlePostSchema);
    return {
      postNumber: rawResult.postNumber || postNumber,
      date: rawResult.date || date,
      contentPillar: rawResult.contentPillar || config.contentPillars[postNumber % config.contentPillars.length].name,
      caption: rawResult.caption || "",
      visualDirection: rawResult.visualDirection || "",
      hashtags: Array.isArray(rawResult.hashtags) ? rawResult.hashtags : []
    };
  } catch (error: any) {
    console.error("AI Single Post Regeneration Error:", error);
    if (isQuotaError(error)) {
      console.log("Gemini rate limit/quota error hit during single post regeneration. Falling back to Demo Mode.");
      const avoidPillars = existingCalendar
        .filter(p => p.postNumber !== postNumber)
        .map(p => p.contentPillar);
      const demoPost = generateDemoSinglePost(industry, postNumber, date, referenceText, avoidPillars);
      return {
        ...demoPost,
        usedQuotaFallback: true
      };
    }
    throw new Error(error.message || "Failed to regenerate single post.");
  }
}
