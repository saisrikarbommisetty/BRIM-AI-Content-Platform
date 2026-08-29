const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function run() {
  try {
    const dataBuffer = fs.readFileSync('test.pdf');
    console.log('PDF loaded, size:', dataBuffer.length);
    
    const uint8Array = new Uint8Array(dataBuffer);
    const parser = new PDFParse({ data: uint8Array });
    
    console.log('Parsing...');
    const result = await parser.getText();
    console.log('Successfully parsed!');
    console.log('Text length:', result.text.length);
    console.log('Sample text:', result.text.substring(0, 500));
    
    await parser.destroy();
  } catch (err) {
    console.error('Error parsing:', err);
  }
}

run();
