/*
    path: /api/upload
*/

const { Router } = require('express');
const { uploadFile } = require('../controllers/upload');

const router = Router();

router.post('/', uploadFile);

module.exports = router;