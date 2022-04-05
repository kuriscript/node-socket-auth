/*
    path: /api/credit-request
*/

const { Router } = require('express');
const { check } = require('express-validator');
const {
    saveFormData,
    getFormData } = require('../controllers/formData');
const { fieldValidators } = require('../middlewares/fields-validator');
const { validateJWT } = require('../middlewares/jwt-validator');

const router = Router();

router.post('/', [
    check('formData', 'Los datos del formulario son obligatorios').not().isEmpty(),
    fieldValidators
], saveFormData);

router.use(validateJWT);

router.get('/', getFormData);


module.exports = router;