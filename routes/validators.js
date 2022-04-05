/*
    path: /api/validators
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { addNewValidator, getValidators, deleteValidator, updateValidator } = require("../controllers/validator");
const { fieldValidators } = require("../middlewares/fields-validator");
const { validateJWT } = require("../middlewares/jwt-validator");

const router = Router();
// Todas tienes que pasar por la validación del JWT
router.use(validateJWT);

//rutas para el CRUD de validadores
// path /api/credits/validators
router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('description', 'La descripcion es obligatoria').not().isEmpty(),
    fieldValidators
], addNewValidator);

router.get('/', getValidators);

router.put('/:id', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('description', 'La descripcion es obligatoria').not().isEmpty(),
    fieldValidators
], updateValidator);

router.delete('/:id', deleteValidator);

module.exports = router;