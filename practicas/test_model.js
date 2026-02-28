const NewsModel = require('./src/models/newsModel');
const news = NewsModel.getAll();
console.log(`Loaded ${news.length} news items.`);
if (news.length > 0) {
    console.log(`First item: ${JSON.stringify(news[0], null, 2)}`);
}
