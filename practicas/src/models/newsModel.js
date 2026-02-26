const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../../index.html');
const noticasPath = path.join(__dirname, '../../header_menu/cas/noticas-cas.html');

const NewsModel = {
    getAll: () => {
        if (!fs.existsSync(indexPath)) return [];
        const content = fs.readFileSync(indexPath, 'utf8');
        const newsItems = [];
        const regex = /<div class="[^"]*news-item[^"]*" data-id="(\d+)">[\s\S]*?<h[34].*?>(.*?)<\/h[34]>[\s\S]*?<p>(.*?)<\/p>[\s\S]*?<\/div>/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
            newsItems.push({
                id: match[1],
                title: match[2],
                description: match[3]
            });
        }
        return newsItems;
    },

    create: (title, description, imageUrl) => {
        const newsId = Date.now();
        const newsHtml = `
                    <!-- Nueva Noticia Automatizada -->
                    <div class="news-item" data-id="${newsId}">
                        <img src="${imageUrl}" alt="${title}" class="news-image">
                        <h4>${title}</h4>
                        <p>${description}</p>
                    </div>`;

        // Update index.html
        if (fs.existsSync(indexPath)) {
            let indexContent = fs.readFileSync(indexPath, 'utf8');
            const marker = '<div class="news-grid">';
            if (indexContent.includes(marker)) {
                indexContent = indexContent.replace(marker, marker + newsHtml);
                fs.writeFileSync(indexPath, indexContent);
            }
        }

        // Update noticas-cas.html
        if (fs.existsSync(noticasPath)) {
            let noticasContent = fs.readFileSync(noticasPath, 'utf8');
            const noticasMarker = '<div class="news-grid" id="noticas-grid">';
            const fallbackMarker = '<div class="news-grid">';
            const targetMarker = noticasContent.includes(noticasMarker) ? noticasMarker : fallbackMarker;

            if (noticasContent.includes(targetMarker)) {
                // Adjust path for deep file
                const notiItemHtml = newsHtml.replace('src="data/imagenes/', 'src="../../data/imagenes/');
                noticasContent = noticasContent.replace(targetMarker, targetMarker + notiItemHtml);
                fs.writeFileSync(noticasPath, noticasContent);
            }
        }

        return newsId;
    },

    delete: (id) => {
        const files = [indexPath, noticasPath];
        files.forEach(filePath => {
            if (fs.existsSync(filePath)) {
                let content = fs.readFileSync(filePath, 'utf8');
                const regex = new RegExp(`<!-- Nueva Noticia Automatizada -->\\s*<div class="news-item" data-id="${id}">[\\s\\S]*?</div>`, 'g');
                content = content.replace(regex, '');
                fs.writeFileSync(filePath, content);
            }
        });
        return true;
    }
};

module.exports = NewsModel;
