// Instructions for Adding True Montserrat Font to jsPDF

/*
OPTION 1: Using jsPDF with built-in modern fonts (Current Implementation)
- Uses Helvetica which is very similar to Montserrat
- Clean, modern appearance
- No additional setup required
- Works immediately

OPTION 2: Adding True Montserrat Font (Advanced)
To add true Montserrat font support to jsPDF, follow these steps:

1. Download Montserrat TTF files from Google Fonts:
   - Montserrat-Regular.ttf
   - Montserrat-Bold.ttf

2. Convert TTF to Base64 (required for jsPDF):
   You can use online tools like:
   - https://base64.guru/converter/encode/file
   - Or use a Node.js script to convert

3. Install font conversion tool:
   npm install jspdf-font-converter --save-dev

4. Convert and add fonts to your project:
   
   // Create a fonts directory: src/lib/pdf/fonts/
   // Add montserrat-normal.js and montserrat-bold.js

5. Import and register fonts in your PDF generator:

   import { jsPDF } from 'jspdf';
   // Import font files
   import montserratNormal from './fonts/montserrat-normal.js';
   import montserratBold from './fonts/montserrat-bold.js';

   // In your buildInvoicePdf function:
   const doc = new jsPDF();
   
   // Register fonts
   doc.addFileToVFS('Montserrat-Regular.ttf', montserratNormal);
   doc.addFont('Montserrat-Regular.ttf', 'Montserrat', 'normal');
   
   doc.addFileToVFS('Montserrat-Bold.ttf', montserratBold);
   doc.addFont('Montserrat-Bold.ttf', 'Montserrat', 'bold');

   // Then use: doc.setFont('Montserrat', 'normal');

OPTION 3: Using HTML to PDF (Alternative)
If you need exact font control, consider using:
- puppeteer (for server-side rendering)
- html2pdf.js (for client-side)
- react-pdf (for React components)

This allows you to use CSS fonts including Google Fonts directly.

CURRENT RECOMMENDATION:
The current implementation uses Helvetica, which provides:
- Clean, modern appearance similar to Montserrat
- Excellent readability
- Professional look
- No additional setup or dependencies
- Faster PDF generation
*/

export const fontGuide = {
  currentApproach: "Using Helvetica as Montserrat alternative",
  benefits: [
    "Clean, modern typography",
    "Excellent readability", 
    "Professional appearance",
    "Fast PDF generation",
    "No external dependencies"
  ],
  customization: {
    colors: "Full hex color support",
    sizes: "Precise font sizing",
    weights: "Normal and bold variants",
    spacing: "Controlled line and character spacing"
  }
};