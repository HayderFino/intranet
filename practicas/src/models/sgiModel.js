const fs = require('fs');
const path = require('path');

const planeacionPath = path.join(__dirname, '../../header_menu/sgi/planeacion-estrategica.html');

const SgiModel = {
    getAll: () => {
        if (!fs.existsSync(planeacionPath)) return [];
        const content = fs.readFileSync(planeacionPath, 'utf8');
        const items = [];

        // Regex mejorado: Busca el h3 y captura todo hasta el cierre de la sección que contiene el grid
        const categoryRegex = /<section class="category-section">[\s\S]*?<h3>(.*?)<\/h3>[\s\S]*?<div class="file-list-grid">([\s\S]*?)<\/div>\s*<\/section>/g;

        let catMatch;
        while ((catMatch = categoryRegex.exec(content)) !== null) {
            const reverseCategoryMap = {
                'Caracterizaci&oacute;n': 'Caracterización',
                'Mejora Continua': 'Mejora Continua'
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

        // Regex para encontrar el item por ID
        const itemRegex = new RegExp(`<a [^>]*class="file-item"[^>]*data-id="${id}"[^>]*>[\\s\\S]*?<\\/a>`, 'g');
        const match = itemRegex.exec(content);

        if (match) {
            const itemHtml = match[0];
            const hrefMatch = /href="([^"]*)"/.exec(itemHtml);

            // Si tiene un href válido (y no es un placeholder como "#")
            if (hrefMatch && hrefMatch[1] && hrefMatch[1] !== '#') {
                const relativePath = hrefMatch[1];
                // Convertir ../../data/... a una ruta absoluta del sistema
                // El href es relativo a header_menu/sgi/
                const absolutePath = path.join(__dirname, '../../header_menu/sgi/', relativePath);

                try {
                    if (fs.existsSync(absolutePath)) {
                        fs.unlinkSync(absolutePath);
                        console.log(`Archivo eliminado físicamente: ${absolutePath}`);
                    }
                } catch (err) {
                    console.error(`Error al eliminar archivo físico: ${err.message}`);
                    // Continuamos con el borrado del HTML aunque falle el archivo físico
                }
            }

            // Eliminar del HTML
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
