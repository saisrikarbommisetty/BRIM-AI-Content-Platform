import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import AdmZip from 'adm-zip';

export async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(buffer);
    return data.text || '';
  } catch (error: any) {
    console.error('PDF parsing error:', error);
    throw new Error(`Failed to parse PDF: ${error.message || error}`);
  }
}

export async function parseDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  } catch (error: any) {
    console.error('DOCX parsing error:', error);
    throw new Error(`Failed to parse DOCX: ${error.message || error}`);
  }
}

export function parseXlsx(buffer: Buffer): string {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    let text = '';
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      if (csv.trim()) {
        text += `[Sheet: ${sheetName}]\n${csv}\n\n`;
      }
    }
    return text.trim();
  } catch (error: any) {
    console.error('XLSX parsing error:', error);
    throw new Error(`Failed to parse Excel: ${error.message || error}`);
  }
}

export function parsePptx(buffer: Buffer): string {
  try {
    const zip = new AdmZip(buffer);
    const zipEntries = zip.getEntries();
    let text = '';

    const slideEntries = zipEntries
      .filter(entry => entry.entryName.startsWith('ppt/slides/slide') && entry.entryName.endsWith('.xml'))
      .sort((a, b) => {
        const numA = parseInt(a.entryName.replace(/\D/g, '') || '0', 10);
        const numB = parseInt(b.entryName.replace(/\D/g, '') || '0', 10);
        return numA - numB;
      });

    for (const entry of slideEntries) {
      const slideXml = entry.getData().toString('utf8');
      const matches = slideXml.match(/<a:t>([\s\S]*?)<\/a:t>/g);
      if (matches) {
        const slideText = matches.map(m => m.replace(/<a:t>|<\/a:t>/g, '')).join(' ');
        const slideNum = entry.entryName.replace(/\D/g, '') || '0';
        text += `[Slide ${slideNum}]: ${slideText}\n`;
      }
    }
    return text.trim();
  } catch (error: any) {
    console.error('PPTX parsing error:', error);
    throw new Error(`Failed to parse PowerPoint: ${error.message || error}`);
  }
}

export async function parseDocument(
  fileName: string,
  mimeType: string,
  buffer: Buffer
): Promise<{ text: string; isImage: boolean; base64Data?: string }> {
  const extension = fileName.split('.').pop()?.toLowerCase();

  // Handle Text
  if (extension === 'txt' || mimeType === 'text/plain') {
    return { text: buffer.toString('utf8'), isImage: false };
  }

  // Handle PDF
  if (extension === 'pdf' || mimeType === 'application/pdf') {
    const text = await parsePdf(buffer);
    return { text, isImage: false };
  }

  // Handle DOCX / DOC
  if (extension === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const text = await parseDocx(buffer);
    return { text, isImage: false };
  }

  // Handle XLSX / XLS
  if (
    extension === 'xlsx' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    extension === 'xls' ||
    mimeType === 'application/vnd.ms-excel'
  ) {
    const text = parseXlsx(buffer);
    return { text, isImage: false };
  }

  // Handle PPTX / PPT
  if (
    extension === 'pptx' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    extension === 'ppt' ||
    mimeType === 'application/vnd.ms-powerpoint'
  ) {
    const text = parsePptx(buffer);
    return { text, isImage: false };
  }

  // Handle Images
  if (['png', 'jpg', 'jpeg'].includes(extension || '') || mimeType.startsWith('image/')) {
    const base64Data = buffer.toString('base64');
    return {
      text: `[Image File: ${fileName}]`,
      isImage: true,
      base64Data: `data:${mimeType};base64,${base64Data}`
    };
  }

  throw new Error(`Unsupported file format: .${extension} (${mimeType})`);
}
export type ParserType = typeof parseDocument;
