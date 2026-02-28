const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const News = require('./src/models/MongoNews');

// Mongo URI (Default local)
const MONGO_URI = 'mongodb://127.0.0.1:27017/intranet_cas';

async function migrate() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('--- Conectado a MongoDB para migración ---');

        const noticiasPath = path.join(__dirname, 'data/noticias.json');
        if (!fs.existsSync(noticiasPath)) {
            console.log('No existe el archivo noticias.json para migrar.');
            process.exit(0);
        }

        const newsData = JSON.parse(fs.readFileSync(noticiasPath, 'utf8'));
        console.log(`Leídas ${newsData.length} noticias. Iniciando inserción...`);

        // Borrar datos previos para evitar duplicados en la migración (opcional)
        // await News.deleteMany({});

        for (const item of newsData) {
            const newsItem = new News({
                title: item.title,
                description: item.description,
                imageUrl: item.imageUrl,
                category: item.category || 'General',
                createdAt: item.createdAt ? new Date(item.createdAt) : new Date()
            });
            await newsItem.save();
            console.log(`✅ Migrada: ${item.title}`);
        }

        console.log('--- Migración finalizada con éxito ---');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error grave en migración:', err);
        process.exit(1);
    }
}

migrate();
