/*
    path: /api/upload
*/

const { Router } = require('express');
const { uploadFile, destroyFile } = require('../controllers/upload');

const router = Router();

router.post('/', uploadFile);
router.delete('/', destroyFile);

module.exports = router;