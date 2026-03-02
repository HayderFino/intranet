const CitaModel = require('../models/citaModel');
const path = require('path');
const fs = require('fs');

const CitaController = {
    getAll: (req, res) => {
        try {
            const items = CitaModel.getAll();
            res.json(items);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener manuales CITA', error: error.message });
        }
    },

    create: (req, res) => {
        try {
            const { name, category } = req.body;
            let fileUrl = '#';

            if (req.file) {
                // Ensure unique filename to avoid overwrites
                const filename = `${Date.now()}-${req.file.originalname}`;

                // Determine destination based on category
                const categoryPaths = {
                    'guias liquidaciones': 'data/menu header/git/manuales de usuario/cita/guias liquidaciones',
                    'guias permisos': 'data/menu header/git/manuales de usuario/cita/guias permisos',
                    'guias sancionatorias': 'data/menu header/git/manuales de usuario/cita/guias sancionatorias',
                    'procedimientos permisos': 'data/menu header/git/manuales de usuario/cita/procedimientos permisos',
                    'procedimientos sancionatorios': 'data/menu header/git/manuales de usuario/cita/procedimientos sancionatorios'
                };

                const relativeDest = categoryPaths[category] || 'data/menu header/git/manuales de usuario/cita';
                const destDir = path.join(__dirname, '../../', relativeDest);

                if (!fs.existsSync(destDir)) {
                    fs.mkdirSync(destDir, { recursive: true });
                }

                const finalPath = path.join(destDir, filename);
                fs.renameSync(req.file.path, finalPath);

                // Calculate relative path for HTML from the HTML file location
                // cita.html is in header_menu/git/manuales_usuario/cita.html
                // data is in ../../../data/...
                fileUrl = `../../../${relativeDest}/${filename}`;
            }

            const id = CitaModel.create({ name, category, fileUrl });
            if (id) {
                res.status(201).json({ id, message: 'Manual CITA creado con éxito' });
            } else {
                res.status(400).json({ message: 'No se pudo crear el manual CITA. Categoría no encontrada?' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al crear manual CITA', error: error.message });
        }
    },

    delete: (req, res) => {
        try {
            const { id } = req.params;
            const success = CitaModel.delete(id);
            if (success) {
                res.json({ message: 'Manual CITA eliminado con éxito' });
            } else {
                res.status(404).json({ message: 'Manual CITA no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar manual CITA', error: error.message });
        }
    }
};

module.exports = CitaController;
