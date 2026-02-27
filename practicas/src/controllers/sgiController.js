const SgiModel = require('../models/sgiModel');
const path = require('path');
const fs = require('fs');

const SgiController = {
    getPlaneacionItems: (req, res) => {
        try {
            const items = SgiModel.getAll();
            res.status(200).json(items);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener items de SGI.' });
        }
    },

    createPlaneacionItem: (req, res) => {
        const { name, category, fileUrl } = req.body;
        if (!name || !category || !fileUrl) {
            return res.status(400).json({ message: 'Faltan campos obligatorios (nombre, categoría o URL del archivo).' });
        }

        try {
            const id = SgiModel.create(name, category, fileUrl);
            if (id) {
                res.status(201).json({ message: 'Item de SGI creado con éxito.', id });
            } else {
                res.status(404).json({ message: `Categoría "${category}" no encontrada.` });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al crear item de SGI.' });
        }
    },

    deletePlaneacionItem: (req, res) => {
        const id = req.params.id;
        try {
            const deleted = SgiModel.delete(id);
            if (deleted) {
                res.status(200).json({ message: 'Item eliminado correctamente.' });
            } else {
                res.status(404).json({ message: 'Item no encontrado.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al eliminar item.' });
        }
    },

    uploadFile: (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ningún archivo.' });
        }
        // Devolvemos la ruta relativa respecto a la raíz del sitio (desde header_menu/sgi/)
        const category = req.body.category || 'Varios';
        const fileUrl = `../../data/sgi/Procesos Estratégicos/Planeación Estratégica/${category}/${req.file.filename}`;
        res.status(200).json({ fileUrl });
    },

    updatePlaneacionItem: (req, res) => {
        const id = req.params.id;
        const { name, category, fileUrl } = req.body;

        try {
            const newId = SgiModel.update(id, name, category, fileUrl);
            if (newId) {
                res.status(200).json({ message: 'Documento actualizado.', id: newId });
            } else {
                res.status(404).json({ message: 'No se pudo actualizar el documento.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al actualizar.' });
        }
    }
};

module.exports = SgiController;
