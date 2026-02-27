const SgiModel = require('./src/models/sgiModel');

try {
    console.log('Testing create in mejora...');
    const id = SgiModel.create('mejora', 'Test Document', 'Procedimientos', '../../data/sgi/test.pdf');
    console.log('Created ID:', id);
} catch (e) {
    console.error('ERROR DETECTED:', e);
}
