const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'src', 'components', 'confidentialiter', 'terme.html');
const outputPath = path.join(__dirname, '..', 'src', 'components', 'confidentialiter', 'terme.ts');

const html = fs.readFileSync(inputPath, 'utf8');

// Escape backticks and dollar signs for template literal
const escapedHtml = html.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

const content = `export const privacyHtml = \`${escapedHtml}\`;\n`;

fs.writeFileSync(outputPath, content, 'utf8');
console.log("Successfully converted terme.html to terme.ts");
