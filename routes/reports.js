/*
    path: /api/report
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { getReportData, getResultById } = require('../controllers/reports/report');
const { fieldValidators } = require('../middlewares/fields-validator');
const { validateJWT } = require('../middlewares/jwt-validator');

const router = Router();
router.use(validateJWT);

router.get('/:id', [
    check('id', 'El id es obligatorio').not().isEmpty(),
    fieldValidators
], getReportData);

router.get('/result/:id', [
    
    check('id', 'El id es obligatorio').not().isEmpty(),
    fieldValidators
], getResultById);

module.exports = router;