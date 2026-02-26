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

app.listen(PORT, () => {
    console.log(`Servidor CAS corriendo en http://localhost:${PORT}`);
    console.log(`Panel de administración en http://localhost:${PORT}/administrador`);
});
