const fs = require('fs');
const path = require('path');

const BANNER_JSON_PATH = path.join(__dirname, '../../data/banner.json');

const BannerModel = {
    getAll: () => {
        try {
            if (!fs.existsSync(BANNER_JSON_PATH)) {
                return [];
            }
            const data = fs.readFileSync(BANNER_JSON_PATH, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer banner.json:', error);
            return [];
        }
    },

    saveAll: (banners) => {
        try {
            fs.writeFileSync(BANNER_JSON_PATH, JSON.stringify(banners, null, 2), 'utf8');
            return true;
        } catch (error) {
            console.error('Error al guardar banner.json:', error);
            return false;
        }
    },

    create: (data) => {
        const banners = BannerModel.getAll();
        const newBanner = {
            id: Date.now().toString(),
            title: data.title || '',
            description: data.description || '',
            imageUrl: data.imageUrl || '',
            link: data.link || '#',
            order: data.order || banners.length,
            createdAt: new Date().toISOString()
        };
        banners.push(newBanner);
        BannerModel.saveAll(banners);
        return newBanner;
    },

    update: (id, data) => {
        const banners = BannerModel.getAll();
        const index = banners.findIndex(b => b.id === id);
        if (index !== -1) {
            banners[index] = { ...banners[index], ...data };
            BannerModel.saveAll(banners);
            return banners[index];
        }
        return null;
    },

    delete: (id) => {
        const banners = BannerModel.getAll();
        const initialLength = banners.length;
        const filteredBanners = banners.filter(b => b.id !== id);
        if (filteredBanners.length < initialLength) {
            // Optional: delete actual image file if needed
            BannerModel.saveAll(filteredBanners);
            return true;
        }
        return false;
    }
};

module.exports = BannerModel;
