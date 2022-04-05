/*
    path: /api/options
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { addNewOption, getOptions, updateOption, deleteOption } = require("../controllers/option");
const { fieldValidators } = require("../middlewares/fields-validator");
const { validateJWT } = require("../middlewares/jwt-validator");

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use(validateJWT);

//rutas para el CRUD de opciones
// path /api/credits/options
router.post('/', [
    check('description', 'La descripcion es obligatoria').not().isEmpty(),
    fieldValidators
], addNewOption);

router.get('/', getOptions);

router.put('/:id', [
    check('description', 'La descripcion es obligatoria').not().isEmpty(),
    fieldValidators
], updateOption);

router.delete('/:id', deleteOption);

module.exports = router;