const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Configuración de MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/intranet_cas';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

const newsRoutes = require('./src/routes/newsRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './')));
app.use('/data', express.static(path.join(__dirname, 'data')));

// API Routes
app.use('/api/news', newsRoutes);
app.use('/api/agenda', require('./src/routes/agendaRoutes'));
app.use('/api/sgi', require('./src/routes/sgiRoutes'));
app.use('/api/respel', require('./src/routes/respelRoutes'));
app.use('/api/rua', require('./src/routes/ruaRoutes'));
app.use('/api/boletines', require('./src/routes/boletinesRoutes'));
app.use('/api/pcb', require('./src/routes/pcbRoutes'));
app.use('/api/manuales-sgi', require('./src/routes/manualesRoutes'));
app.use('/api/cita', require('./src/routes/citaRoutes'));
app.use('/api/sirh', require('./src/routes/sirhRoutes'));
app.use('/api/revision-red', require('./src/routes/revisionRedRoutes'));
app.use('/api/snif', require('./src/routes/snifRoutes'));
app.use('/api/manual-funciones', require('./src/routes/manualFuncionesRoutes'));
app.use('/api/plan-monitoreo', require('./src/routes/planMonitoreoRoutes'));
app.use('/api/planes-talento', require('./src/routes/planesTalentoRoutes'));


app.get('/api/debug/error', (req, res) => {
    const logPath = path.join(__dirname, 'error_log.txt');
    if (fs.existsSync(logPath)) {
        res.sendFile(logPath);
    } else {
        res.send('No hay logs de error.');
    }
});

app.use((err, req, res, next) => {
    const errorMsg = `[${new Date().toISOString()}] ${err.stack}\n`;
    fs.appendFileSync(path.join(__dirname, 'error_log.txt'), errorMsg);
    res.status(500).json({ message: 'Error interno del servidor.', error: err.message });
});

app.get('/administrador', (req, res) => res.redirect('/administracion'));

app.listen(PORT, () => {
    console.log(`Servidor CAS corriendo en http://localhost:${PORT}`);
    console.log(`Panel de administración en http://localhost:${PORT}/administracion`);
});

