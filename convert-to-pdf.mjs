import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import puppeteer from 'puppeteer';

const markdownPath = path.join(
  process.env.USERPROFILE,
  '.gemini',
  'antigravity',
  'brain',
  '0ffa1f85-340b-4d86-ad6a-0b35ea1f54e5',
  'implementation_plan.md'
);

const outputPath = path.join(
  process.env.USERPROFILE,
  'Desktop',
  'MentorMinds_Implementation_Plan.pdf'
);

async function convertToPDF() {
  try {
    console.log('Reading markdown file...');
    const markdown = fs.readFileSync(markdownPath, 'utf-8');
    
    console.log('Converting markdown to HTML...');
    const html = marked.parse(markdown);
    
    const styledHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      margin: 2cm;
      size: A4;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 100%;
      margin: 0;
      padding: 20px;
    }
    
    h1 {
      color: #059669;
      border-bottom: 3px solid #059669;
      padding-bottom: 10px;
      margin-top: 30px;
      font-size: 32px;
    }
    
    h2 {
      color: #0891b2;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 8px;
      margin-top: 25px;
      font-size: 24px;
    }
    
    h3 {
      color: #4b5563;
      margin-top: 20px;
      font-size: 18px;
    }
    
    h4 {
      color: #6b7280;
      margin-top: 15px;
      font-size: 16px;
    }
    
    code {
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
      color: #dc2626;
    }
    
    pre {
      background: #1f2937;
      color: #f9fafb;
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 15px 0;
    }
    
    pre code {
      background: transparent;
      color: #f9fafb;
      padding: 0;
    }
    
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 15px 0;
    }
    
    th, td {
      border: 1px solid #e5e7eb;
      padding: 10px;
      text-align: left;
    }
    
    th {
      background: #f3f4f6;
      font-weight: 600;
    }
    
    blockquote {
      border-left: 4px solid #059669;
      margin: 15px 0;
      padding: 10px 20px;
      background: #f0fdf4;
      border-radius: 4px;
    }
    
    ul, ol {
      margin: 10px 0;
      padding-left: 30px;
    }
    
    li {
      margin: 5px 0;
    }
    
    a {
      color: #0891b2;
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    .page-break {
      page-break-after: always;
    }
    
    hr {
      border: none;
      border-top: 2px solid #e5e7eb;
      margin: 30px 0;
    }
    
    /* Alert boxes */
    blockquote p:first-child {
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div style="text-align: center; margin-bottom: 40px;">
    <h1 style="border: none; color: #059669; font-size: 42px; margin-bottom: 10px;">MentorMinds</h1>
    <h2 style="border: none; color: #0891b2; font-weight: 400; margin-top: 0;">Payment System Implementation Plan</h2>
    <p style="color: #6b7280; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
  </div>
  ${html}
</body>
</html>
    `;
    
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(styledHTML, { waitUntil: 'networkidle0' });
    
    console.log('Generating PDF...');
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });
    
    await browser.close();
    
    console.log(`\n✅ PDF created successfully!`);
    console.log(`📄 Location: ${outputPath}`);
    console.log(`\nYou can find the PDF on your Desktop.`);
    
  } catch (error) {
    console.error('Error converting to PDF:', error);
    process.exit(1);
  }
}

convertToPDF();
