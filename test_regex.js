const path = require('path');
const fs = require('fs');

const CONFIG = {
    'control-interno': {
        htmlPath: path.resolve(__dirname, 'practicas/header_menu/sgi/control-interno.html'),
        dataPath: '../../data/menu header/sgi/Evaluación y Seguimiento/Control interno'
    }
};

const getAll = (section = 'control-interno') => {
    const config = CONFIG[section];
    if (!config || !fs.existsSync(config.htmlPath)) return { error: 'File not found', path: config.htmlPath };

    const content = fs.readFileSync(config.htmlPath, 'utf8');
    const items = [];

    const categoryRegex = /<section class="category-section">[\s\S]*?<h3>(.*?)<\/h3>[\s\S]*?<div class="file-list-grid">([\s\S]*?)<\/div>\s*<\/section>/g;

    let catMatch;
    let iterations = 0;
    while ((catMatch = categoryRegex.exec(content)) !== null) {
        iterations++;
        const categoryName = catMatch[1].trim();
        const gridContent = catMatch[2];

        const itemRegex = /<a [^>]*class="file-item"[^>]*>[\s\S]*?<\/a>/g;
        let itemMatch;
        while ((itemMatch = itemRegex.exec(gridContent)) !== null) {
            const tag = itemMatch[0];
            const hrefMatch = /href="([^"]*)"/.exec(tag);
            const idMatch = /data-id="([^"]*)"/.exec(tag);
            const nameMatch = /<div class="file-name">([\s\S]*?)<\/div>/.exec(tag);

            if (idMatch) {
                items.push({
                    id: idMatch[1],
                    name: nameMatch ? nameMatch[1].trim() : 'Sin nombre',
                    category: categoryName
                });
            }
        }
    }
    return { count: items.length, iterations, items };
};

console.log(JSON.stringify(getAll(), null, 2));
