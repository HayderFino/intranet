const fs = require('fs');
const path = require('path');

const indexPath = 'c:/Users/HAYDER/Documents/intranet/intranet/practicas/index.html';
const noticasPath = 'c:/Users/HAYDER/Documents/intranet/intranet/practicas/header_menu/cas/noticas-cas.html';

function convertToCardStyle(filePath, isSubdir = false) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Regex to find old-style news items (without class "card")
    // Target matches like:
    // <div class="news-item" data-id="1772134503804">
    //    <img src="..." alt="..." class="news-image">
    //    <h4>...</h4>
    //    <p>...
    // </p>
    // </div>
    const regex = /<!-- Nueva Noticia Automatizada -->\s*<div class="news-item" data-id="(\d+)">\s*<img src="([^"]+)" alt="([^"]+)" class="news-image">\s*<h4[^>]*>([\s\S]*?)<\/h4>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<\/div>/g;

    const newContent = content.replace(regex, (match, id, img, alt, title, desc) => {
        return `
                    <!-- Nueva Noticia Automatizada -->
                    <div class="card news-item" data-id="${id}">
                        <img src="${img}" alt="${alt}" class="news-image" style="width: 100%; border-radius: 1rem;">
                        <div class="news-body" style="padding: 1.5rem;">
                            <h3 style="margin-top: 0;">${title.trim()}</h3>
                            <p style="font-size: 0.9rem; color: var(--text-light); margin-top: 0.5rem;">${desc.trim()}</p>
                        </div>
                    </div>`;
    });

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Converted items in ${filePath}`);
    } else {
        console.log(`No items found to convert in ${filePath}`);
    }
}

convertToCardStyle(indexPath);
convertToCardStyle(noticasPath, true);
