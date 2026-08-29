// Polyfill DOMMatrix for PDF parsing in Next.js environment
const g = (typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : {}) as any;
if (!g.DOMMatrix) {
  g.DOMMatrix = class DOMMatrix {};
}
if (typeof global !== 'undefined' && !global.DOMMatrix) {
  (global as any).DOMMatrix = g.DOMMatrix;
}

import { NextRequest, NextResponse } from 'next/server';
import { parseDocument } from '@/lib/documentParser';
import { analyzeImage, isQuotaError } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    let formData;
    try {
      formData = await req.formData();
    } catch (e: any) {
      return NextResponse.json({ error: 'Invalid form data or no file sent.' }, { status: 400 });
    }

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

    let text = parsed.text;
    let usedQuotaFallback = false;
    if (parsed.isImage && parsed.base64Data) {
      try {
        const visualDescription = await analyzeImage(parsed.base64Data, file.type);
        text = `[Image Analysis for: ${file.name}]\n${visualDescription}`;
      } catch (err: any) {
        console.error('Image visual analysis error:', err);
        if (isQuotaError(err)) {
          usedQuotaFallback = true;
          const mockDescription = `[Mock Vision Analysis]
Visual Content: Elegant modern branding layout.
Key Colors: Navy blue, gold accents, clean white backgrounds.
Objects: Professional product showcase.
Text detected: "Premium Brand Solutions".
Vibe: High-end, premium, minimalist, target audience is professionals.`;
          text = `[Image Analysis for: ${file.name}]\n${mockDescription}`;
        } else {
          text = `[Image File: ${file.name}] (Visual analysis failed: ${err.message || err})`;
        }
      }
    }

    return NextResponse.json({
      name: file.name,
      type: file.type,
      size: file.size,
      text: text,
      isImage: parsed.isImage,
      base64Data: parsed.base64Data,
      usedQuotaFallback: usedQuotaFallback
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

