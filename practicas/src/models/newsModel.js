const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../../index.html');
const noticasPath = path.join(__dirname, '../../header_menu/cas/noticas-cas.html');

const NewsModel = {
    getAll: () => {
        if (!fs.existsSync(indexPath)) return [];
        const content = fs.readFileSync(indexPath, 'utf8');
        const newsItems = [];
        // Regex mejorada: soporte para saltos de línea (\s\S), 
        // id de datos opcional (solo captura los que tienen id),
        // y mayor flexibilidad con h3/h4 y espacios.
        const regex = /<div [^>]*class="[^"]*news-item[^"]*"[^>]*data-id="(\d+)"[^>]*>[\s\S]*?<img [^>]*src="([^"]*)"[\s\S]*?<h[34][^>]*>([\s\S]*?)<\/h[34]>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/div>/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
            newsItems.push({
                id: match[1],
                imageUrl: match[2],
                title: match[3].trim(),
                description: match[4].trim()
            });
        }
        return newsItems;
    },

    create: (title, description, imageUrl) => {
        const newsId = Date.now();
        const newsHtml = `
                    <!-- Nueva Noticia Automatizada -->
                    <div class="card news-item" data-id="${newsId}">
                        <img src="${imageUrl}" alt="${title}" class="news-image" style="width: 100%; border-radius: 1rem;">
                        <div class="news-body" style="padding: 1.5rem;">
                            <h3 style="margin-top: 0;">${title}</h3>
                            <p style="font-size: 0.9rem; color: var(--text-light); margin-top: 0.5rem;">${description}</p>
                        </div>
                    </div>`;

        // Update index.html
        if (fs.existsSync(indexPath)) {
            let indexContent = fs.readFileSync(indexPath, 'utf8');
            // Marker flexible: busca <div class="news-grid"> con posibles espacios o atributos
            const markerRegex = /<div [^>]*class="news-grid"[^>]*>/;
            if (markerRegex.test(indexContent)) {
                indexContent = indexContent.replace(markerRegex, (match) => match + newsHtml);
                fs.writeFileSync(indexPath, indexContent);
            }
        }

        // Update noticas-cas.html
        if (fs.existsSync(noticasPath)) {
            let noticasContent = fs.readFileSync(noticasPath, 'utf8');
            // Marker flexible para el grid de noticias en NotiCAS
            const targetMarkerRegex = /<div [^>]*class="[^"]*news-grid[^"]*"[^>]*id="noticas-grid"[^>]*>|<div [^>]*class="[^"]*news-grid"[^>]*>/;

            if (targetMarkerRegex.test(noticasContent)) {
                // Ajustar rutas para archivos en subcarpetas
                const notiItemHtml = newsHtml.replace('src="data/imagenes/', 'src="../../data/imagenes/');
                noticasContent = noticasContent.replace(targetMarkerRegex, (match) => match + notiItemHtml);
                fs.writeFileSync(noticasPath, noticasContent, 'utf8');
            }
        }

        return newsId;
    },

    delete: (id) => {
        const files = [indexPath, noticasPath];
        files.forEach(filePath => {
            if (fs.existsSync(filePath)) {
                let content = fs.readFileSync(filePath, 'utf8');
                const regex = new RegExp(`<!-- Nueva Noticia Automatizada -->\\s*<div [^>]*class="[^"]*news-item[^"]*" [^>]*data-id="${id}"[^>]*>[\\s\\S]*?</div>(\\s*</div>)?`, 'g');
                content = content.replace(regex, '');
                fs.writeFileSync(filePath, content, 'utf8');
            }
        });
        return true;
    }
};

module.exports = NewsModel;
