const fs = require('fs');
const path = require('path');

const htmlPath = 'C:\\Users\\HAYDER\\Videos\\intranet\\practicas\\header_menu\\cas\\convocatorias.html';
const content = fs.readFileSync(htmlPath, 'utf8');

const itemRegex = /<div class="doc-item"[^>]*?data-id="([^"]*)"[^>]*?>([\s\S]*?)<\/a>\s*<\/div>/gi;

let count = 0;
let match;
while ((match = itemRegex.exec(content)) !== null) {
    count++;
}

console.log('Total items found:', count);
if (count === 0) {
    console.log('Regex failed to find items. Checking first 1000 chars of content for doc-item...');
    console.log(content.substring(content.indexOf('id="convocatorias-grid"'), 1500));
}
