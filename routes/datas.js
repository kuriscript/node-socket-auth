/*
    path: /api/credit-request
*/

const { Router } = require('express');
const { check } = require('express-validator');
const {
    saveData,
    getData,
    saveImagesPath } = require('../controllers/data');
const { fieldValidators } = require('../middlewares/fields-validator');
const { validateJWT } = require('../middlewares/jwt-validator');

const router = Router();

router.post('/', [
    check('data', 'Los datos del formulario son obligatorios').not().isEmpty(),
    fieldValidators
], saveData);

router.post('/images', [
    check('dataId', 'El dataId es obligatorio').not().isEmpty(),
    check('images', 'Los datos del formulario son obligatorios').not().isEmpty(),
    fieldValidators
], saveImagesPath);

//with token validation

router.use(validateJWT);

router.get('/', getData);



module.exports = router;