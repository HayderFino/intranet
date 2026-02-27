const fs = require('fs');
const path = require('path');

const planeacionPath = path.join(__dirname, '../../header_menu/sgi/planeacion-estrategica.html');

const SgiModel = {
    getAll: () => {
        if (!fs.existsSync(planeacionPath)) return [];
        const content = fs.readFileSync(planeacionPath, 'utf8');
        const items = [];

        // Regex para capturar items con su categoría
        // Buscamos secciones de categoría y luego sus items
        const categoryRegex = /<section class="category-section">[\s\S]*?<h3>(.*?)<\/h3>[\s\S]*?<div class="file-list-grid">([\s\S]*?)<\/div>[\s\S]*?<\/section>/g;

        let catMatch;
        while ((catMatch = categoryRegex.exec(content)) !== null) {
            const reverseCategoryMap = {
                'Caracterizaci&oacute;n': 'Caracterización',
                'Mejora Continua': 'Mejora Continua'
            };
            const categoryName = reverseCategoryMap[catMatch[1].trim()] || catMatch[1].trim();
            const gridContent = catMatch[2];

            const itemRegex = /<a [^>]*href="([^"]*)"[^>]*class="file-item"[^>]*data-id="([^"]*)"[^>]*>[\s\S]*?<div class="file-name">([\s\S]*?)<\/div>[\s\S]*?<\/a>/g;
            let itemMatch;
            while ((itemMatch = itemRegex.exec(gridContent)) !== null) {
                items.push({
                    id: itemMatch[2],
                    href: itemMatch[1],
                    name: itemMatch[3].trim(),
                    category: categoryName
                });
            }
        }
        return items;
    },

    create: (name, category, fileUrl) => {
        const id = Date.now().toString();
        if (!fs.existsSync(planeacionPath)) return null;

        let content = fs.readFileSync(planeacionPath, 'utf8');

        // El HTML que inyectaremos (siguiendo el estilo original)
        const newItemHtml = `
                    <a href="${fileUrl}" target="_blank" class="file-item" data-id="${id}">
                        <div class="icon"><svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                            </svg></div>
                        <div class="file-name">${name}</div>
                    </a>`;

        // Mapear categorías con entidades HTML si es necesario para la búsqueda en el archivo
        const categoryMap = {
            'Caracterización': 'Caracterizaci&oacute;n',
            'mejora contina': 'Mejora Continua'
        };
        const searchCategory = categoryMap[category] || category;

        // Buscar la categoría para insertar el item
        const categoryRegex = new RegExp(`(<h3[^>]*>${searchCategory}<\\/h3>[\\s\\S]*?<div [^>]*class="file-list-grid"[^>]*>)`, 'i');

        if (categoryRegex.test(content)) {
            content = content.replace(categoryRegex, (match) => match + newItemHtml);
            fs.writeFileSync(planeacionPath, content, 'utf8');
            return id;
        } else {
            // Si la categoría no existe, podríamos crearla, pero por ahora asumimos que existen.
            return null;
        }
    },

    delete: (id) => {
        if (!fs.existsSync(planeacionPath)) return false;
        let content = fs.readFileSync(planeacionPath, 'utf8');

        // Regex para encontrar el item por ID y eliminarlo
        const itemRegex = new RegExp(`<a [^>]*class="file-item" [^>]*data-id="${id}"[^>]*>[\\s\\S]*?<\\/a>`, 'g');

        if (itemRegex.test(content)) {
            content = content.replace(itemRegex, '');
            fs.writeFileSync(planeacionPath, content, 'utf8');
            return true;
        }
        return false;
    },

    update: (id, name, category, fileUrl) => {
        // Para editar, borramos y creamos de nuevo en la categoría correcta 
        // o simplemente reemplazamos si es la misma.
        // Implementación simplificada: Borrar y Crear.

        const deleted = SgiModel.delete(id);
        if (deleted) {
            return SgiModel.create(name, category, fileUrl);
        }
        return null;
    }
};

module.exports = SgiModel;
