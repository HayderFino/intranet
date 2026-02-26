const fs = require('fs');
const path = 'c:/Users/HAYDER/Documents/intranet/intranet/practicas/header_menu/cas/noticas-cas.html';
let content = fs.readFileSync(path, 'utf8');
// Remove the specific news item block
const regex = /<!-- Noticia de Prueba Anterior -->[\s\S]*?<div class="card news-item" data-id="1772133445917">[\s\S]*?<\/div>[\s\S]*?<\/div>/g;
content = content.replace(regex, '');
fs.writeFileSync(path, content);
console.log('Deleted successfully');
