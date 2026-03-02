const fs = require('fs');
const path = require('path');

const CITA_HTML_PATH = path.join(__dirname, '../../header_menu/git/manuales_usuario/cita.html');

const CitaModel = {
    getAll: () => {
        if (!fs.existsSync(CITA_HTML_PATH)) return [];
        const content = fs.readFileSync(CITA_HTML_PATH, 'utf8');
        const items = [];

        // Regex to match sections and their contents
        const sectionRegex = /<section class="category-section">[\s\S]*?<h3>([\s\S]*?)<\/h3>[\s\S]*?<div class="pdf-grid"([^>]*)>([\s\S]*?)<\/div>\s*<\/section>/g;

        let sectionMatch;
        while ((sectionMatch = sectionRegex.exec(content)) !== null) {
            const categoryHtml = sectionMatch[1].trim();
            // Remove SVG and clean up category name
            const categoryName = categoryHtml.replace(/<svg[\s\S]*?<\/svg>/, '').replace(/&Iacute;/g, 'Í').replace(/&Aacute;/g, 'Á').trim();
            const gridContent = sectionMatch[3];

            const cardRegex = /<a [^>]*class="pdf-folder-card"[^>]*data-id="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g;
            let cardMatch;
            while ((cardMatch = cardRegex.exec(gridContent)) !== null) {
                const id = cardMatch[1];
                const inner = cardMatch[2];
                const nameMatch = /<h4>([\s\S]*?)<\/h4>/.exec(inner);
                const hrefMatch = /href="([^"]*)"/.exec(cardMatch[0]);

                items.push({
                    id: id,
                    name: nameMatch ? nameMatch[1].replace(/&iacute;/g, 'í').replace(/&aacute;/g, 'á').replace(/&uacute;/g, 'ú').trim() : 'Sin nombre',
                    category: categoryName,
                    href: hrefMatch ? hrefMatch[1] : '#'
                });
            }
        }
        return items;
    },

    create: (data) => {
        if (!fs.existsSync(CITA_HTML_PATH)) return null;
        let content = fs.readFileSync(CITA_HTML_PATH, 'utf8');
        const id = Date.now().toString();

        const newItemHtml = `
                    <a href="${data.fileUrl || '#'}" class="pdf-folder-card" data-id="${id}">
                        <div class="file-icon"><svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg></div>
                        <h4>${data.name}</h4>
                        <span class="btn-pdf-download">Descargar PDF</span>
                    </a>`;

        // Map simplified category names from admin to HTML section titles
        const categoryMap = {
            'guias liquidaciones': 'GU&Iacute;AS - LIQUIDACIONES',
            'guias permisos': 'GU&Iacute;AS - PERMISOS Y TR&Aacute;MITES',
            'guias sancionatorias': 'GU&Iacute;AS - SANCIONATORIO',
            'procedimientos permisos': 'PROCEDIMIENTOS - PERMISOS Y TR&Aacute;MITES',
            'procedimientos sancionatorios': 'PROCEDIMIENTOS - SANCIONATORIOS'
        };

        const targetCategory = categoryMap[data.category] || data.category;
        const escapedCategory = targetCategory.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const gridRegex = new RegExp(`(<h3[^>]*>[\\s\\S]*?${escapedCategory}[\\s\\S]*?<\\/h3>[\\s\\S]*?<div [^>]*class="pdf-grid"[^>]*>)`, 'i');

        if (gridRegex.test(content)) {
            content = content.replace(gridRegex, (match) => match + newItemHtml);
            fs.writeFileSync(CITA_HTML_PATH, content, 'utf8');
            return id;
        }
        return null;
    },

    delete: (id) => {
        if (!fs.existsSync(CITA_HTML_PATH)) return false;
        let content = fs.readFileSync(CITA_HTML_PATH, 'utf8');

        // Escapar id para regex
        const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const cardRegex = new RegExp(`<a [^>]*class="pdf-folder-card"[^>]*data-id="${escapedId}"[^>]*>[\\s\\S]*?<\\/a>`, 'g');
        const match = cardRegex.exec(content);

        if (match) {
            const cardHtml = match[0];
            const hrefMatch = /href="([^"]*)"/.exec(cardHtml);

            // Delete physical file
            if (hrefMatch && hrefMatch[1] && hrefMatch[1] !== '#' && !hrefMatch[1].startsWith('http')) {
                let relativePath = hrefMatch[1];
                // Normalizar path (quitar posibles parámetros de consulta si los hubiera)
                relativePath = relativePath.split('?')[0];

                const absolutePath = path.resolve(path.dirname(CITA_HTML_PATH), relativePath);

                try {
                    if (fs.existsSync(absolutePath)) {
                        fs.unlinkSync(absolutePath);
                        console.log(`✅ Archivo eliminado físicamente: ${absolutePath}`);
                    } else {
                        console.warn(`⚠️ El archivo no existe físicamente: ${absolutePath}`);
                    }
                } catch (e) {
                    console.error(`❌ Error al eliminar archivo físico (${absolutePath}):`, e);
                }
            }

            content = content.replace(cardHtml, '');
            fs.writeFileSync(CITA_HTML_PATH, content, 'utf8');
            return true;
        }
        return false;
    }
};

module.exports = CitaModel;
