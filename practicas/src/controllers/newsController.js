const NewsModel = require('../models/newsModel');
const path = require('path');
const fs = require('fs');

const NewsController = {
    getAllNews: (req, res) => {
        try {
            const news = NewsModel.getAll();
            res.status(200).json(news);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener noticias.' });
        }
    },

    createNews: (req, res) => {
        const { title, description, imageUrl } = req.body;
        if (!title || !description || !imageUrl) {
            return res.status(400).json({ message: 'Faltan campos obligatorios.' });
        }

        try {
            const id = NewsModel.create(title, description, imageUrl);
            res.status(201).json({ message: 'Noticia creada con éxito.', id });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear la noticia.' });
        }
    },

    deleteNews: (req, res) => {
        const id = req.params.id;
        try {
            NewsModel.delete(id);
            res.status(200).json({ message: 'Noticia eliminada.' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar la noticia.' });
        }
    },

    uploadImage: (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ninguna imagen.' });
        }
        const imageUrl = `data/imagenes/${req.file.filename}`;
        res.status(200).json({ imageUrl });
    }
};

module.exports = NewsController;
