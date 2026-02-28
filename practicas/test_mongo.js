const NewsModel = require('./src/models/newsModel');
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/intranet_cas';

async function test() {
    try {
        await mongoose.connect(MONGO_URI);
        const news = await NewsModel.getAll();
        console.log(`Encontradas ${news.length} noticias en MongoDB.`);
        if (news.length > 0) {
            console.log('Primera noticia:', news[0].title);
        }
        process.exit(0);
    } catch (e) {
        console.error('Test fallido:', e);
        process.exit(1);
    }
}

test();
