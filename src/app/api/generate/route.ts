import { NextRequest, NextResponse } from 'next/server';
import { generateContentCalendar } from '@/lib/ai';
import { industryConfigs } from '@/config/industryIntelligence';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { industry, duration, referenceText, images } = body;

    // Server-side validation
    if (!industry) {
      return NextResponse.json({ error: 'Industry is required.' }, { status: 400 });
    }
    if (!industryConfigs[industry.toLowerCase()]) {
      return NextResponse.json({ error: 'Unsupported or invalid industry selected.' }, { status: 400 });
    }

    if (!duration) {
      return NextResponse.json({ error: 'Duration is required.' }, { status: 400 });
    }
    if (!['1week', '2weeks', '1month'].includes(duration)) {
      return NextResponse.json({ error: 'Invalid plan duration selected.' }, { status: 400 });
    }

    // Process using AI Generation Service
    const calendar = await generateContentCalendar(
      industry.toLowerCase(),
      duration,
      referenceText || '',
      images || []
    );

    return NextResponse.json(calendar);
  } catch (error: any) {
    console.error('Content generation API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during AI content generation.' },
      { status: 500 }
    );
  }
}
export async function GET() {
  return NextResponse.json({ isDemoMode: !process.env.GEMINI_API_KEY });
}

export const dynamic = 'force-dynamic';
