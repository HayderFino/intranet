const News = require('./MongoNews');

const NewsModel = {
    getAll: async () => {
        try {
            const news = await News.find().sort({ createdAt: -1 });
            return news.map(item => ({
                id: item._id.toString(),
                title: item.title,
                description: item.description,
                imageUrl: item.imageUrl,
                category: item.category,
                createdAt: item.createdAt
            }));
        } catch (error) {
            console.error('Error reading from MongoDB:', error);
            return [];
        }
    },

    create: async (title, description, imageUrl, category = 'General') => {
        try {
            const fixedImageUrl = imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl;

            const newNews = new News({
                title,
                description,
                imageUrl: fixedImageUrl,
                category,
                createdAt: new Date()
            });

            const saved = await newNews.save();
            return saved._id.toString();
        } catch (error) {
            console.error('Error writing to MongoDB:', error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const result = await News.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            console.error('Error deleting from MongoDB:', error);
            throw error;
        }
    }
};

module.exports = NewsModel;
