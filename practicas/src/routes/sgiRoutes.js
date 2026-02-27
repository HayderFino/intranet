const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const sgiController = require('../controllers/sgiController');

// Configuración de Multer para archivos SGI (PDFs, etc)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Obtenemos la categoría desde el body para determinar la subcarpeta
        const category = req.body.category || 'Varios';
        const destPath = path.join(__dirname, '../../data/sgi/Procesos Estratégicos/Planeación Estratégica', category);

        // Creamos la carpeta si no existe
        if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath, { recursive: true });
        }
        cb(null, destPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Rutas API
router.get('/planeacion', sgiController.getPlaneacionItems);
router.post('/planeacion', sgiController.createPlaneacionItem);
router.delete('/planeacion/:id', sgiController.deletePlaneacionItem);
router.post('/upload', upload.single('file'), sgiController.uploadFile);

module.exports = router;
