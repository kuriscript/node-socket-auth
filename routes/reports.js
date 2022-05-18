/*
    path: /api/report
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { getReportData } = require('../controllers/reports/report');
const { fieldValidators } = require('../middlewares/fields-validator');
const { validateJWT } = require('../middlewares/jwt-validator');

const router = Router();
router.use(validateJWT);

router.get('/:id', [
    check('id', 'El id es obligatorio').not().isEmpty(),
    fieldValidators
], getReportData);

module.exports = router;