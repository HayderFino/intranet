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
    },
    'admin-recursos': {
        htmlPath: path.join(__dirname, '../../header_menu/sgi/admin-recursos.html'),
        dataPath: '../../data/menu header/sgi/procesos misionales/Administración de la Oferta de Recursos Naturales Renovables disponibles, Educación Ambiental y Participación Ciudadana'
    },
    'planeacion-ambiental': {
        htmlPath: path.join(__dirname, '../../header_menu/sgi/planeacion-ambiental.html'),
        dataPath: '../../data/menu header/sgi/procesos misionales/Planeación y Ordenamiento Ambiental'
    },
    'vigilancia-control': {
        htmlPath: path.join(__dirname, '../../header_menu/sgi/vigilancia-control.html'),
        dataPath: '../../data/menu header/sgi/procesos misionales/Vigilancia, Seguimiento y Control Ambiental'
    },
    'control-interno': {
        htmlPath: path.join(__dirname, '../../header_menu/sgi/control-interno.html'),
        dataPath: '../../data/menu header/sgi/Evaluación y Seguimiento/Control interno'
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
                'Gesti&oacute;n': 'Gestión',
                'Procedimientos (PCI)': 'Procedimientos (PCI)',
                'Formatos Institucionales (F-PCI)': 'Formatos Institucionales (F-PCI)',
                'Instructivos de Auditor&iacute;a (I-PCI)': 'Instructivos de Auditoría (I-PCI)',
                'Gesti&oacute;n de Riesgos y Matriz': 'Gestión de Riesgos y Matriz',
                'Anexos y Gu&iacute;as T&eacute;cnicas': 'Anexos y Guías Técnicas'
            };
            const categoryName = reverseCategoryMap[catMatch[1].trim()] || catMatch[1].trim();
            const gridContent = catMatch[2];

            const itemRegex = /<a [^>]*class="file-item"[^>]*>([\s\S]*?)<\/a>/g;
            let itemMatch;
            while ((itemMatch = itemRegex.exec(gridContent)) !== null) {
                const innerHtml = itemMatch[1];
                const tag = itemMatch[0]; // esto solo capturará el contenido si el regex no envuelve la etiqueta <a> completa
                // Ajustamos para capturar la etiqueta completa si es necesario
                const fullItemRegex = /<a [^>]*class="file-item"[^>]*data-id="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g;
                // Re-ejecutamos sobre el grid para más precisión
            }

            // Refactory precision loop
            const itemsInGrid = [...gridContent.matchAll(/<a [^>]*class="file-item"[^>]*data-id="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)];
            itemsInGrid.forEach(match => {
                const id = match[1];
                const inner = match[2];
                const hrefMatch = /href="([^"]*)"/.exec(match[0]);
                const nameMatch = /<div class="file-name">([\s\S]*?)<\/div>/.exec(inner);

                const fileUrl = hrefMatch ? hrefMatch[1] : '#';
                items.push({
                    id: id,
                    href: fileUrl,
                    fileUrl: fileUrl,
                    name: nameMatch ? nameMatch[1].trim() : 'Sin nombre',
                    category: categoryName
                });
            });
        }
        return items;
    },

    create: (section, name, category, fileUrl, existingId = null) => {
        const config = CONFIG[section];
        const id = existingId || Date.now().toString();
        if (!config || !fs.existsSync(config.htmlPath)) return null;

        let content = fs.readFileSync(config.htmlPath, 'utf8');

        // Determinamos el meta basándonos en la categoría
        let meta = "PDF - Documento";
        if (category.toLowerCase().includes("procedimiento")) meta = "PDF - Procedimiento";
        else if (category.toLowerCase().includes("formato")) meta = "PDF - Formato";
        else if (category.toLowerCase().includes("instructivo")) meta = "PDF - Instructivo";
        else if (category.toLowerCase().includes("riesgo") || category.toLowerCase().includes("matriz")) meta = "PDF - Matriz de Riesgos";
        else if (category.toLowerCase().includes("anexo") || category.toLowerCase().includes("guía")) meta = "PDF - Anexo";

        const newItemHtml = `
                    <a href="${fileUrl}" target="_blank" class="file-item" data-id="${id}">
                        <div class="icon"><svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                            </svg></div>
                        <div>
                            <div class="file-name">${name}</div>
                            <div class="file-meta">${meta}</div>
                        </div>
                    </a>`;

        const categoryMap = {
            'Caracterización': 'Caracterizaci&oacute;n',
            'Planeación': 'Planeaci&oacute;n',
            'Evaluación': 'Evaluaci&oacute;n',
            'Gestión': 'Gesti&oacute;n',
            'Procedimientos (PCI)': 'Procedimientos (PCI)',
            'Formatos Institucionales (F-PCI)': 'Formatos Institucionales (F-PCI)',
            'Instructivos de Auditoría (I-PCI)': 'Instructivos de Auditor&iacute;a (I-PCI)',
            'Gestión de Riesgos y Matriz': 'Gesti&oacute;n de Riesgos y Matriz',
            'Anexos y Guías Técnicas': 'Anexos y Gu&iacute;as T&eacute;cnicas'
        };
        const searchCategory = categoryMap[category] || category;

        // Escapar caracteres especiales para el constructor de RegExp (como paréntesis en F-PCI)
        const escapedCategory = searchCategory.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const categoryRegex = new RegExp(`(<h3[^>]*>${escapedCategory}<\\/h3>[\\s\\S]*?<div [^>]*class="file-list-grid"[^>]*>)`, 'i');

        if (categoryRegex.test(content)) {
            content = content.replace(categoryRegex, (match) => match + newItemHtml);
            fs.writeFileSync(config.htmlPath, content, 'utf8');
            return id;
        } else {
            console.error(`Categoría no encontrada en HTML: ${searchCategory}`);
            return null;
        }
    },

    delete: (section, id, deletePhysical = true) => {
        const config = CONFIG[section];
        if (!config || !fs.existsSync(config.htmlPath)) return false;

        let content = fs.readFileSync(config.htmlPath, 'utf8');

        const itemRegex = new RegExp(`<a [^>]*class="file-item"[^>]*data-id="${id}"[^>]*>[\\s\\S]*?<\\/a>`, 'g');
        const match = itemRegex.exec(content);

        if (match) {
            const itemHtml = match[0];

            if (deletePhysical) {
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
            }

            content = content.replace(itemRegex, '');
            fs.writeFileSync(config.htmlPath, content, 'utf8');
            return true;
        }
        return false;
    },

    update: (section, id, name, category, fileUrl) => {
        // Obtenemos el item actual para ver si el archivo ha cambiado
        const items = SgiModel.getAll(section);
        const currentItem = items.find(i => i.id === id);

        // Solo borrar el archivo físico si la URL cambió y no es "#"
        const shouldDeletePhysical = currentItem && currentItem.fileUrl !== fileUrl && currentItem.fileUrl !== '#';

        const deleted = SgiModel.delete(section, id, shouldDeletePhysical);
        if (deleted) {
            return SgiModel.create(section, name, category, fileUrl, id); // Preservamos el ID si es posible o pasamos el nuevo
        }
        return null;
    }
};

module.exports = SgiModel;
