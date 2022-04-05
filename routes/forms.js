/*
    path: /api/form
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { getCategoriesForm, addCategoryForm, deleteCategoryForm } = require('../controllers/category');
const {
    addNewForm,
    updateForm,
    deleteForm,
    getForms,
    getFinalForm,
    getFirstValues,
    getFormById,
    getFinalFormByPath } = require('../controllers/form');
const { fieldValidators } = require('../middlewares/fields-validator');
const { validateJWT } = require('../middlewares/jwt-validator');

const router = Router();


//Public routes

router.get('/form/:id', getFinalForm);
router.get('/path/:path', getFinalFormByPath);

router.get('/paths', getForms);

// Todas tiene que pasar por la validación del JWT
router.use(validateJWT);

//rutas para el CRUD de los formularios
router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('description', 'La descripcion es obligatoria').not().isEmpty(),
    check('path', 'El path es obligatorio').not().isEmpty(),
    fieldValidators
], addNewForm);

router.get('/', getForms);

router.put('/:id', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('description', 'La descripcion es obligatoria').not().isEmpty(),
    fieldValidators
], updateForm);

router.delete('/:id', deleteForm);

router.get('/detail/:id', getFormById);

//InitialValues

router.get('/categories/:id', getCategoriesForm);

//custom apis

router.post('/categories/:id', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('description', 'La descripcion es obligatoria').not().isEmpty(),
    fieldValidators
], addCategoryForm);

router.delete('/category/:id', deleteCategoryForm);

router.get('/first-values', getFirstValues);

module.exports = router;