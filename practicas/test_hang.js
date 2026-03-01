const path = require('path');
const fs = require('fs');

const CONFIG = {
    'control-interno': {
        htmlPath: path.join(__dirname, 'header_menu/sgi/control-interno.html'),
        dataPath: '../../data/menu header/sgi/Evaluación y Seguimiento/Control interno'
    }
};

const reverseCategoryMap = {
    'Caracterizaci&oacute;n': 'Caracterización',
    'Planeaci&oacute;n': 'Planeación',
    'Evaluaci&oacute;n': 'Evaluación',
    'Gesti&oacute;n': 'Gestión',
    'Instructivos de Auditor&iacute;a (I-PCI)': 'Instructivos de Auditoría (I-PCI)',
    'Gesti&oacute;n de Riesgos y Matriz': 'Gestión de Riesgos y Matriz',
    'Anexos y Gu&iacute;as T&eacute;cnicas': 'Anexos y Guías Técnicas'
};

function getAll(section) {
    console.log('Starting getAll for', section);
    const config = CONFIG[section];
    if (!config || !fs.existsSync(config.htmlPath)) return [];

    const html = fs.readFileSync(config.htmlPath, 'utf8');
    const items = [];
    const categoryRegex = /<section class="category-section">[\s\S]*?<h3>(.*?)<\/h3>[\s\S]*?<div class="file-list-grid">([\s\S]*?)<\/div>\s*<\/section>/g;
    let catMatch;

    while ((catMatch = categoryRegex.exec(html)) !== null) {
        console.log('Found category match:', catMatch[1]);
        const categoryName = reverseCategoryMap[catMatch[1].trim()] || catMatch[1].trim();
        const gridContent = catMatch[2];
        const itemRegex = /<a [^>]*class="file-item"[^>]*>[\s\S]*?<\/a>/g;
        let itemMatch;

        while ((itemMatch = itemRegex.exec(gridContent)) !== null) {
            const tag = itemMatch[0];
            const idMatch = /data-id="(.*?)"/.exec(tag);
            if (idMatch) {
                console.log('Found item:', idMatch[1]);
            }
        }
    }
    console.log('Done');
    return items;
}

getAll('control-interno');
