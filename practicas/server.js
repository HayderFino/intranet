const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

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

