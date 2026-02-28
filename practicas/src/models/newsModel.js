const fs = require('fs');
const path = require('path');

const noticiasPath = path.join(__dirname, '../../data/noticias.json');

const NewsModel = {
    getAll: () => {
        if (!fs.existsSync(noticiasPath)) return [];
        try {
            const content = fs.readFileSync(noticiasPath, 'utf8');
            return JSON.parse(content);
        } catch (error) {
            console.error('Error reading noticias.json:', error);
            return [];
        }
    },

    create: (title, description, imageUrl, category = 'General') => {
        const newsArray = NewsModel.getAll();
        const newsId = Date.now().toString();

        // Ensure imageUrl starts with /
        const fixedImageUrl = imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl;

        const newNews = {
            id: newsId,
            title,
            description,
            imageUrl: fixedImageUrl,
            category,
            createdAt: new Date().toISOString()
        };

        newsArray.unshift(newNews); // Prepend new news

        try {
            fs.writeFileSync(noticiasPath, JSON.stringify(newsArray, null, 2), 'utf8');
            return newsId;
        } catch (error) {
            console.error('Error writing noticias.json:', error);
            throw error;
        }
    },

    delete: (id) => {
        let newsArray = NewsModel.getAll();
        const filtered = newsArray.filter(item => item.id !== id);

        if (newsArray.length === filtered.length) return false;

        try {
            fs.writeFileSync(noticiasPath, JSON.stringify(filtered, null, 2), 'utf8');
            return true;
        } catch (error) {
            console.error('Error deleting news:', error);
            throw error;
        }
    }
};

module.exports = NewsModel;
