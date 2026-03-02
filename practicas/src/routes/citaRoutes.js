const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const CitaController = require('../controllers/citaController');

const upload = multer({ dest: 'uploads/' });

router.get('/', CitaController.getAll);
router.post('/', upload.single('file'), CitaController.create);
router.delete('/:id', CitaController.delete);

module.exports = router;
