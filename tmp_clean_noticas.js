const fs = require('fs');
const filePath = 'c:/Users/HAYDER/Documents/intranet/intranet/practicas/header_menu/cas/noticas-cas.html';
let content = fs.readFileSync(filePath, 'utf8');

// Regex to remove the "prueba 3" item
const regex = /<!-- Nueva Noticia Automatizada -->[\s\S]*?data-id=\"1772134245848\"[\s\S]*?<\/div>\s*/g;

content = content.replace(regex, '');

fs.writeFileSync(filePath, content);
console.log('noticas-cas.html cleaned');
