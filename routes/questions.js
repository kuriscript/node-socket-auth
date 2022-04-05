/*
    path: /api/questions
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { addNewQuestion, getQuestions, getQuestionById, updateQuestion, deleteQuestion, addQuestionOptionsCategory, updateQuestionWithOptions, deleteQuestionWithOptions } = require("../controllers/question");
const { fieldValidators } = require("../middlewares/fields-validator");
const { validateJWT } = require("../middlewares/jwt-validator");

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use(validateJWT);

//rutas para el CRUD de preguntas
// path /api/questions
router.post('/', [
    check('description', 'La descripcion es obligatoria').not().isEmpty(),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('type', 'El tipo es obligatorio').not().isEmpty(),
    fieldValidators
], addNewQuestion);

router.get('/', getQuestions);

router.get('/:id', getQuestionById);

router.put('/:id', [
    check('description', 'La descripcion es obligatoria').not().isEmpty(),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('type', 'El tipo es obligatorio').not().isEmpty(),
    fieldValidators
], updateQuestion);

router.delete('/:id', deleteQuestion);

router.post('/question/:id', [
    check('description', 'La descripcion es obligatoria').not().isEmpty(),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('type', 'El tipo es obligatorio').not().isEmpty(),
    fieldValidators
], addQuestionOptionsCategory);

router.put('/question/:id', [
    check('description', 'La descripcion es obligatoria').not().isEmpty(),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('type', 'El tipo es obligatorio').not().isEmpty(),
    fieldValidators
], updateQuestionWithOptions);

router.delete('/question/:id', deleteQuestionWithOptions);

module.exports = router;