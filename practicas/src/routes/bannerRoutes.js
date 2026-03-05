const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const BannerController = require('../controllers/bannerController');

// Configuration for Banner Images and Files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = '';
        if (file.fieldname === 'image') {
            uploadPath = path.join(__dirname, '../../data/menu header/index/imagenes-banner');
        } else if (file.fieldname === 'file') {
            uploadPath = path.join(__dirname, '../../data/menu header/index/archivos banner');
        } else {
            uploadPath = path.join(__dirname, '../../uploads'); // fallback
        }

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', BannerController.getAllBanners);
router.post('/', BannerController.createBanner);
router.put('/:id', BannerController.updateBanner);
router.delete('/:id', BannerController.deleteBanner);

// Upload endpoint for multiple files (image and document)
router.post('/upload', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 }
]), BannerController.uploadFiles);

module.exports = router;
