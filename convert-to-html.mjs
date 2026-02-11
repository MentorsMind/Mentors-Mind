import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

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
  'MentorMinds_Implementation_Plan.html'
);

console.log('Reading markdown file...');
const markdown = fs.readFileSync(markdownPath, 'utf-8');

console.log('Converting markdown to HTML...');
const html = marked.parse(markdown);

const styledHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MentorMinds - Payment System Implementation Plan</title>
  <style>
    @media print {
      @page {
        margin: 2cm;
        size: A4;
      }
      
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      
      .no-print {
        display: none !important;
      }
      
      h1, h2, h3 {
        page-break-after: avoid;
      }
      
      pre, table {
        page-break-inside: avoid;
      }
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.7;
      color: #1f2937;
      background: #f9fafb;
      padding: 0;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 60px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      text-align: center;
      margin-bottom: 50px;
      padding-bottom: 30px;
      border-bottom: 3px solid #059669;
    }
    
    .header h1 {
      color: #059669;
      font-size: 48px;
      font-weight: 800;
      margin-bottom: 10px;
      letter-spacing: -1px;
    }
    
    .header h2 {
      color: #0891b2;
      font-size: 28px;
      font-weight: 400;
      margin-bottom: 15px;
    }
    
    .header .date {
      color: #6b7280;
      font-size: 14px;
      font-weight: 500;
    }
    
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #059669 0%, #0891b2 100%);
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
      transition: all 0.3s ease;
      z-index: 1000;
    }
    
    .print-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(5, 150, 105, 0.4);
    }
    
    .print-button:active {
      transform: translateY(0);
    }
    
    h1 {
      color: #059669;
      border-bottom: 3px solid #059669;
      padding-bottom: 12px;
      margin: 40px 0 20px 0;
      font-size: 36px;
      font-weight: 700;
    }
    
    h2 {
      color: #0891b2;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
      margin: 35px 0 18px 0;
      font-size: 28px;
      font-weight: 600;
    }
    
    h3 {
      color: #374151;
      margin: 28px 0 14px 0;
      font-size: 22px;
      font-weight: 600;
    }
    
    h4 {
      color: #4b5563;
      margin: 22px 0 12px 0;
      font-size: 18px;
      font-weight: 600;
    }
    
    p {
      margin: 12px 0;
      line-height: 1.8;
    }
    
    code {
      background: #f3f4f6;
      padding: 3px 8px;
      border-radius: 4px;
      font-family: 'Courier New', Consolas, monospace;
      font-size: 0.9em;
      color: #dc2626;
      font-weight: 500;
    }
    
    pre {
      background: #1f2937;
      color: #f9fafb;
      padding: 20px;
      border-radius: 10px;
      overflow-x: auto;
      margin: 20px 0;
      border-left: 4px solid #059669;
    }
    
    pre code {
      background: transparent;
      color: #f9fafb;
      padding: 0;
      font-size: 14px;
      line-height: 1.6;
    }
    
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 20px 0;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }
    
    th, td {
      border: 1px solid #e5e7eb;
      padding: 12px 16px;
      text-align: left;
    }
    
    th {
      background: #f9fafb;
      font-weight: 600;
      color: #374151;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    tr:hover {
      background: #f9fafb;
    }
    
    blockquote {
      border-left: 5px solid #059669;
      margin: 20px 0;
      padding: 15px 25px;
      background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
      border-radius: 6px;
      font-style: italic;
    }
    
    blockquote p {
      margin: 8px 0;
    }
    
    blockquote p:first-child {
      font-weight: 700;
      font-style: normal;
      color: #059669;
    }
    
    ul, ol {
      margin: 15px 0;
      padding-left: 35px;
    }
    
    li {
      margin: 8px 0;
      line-height: 1.7;
    }
    
    a {
      color: #0891b2;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    
    a:hover {
      color: #059669;
      text-decoration: underline;
    }
    
    hr {
      border: none;
      border-top: 2px solid #e5e7eb;
      margin: 40px 0;
    }
    
    strong {
      color: #111827;
      font-weight: 600;
    }
    
    em {
      color: #4b5563;
    }
    
    .mermaid {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border: 1px solid #e5e7eb;
    }
    
    /* Alert styles */
    blockquote:has(> p:first-child:contains("IMPORTANT")) {
      background: linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%);
      border-left-color: #f59e0b;
    }
    
    blockquote:has(> p:first-child:contains("WARNING")) {
      background: linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%);
      border-left-color: #ef4444;
    }
    
    blockquote:has(> p:first-child:contains("CAUTION")) {
      background: linear-gradient(135deg, #fecaca 0%, #fee2e2 100%);
      border-left-color: #dc2626;
    }
    
    blockquote:has(> p:first-child:contains("NOTE")) {
      background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
      border-left-color: #3b82f6;
    }
    
    blockquote:has(> p:first-child:contains("TIP")) {
      background: linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%);
      border-left-color: #10b981;
    }
  </style>
</head>
<body>
  <button class="print-button no-print" onclick="window.print()">
    🖨️ Print / Save as PDF
  </button>
  
  <div class="container">
    <div class="header">
      <h1>MentorMinds</h1>
      <h2>Payment System Implementation Plan</h2>
      <p class="date">Generated on ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}</p>
    </div>
    
    ${html}
    
    <hr style="margin-top: 60px;">
    <div style="text-align: center; color: #6b7280; font-size: 14px; padding: 20px 0;">
      <p><strong>MentorMinds Platform</strong></p>
      <p>Connecting Learners with World-Class Mentors</p>
      <p style="margin-top: 10px;">© ${new Date().getFullYear()} MentorMinds. All rights reserved.</p>
    </div>
  </div>
  
  <script>
    // Add print instructions
    console.log('%c📄 To save as PDF:', 'font-size: 16px; font-weight: bold; color: #059669;');
    console.log('%c1. Click the Print button or press Ctrl+P (Cmd+P on Mac)', 'font-size: 14px;');
    console.log('%c2. Select "Save as PDF" as the destination', 'font-size: 14px;');
    console.log('%c3. Click Save', 'font-size: 14px;');
  </script>
</body>
</html>`;

console.log('Writing HTML file...');
fs.writeFileSync(outputPath, styledHTML, 'utf-8');

console.log('\n✅ HTML file created successfully!');
console.log(`📄 Location: ${outputPath}`);
console.log('\n📋 Instructions to convert to PDF:');
console.log('1. Open the HTML file in your browser (it should be on your Desktop)');
console.log('2. Click the "Print / Save as PDF" button or press Ctrl+P');
console.log('3. Select "Save as PDF" or "Microsoft Print to PDF" as the printer');
console.log('4. Click Save and choose where to save your PDF');
console.log('\nThe file will open automatically in your default browser...\n');
