const model = require('./src/models/convocatoriasModel');
try {
    const items = model.getAll();
    console.log('Items from model:', items.length);
    if (items.length > 0) {
        console.log('Sample item:', JSON.stringify(items[0], null, 2));
    }
} catch (e) {
    console.error('Error calling model.getAll():', e.message);
}
