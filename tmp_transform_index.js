const fs = require('fs');
const indexPath = 'c:/Users/HAYDER/Documents/intranet/intranet/practicas/index.html';
let content = fs.readFileSync(indexPath, 'utf8');

// Regex for the old style news items (without class "card")
const regex = /<div class=\"news-item\">([\s\S]*?)<img src=\"([^\"]*)\" alt=\"([^\"]*)\"[\s\S]*?class=\"news-image\">[\s\S]*?<h4>([\s\S]*?)<\/h4>([\s\S]*?)(<p>([\s\S]*?)<\/p>)?[\s\S]*?<\/div>/g;

const newStyleTemplate = (img, alt, title, descRaw) => {
    let desc = descRaw ? descRaw.trim() : "";
    return `
                    <div class="card news-item">
                        <img src="${img}" alt="${alt}" class="news-image" style="width: 100%; border-radius: 1rem;">
                        <div class="news-body" style="padding: 1.5rem;">
                            <h3 style="margin-top: 0;">${title.trim()}</h3>
                            ${desc ? `<p style="font-size: 0.9rem; color: var(--text-light); margin-top: 0.5rem;">${desc}</p>` : ''}
                        </div>
                    </div>`;
};

content = content.replace(regex, (match, beforeImg, img, alt, title, middle, pTag, desc) => {
    return newStyleTemplate(img, alt, title, desc);
});

fs.writeFileSync(indexPath, content);
console.log('index.html updated to premium card style');
