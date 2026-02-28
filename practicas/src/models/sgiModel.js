const fs = require('fs');
const path = require('path');

const CONFIG = {
    'planeacion': {
        htmlPath: path.join(__dirname, '../../header_menu/sgi/planeacion-estrategica.html'),
        dataPath: '../../data/menu header/sgi/Procesos Estratégicos/Planeación Estratégica'
    },
    'mejora': {
        htmlPath: path.join(__dirname, '../../header_menu/sgi/mejora-continua.html'),
        dataPath: '../../data/menu header/sgi/Procesos Estratégicos/mejora continua'
    }
};

const SgiModel = {
    getAll: (section = 'planeacion') => {
        const config = CONFIG[section];
        if (!config || !fs.existsSync(config.htmlPath)) return [];

        const content = fs.readFileSync(config.htmlPath, 'utf8');
        const items = [];

        const categoryRegex = /<section class="category-section">[\s\S]*?<h3>(.*?)<\/h3>[\s\S]*?<div class="file-list-grid">([\s\S]*?)<\/div>\s*<\/section>/g;

        let catMatch;
        while ((catMatch = categoryRegex.exec(content)) !== null) {
            // Mapeo inverso para mostrar nombres limpios en el admin
            const reverseCategoryMap = {
                'Caracterizaci&oacute;n': 'Caracterización',
                'Planeaci&oacute;n': 'Planeación',
                'Evaluaci&oacute;n': 'Evaluación',
                'Gesti&oacute;n': 'Gestión'
            };
            const categoryName = reverseCategoryMap[catMatch[1].trim()] || catMatch[1].trim();
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
                        href: hrefMatch ? hrefMatch[1] : '#',
                        name: nameMatch ? nameMatch[1].trim() : 'Sin nombre',
                        category: categoryName
                    });
                }
            }
        }
        return items;
    },

    create: (section, name, category, fileUrl) => {
        const config = CONFIG[section];
        const id = Date.now().toString();
        if (!config || !fs.existsSync(config.htmlPath)) return null;

        let content = fs.readFileSync(config.htmlPath, 'utf8');

        const newItemHtml = `
                    <a href="${fileUrl}" target="_blank" class="file-item" data-id="${id}">
                        <div class="icon"><svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                            </svg></div>
                        <div class="file-name">${name}</div>
                    </a>`;

        // Mapeo para buscar en el HTML (con entidades)
        const categoryMap = {
            'Caracterización': 'Caracterizaci&oacute;n',
            'Planeación': 'Planeaci&oacute;n',
            'Evaluación': 'Evaluaci&oacute;n',
            'Gestión': 'Gesti&oacute;n'
        };
        const searchCategory = categoryMap[category] || category;

        // Búsqueda insensible a mayúsculas para mayor flexibilidad
        const categoryRegex = new RegExp(`(<h3[^>]*>${searchCategory}<\\/h3>[\\s\\S]*?<div [^>]*class="file-list-grid"[^>]*>)`, 'i');

        if (categoryRegex.test(content)) {
            content = content.replace(categoryRegex, (match) => match + newItemHtml);
            fs.writeFileSync(config.htmlPath, content, 'utf8');
            return id;
        } else {
            console.error(`Categoría no encontrada en HTML: ${searchCategory}`);
            return null;
        }
    },

    delete: (section, id) => {
        const config = CONFIG[section];
        if (!config || !fs.existsSync(config.htmlPath)) return false;

        let content = fs.readFileSync(config.htmlPath, 'utf8');

        const itemRegex = new RegExp(`<a [^>]*class="file-item"[^>]*data-id="${id}"[^>]*>[\\s\\S]*?<\\/a>`, 'g');
        const match = itemRegex.exec(content);

        if (match) {
            const itemHtml = match[0];
            const hrefMatch = /href="([^"]*)"/.exec(itemHtml);

            if (hrefMatch && hrefMatch[1] && hrefMatch[1] !== '#') {
                const relativePath = hrefMatch[1];
                const absolutePath = path.resolve(path.dirname(config.htmlPath), relativePath);

                try {
                    if (fs.existsSync(absolutePath)) {
                        fs.unlinkSync(absolutePath);
                    }
                } catch (err) {
                    console.error(`Error al eliminar archivo físico: ${err.message}`);
                }
            }

            content = content.replace(itemRegex, '');
            fs.writeFileSync(config.htmlPath, content, 'utf8');
            return true;
        }
        return false;
    },

    update: (section, id, name, category, fileUrl) => {
        const deleted = SgiModel.delete(section, id);
        if (deleted) {
            return SgiModel.create(section, name, category, fileUrl);
        }
        return null;
    }
};

module.exports = SgiModel;
