import { NextRequest, NextResponse } from 'next/server';
import { parseDocument } from '@/lib/documentParser';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Size limit check (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: `File "${file.name}" exceeds the 5MB size limit.` }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Parse document using the extraction pipeline
    const parsed = await parseDocument(file.name, file.type, buffer);

    return NextResponse.json({
      name: file.name,
      type: file.type,
      size: file.size,
      text: parsed.text,
      isImage: parsed.isImage,
      base64Data: parsed.base64Data
    });
  } catch (error: any) {
    console.error('File parsing route error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse the uploaded file.' },
      { status: 500 }
    );
  }
}
export const dynamic = 'force-dynamic';
