/*
    path: /api/categories
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { addNewCategory, getCategories, deleteCategory, getQuestionsCategoryById, updateCategory, getCategoryById, deleteCategoryFormAndQuestions } = require('../controllers/category');
const { fieldValidators } = require('../middlewares/fields-validator');
const { validateJWT } = require('../middlewares/jwt-validator');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use(validateJWT);

//rutas para el CRUD de categorias
// path /api/categories
router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('description', 'La descripcion es obligatoria').not().isEmpty(),
    fieldValidators
], addNewCategory);

router.get('/', getCategories);

router.put('/:id', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('description', 'La descripcion es obligatoria').not().isEmpty(),
    fieldValidators
], updateCategory);

router.delete('/:id', deleteCategory);

router.get('/:id', getCategoryById);

router.get('/questions/:id', getQuestionsCategoryById);

router.delete('/questions/:id', deleteCategoryFormAndQuestions);

module.exports = router;