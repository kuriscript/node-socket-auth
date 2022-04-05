/*
    path: api/question-types
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { getQuestionTypes, addNewQuestionType, updateQuestionType, deleteQuestionType } = require("../controllers/questionType");
const { fieldValidators } = require("../middlewares/fields-validator");
const { validateJWT } = require("../middlewares/jwt-validator");

const router = Router();


// Todas tienes que pasar por la validación del JWT
router.use(validateJWT);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    fieldValidators
], addNewQuestionType);

router.get('/', getQuestionTypes);

router.put('/:id', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    fieldValidators
], updateQuestionType);

router.delete('/:id', deleteQuestionType);

module.exports = router;