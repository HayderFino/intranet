const SgiModel = require('./src/models/sgiModel');
try {
    console.log('Testing planeacion...');
    const p = SgiModel.getAll('planeacion');
    console.log('Planeacion count:', p.length);

    console.log('Testing mejora...');
    const m = SgiModel.getAll('mejora');
    console.log('Mejora count:', m.length);
} catch (e) {
    console.error('ERROR DETECTED:', e);
}
