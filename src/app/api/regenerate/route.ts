import { NextRequest, NextResponse } from 'next/server';
import { regenerateSinglePost } from '@/lib/ai';
import { industryConfigs } from '@/config/industryIntelligence';

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e: any) {
      return NextResponse.json({ error: 'Invalid JSON payload in request body.' }, { status: 400 });
    }
    const { industry, postNumber, date, referenceText, existingCalendar } = body;

    // Server-side validation
    if (!industry || !industryConfigs[industry.toLowerCase()]) {
      return NextResponse.json({ error: 'Unsupported or invalid industry selected.' }, { status: 400 });
    }
    if (typeof postNumber !== 'number') {
      return NextResponse.json({ error: 'Post number must be a valid number.' }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: 'Date is required.' }, { status: 400 });
    }
    if (!Array.isArray(existingCalendar)) {
      return NextResponse.json({ error: 'Existing calendar posts list is required.' }, { status: 400 });
    }

    // Call regeneration helper
    const regeneratedPost = await regenerateSinglePost(
      industry.toLowerCase(),
      postNumber,
      date,
      referenceText || '',
      existingCalendar
    );

    return NextResponse.json(regeneratedPost);
  } catch (error: any) {
    console.error('Single post regeneration API error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during post regeneration.' },
      { status: 500 }
    );
  }
}
export const dynamic = 'force-dynamic';
