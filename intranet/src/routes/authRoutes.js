const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.get('/login', authController.login); // Permitir GET para pruebas rápidas
router.get('/logout', authController.logout);
router.get('/check', authController.checkSession);

module.exports = router;
